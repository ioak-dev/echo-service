export interface DataTreeSpec {
  from: string;
  project?: string[];
  relationships?: ChildDataTreeSpec[];
}

export interface ChildDataTreeSpec extends DataTreeSpec {
  as?: string; // alias
  parentField: string;
  childField: string;
}

export interface ChunkSpec {
  subjectPath: string; // e.g., "sections.*.paragraphs.*"
  embeddingTemplate: string; // A single Handlebars template that can access the pruned context
  metadata?: Record<string, unknown>;
}

export interface Chunk {
  text: string;
  metadata: Record<string, unknown>;
}