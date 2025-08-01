const extractMetadataFromRecord = (
    record: DatabaseRecord,
    config: TableConfig
): BaseMetadataRecord => {
    const meta: BaseMetadataRecord = { recordId: String(record[config.idColumnName]) };
    config.metadataColumns?.forEach(col => {
        if (typeof col === 'string' && record[col] !== undefined) {
            meta[col] = record[col];
        } else if (
            typeof col === 'object' &&
            col.field &&
            col.alias &&
            record[col.field] !== undefined
        ) {
            meta[col.alias] = record[col.field];
        }
    });
    return meta;
};

export const generateChunkMetadata = (record: DatabaseRecord, config: TableConfig): RAGChunkMetadata => {
    const metadata: RAGChunkMetadata = {
        ...extractMetadataFromRecord(record, config),
        tableName: config.tableName,
    };
    if (record.__relatedData && config.relatedTables?.length) {
        metadata.relatedRecords = {};
        for (const relatedConfig of config.relatedTables) {
            const relatedRecords = record.__relatedData[relatedConfig.tableName];
            if (relatedRecords?.length) {
                const relatedMetadata = relatedRecords.map((relRec: DatabaseRecord) =>
                    extractMetadataFromRecord(relRec, relatedConfig)
                );
                metadata.relatedRecords[relatedConfig.tableName] = relatedMetadata;
            }
        }
    }
    return metadata;
};

export const splitTextIntoChunks = (
    text: string,
    globalSettings?: RAGDataSchema['globalSettings'],
): string[] => {
    const separator = globalSettings?.chunkSeparator || '\n\n';
    const maxSize = globalSettings?.maxChunkSize;
    if (!maxSize || text.length <= maxSize) return [text];
    const chunks: string[] = [];
    let remainingText = text;
    while (remainingText.length > 0) {
        if (remainingText.length <= maxSize) {
            chunks.push(remainingText);
            break;
        }
        let splitIndex = remainingText.lastIndexOf(separator, maxSize);
        splitIndex = splitIndex === -1 ? maxSize : splitIndex + separator.length;
        chunks.push(remainingText.substring(0, splitIndex).trim());
        remainingText = remainingText.substring(splitIndex).trim();
    }
    return chunks.filter(chunk => chunk.length > 0);
};
