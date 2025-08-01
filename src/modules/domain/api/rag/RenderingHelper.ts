import Handlebars from 'handlebars';
import * as Utils from './utils';

const formatFieldValue = (key: string, value: any, indent = 0): string => {
    const pad = '  '.repeat(indent);
    const label = Utils.formatFieldNameAsLabel(key);

    if (value === null || value === undefined) {
        return `${pad}${label}: (empty)`;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return `${pad}${label}: ${value}`;
    }
    if (Array.isArray(value)) {
        if (value.length === 0) return `${pad}${label}: []`;

        const items = value
            .map((item, idx) => {
                // If the item is an object, recurse with an increased indent
                if (typeof item === 'object' && item !== null) {
                    const nested = Object.entries(item)
                        .map(([k, v]) => formatFieldValue(k, v, indent + 2))
                        .join('\n');
                    return `${pad}  - Item ${idx + 1}:\n${nested}`;
                }
                return `${pad}  - ${item}`;
            })
            .join('\n');
        return `${pad}${label}:\n${items}`;
    }
    if (typeof value === 'object') {
        const lines = Object.entries(value)
            .map(([k, v]) => formatFieldValue(k, v, indent + 1))
            .join('\n');
        return `${pad}${label}:\n${lines}`;
    }
    return `${pad}${label}: ${String(value)}`;
};

const renderRecordContent = (record: DatabaseRecord, config: TableConfig, indent = 0): string => {
    const pad = '  '.repeat(indent);
    const parts: string[] = [];

    // Render the main content fields
    if (config.embeddingTemplate) {
        try {
            const template = Handlebars.compile(config.embeddingTemplate, { noEscape: true });
            parts.push(pad + '  ' + template(record).trim());
        } catch (err) {
            console.error(`Error rendering template for '${config.tableName}':`, err);
        }
    } else {
        const fieldContent = config.embedColumns
            .map(col => {
                const val = record[col];
                // Indent fields relative to the record content block
                return val !== undefined ? formatFieldValue(col, val, indent) : null;
            })
            .filter(Boolean) as string[];
        if (fieldContent.length) {
            parts.push(fieldContent.join('\n'));
        }
    }

    // Recursively render related records
    if (record.__relatedData && config.relatedTables?.length) {
        for (const relatedConfig of config.relatedTables) {
            if (relatedConfig.doNotEmbed) continue;
            const relatedRecords = record.__relatedData[relatedConfig.tableName];
            if (!Array.isArray(relatedRecords) || !relatedRecords.length) continue;

            parts.push(`\n${pad}--- Related ${Utils.formatFieldNameAsLabel(relatedConfig.tableName)} ---`);

            const relatedContent = relatedRecords.map((relRecord: DatabaseRecord) =>
                renderRecordWithHeading(relRecord, relatedConfig, indent)
            );

            parts.push(relatedContent.join('\n\n'));
        }
    }

    return parts.filter(Boolean).join('\n');
};

export const renderRecordWithHeading = (record: DatabaseRecord, config: TableConfig, indent = 0): string => {
    if (config.doNotEmbed) {
        return '';
    }
    const pad = '  '.repeat(indent);
    const heading = `${pad}--- ${Utils.formatFieldNameAsLabel(config.tableName)} ---`;
    const content = renderRecordContent(record, config, indent + 1);

    return `${heading}\n${content}`;
};
