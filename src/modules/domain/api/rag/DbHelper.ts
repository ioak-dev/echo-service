import { getCollectionByName } from '../../../../lib/dbutils';

const buildProjectionFields = (config: TableConfig): Record<string, 1> => {
    const projection: Record<string, 1> = { [config.idColumnName]: 1 };
    const fieldsToProject = new Set<string>();
    config.embedColumns.forEach(col => fieldsToProject.add(col));
    config.metadataColumns?.forEach(col => {
        if (typeof col === 'string') {
            fieldsToProject.add(col);
        } else {
            fieldsToProject.add(col.field);
        }
    });
    fieldsToProject.forEach(field => {
        projection[field] = 1;
    });
    return projection;
};

const formatRecord = (record: DatabaseRecord, config: TableConfig): DatabaseRecord => {
    const formatted: DatabaseRecord = {
        [config.idColumnName]: record[config.idColumnName],
        __tableName: config.tableName,
    };
    config.embedColumns.forEach(col => {
        formatted[col] = record[col];
    });
    config.metadataColumns?.forEach(col => {
        if (typeof col === 'string') {
            formatted[col] = record[col];
        } else {
            formatted[col.alias] = record[col.field];
        }
    });
    return formatted;
};

const fetchRelatedRecords = async (
    record: DatabaseRecord,
    config: TableConfig,
    realm: string,
    currentDepth: number,
    maxDepth: number
): Promise<Record<string, DatabaseRecord[]>> => {
    if (!config.relatedTables?.length || currentDepth >= maxDepth) {
        return {};
    }
    const relatedDataPromises = config.relatedTables.map(async relatedConfig => {
        try {
            const parentValue = record[relatedConfig.parentColumn];
            if (!parentValue) {
                console.warn(
                    `Parent column '${relatedConfig.parentColumn}' not found in record for table '${config.tableName}'. Skipping related data fetch.`
                );
                return [relatedConfig.tableName, []] as [string, DatabaseRecord[]];
            }
            const childRecords = await fetchTableData(
                realm,
                relatedConfig,
                parentValue,
                relatedConfig.childColumn,
                currentDepth + 1,
                maxDepth
            );
            return [relatedConfig.tableName, childRecords] as [string, DatabaseRecord[]];
        } catch (err) {
            console.warn(`Failed to fetch related data for '${relatedConfig.tableName}':`, err);
            return [relatedConfig.tableName, []] as [string, DatabaseRecord[]];
        }
    });
    const relatedEntries = await Promise.all(relatedDataPromises);
    return Object.fromEntries(relatedEntries);
};

export const fetchTableData = async (
    realm: string,
    config: TableConfig,
    parentValue?: any,
    childForeignKeyColumn?: string,
    currentDepth = 0,
    maxDepth = 3
): Promise<DatabaseRecord[]> => {
    const collection = getCollectionByName(realm, config.tableName);
    const query: DatabaseRecord = {};
    if (parentValue && childForeignKeyColumn) {
        query[childForeignKeyColumn] = parentValue;
    }
    const projectionFields = buildProjectionFields(config);
    // console.log(`Querying ${config.tableName} with:`, { query, projectionFields });
    const records = await collection.find(query, projectionFields).lean().exec();
    const formattedRecords: DatabaseRecord[] = await Promise.all(
        records.map(async (record: DatabaseRecord) => {
            const formatted = formatRecord(record, config);
            const relatedData = await fetchRelatedRecords(
                record,
                config,
                realm,
                currentDepth,
                maxDepth
            );
            if (Object.keys(relatedData).length > 0) {
                formatted.__relatedData = relatedData;
            }
            return formatted;
        })
    );
    // console.log(formattedRecords)
    return formattedRecords;
};
