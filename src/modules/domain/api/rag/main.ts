import Handlebars from 'handlebars';
import sanitizeHtml from 'sanitize-html';
import * as Utils from './utils';
import * as DbHelper from './DbHelper';
import * as RenderingHelper from './RenderingHelper';
import * as ChunkingHelper from './ChunkingHelper';

export const transformToRAGChunks = async (
    schema: RAGDataSchema,
    realm: string
): Promise<RAGChunk[]> => {
    const maxDepth = schema.globalSettings?.maxDepth ?? 3;
    const primaryRecords = await DbHelper.fetchTableData(
        realm,
        schema.primaryTable,
        undefined,
        undefined,
        0,
        maxDepth
    );
    const allChunks: RAGChunk[] = [];
    for (const record of primaryRecords) {
        const rawText = RenderingHelper.renderRecordWithHeading(record, schema.primaryTable);
        const cleanText = sanitizeHtml(rawText, {
            allowedTags: [],
            allowedAttributes: {},
            textFilter: text => text.trim(),
        });
        const chunks = ChunkingHelper.splitTextIntoChunks(cleanText, schema.globalSettings);
        const baseMetadata = ChunkingHelper.generateChunkMetadata(record, schema.primaryTable);
        chunks.forEach((text, index) => {
            allChunks.push({
                text,
                hash: Utils.computeHash(text),
                metadata: {
                    ...baseMetadata,
                    chunkIndex: index,
                    totalChunks: chunks.length,
                },
            });
        });
    }
    return allChunks;
};