type DatabaseRecord = Record<string, any>;

type MetadataColumn = string | { field: string; alias: string };

interface BaseMetadataRecord {
    recordId: string;
    [key: string]: any;
}

interface TableConfig {
    tableName: string;
    idColumnName: string;
    embedColumns: string[];
    metadataColumns?: MetadataColumn[];
    relatedTables?: RelatedTableConfig[];
    embeddingTemplate?: string;
    doNotEmbed?: boolean;
}

interface RelatedTableConfig extends TableConfig {
    parentColumn: string;
    childColumn: string;
}

interface RAGDataSchema {
    ragId: string;
    primaryTable: TableConfig;
    globalSettings?: {
        chunkSeparator?: string;
        maxChunkSize?: number;
        maxDepth?: number;
    };
}

interface RAGChunk {
    text: string;
    hash?: string;
    metadata: RAGChunkMetadata;
}

interface RAGChunkMetadata extends BaseMetadataRecord {
    tableName: string;
    chunkIndex?: number;
    totalChunks?: number;
    relatedRecords?: {
        [relatedTableName: string]: BaseMetadataRecord[];
    };
}