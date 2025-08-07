export interface DataTreeSpec {
  from: string;
  project?: string[];
  relationships?: ChildDataTreeSpec[];
}

export interface BaseChildDataTreeSpec {
  from: string;
  project?: string[];
  as?: string;
  parentField: string;
  childField: string;
  type: "embed" | "lookup"
}

export interface EmbedChildDataTreeSpec extends BaseChildDataTreeSpec {
  type: "embed"

  /**
   * Maps field names from the source table to field names on the target table.
   * Supports dot notation for grouping or nesting.
   * 
   * Example:
   * ```ts
   * { name: 'authorName' }
   * ```
   */
  embedFieldMap: Record<string, string>;
}

export interface LookupChildDataTreeSpec extends BaseChildDataTreeSpec {
  type: "lookup"
  relationships?: ChildDataTreeSpec[];
}

export type ChildDataTreeSpec = EmbedChildDataTreeSpec | LookupChildDataTreeSpec;

export interface ChunkSpec {
  /**
   * A path to the subject within the data tree.
   * 
   * Example:
   * ```ts
   * "sections.*.paragraphs.*"
   * ```
   */
  subjectPath: string;

  /**
   * A single Handlebars template that can access the pruned context.
   * From root to subject path, all arrays are converted into a single object
   * as part of denormalization. Anything below the subject path is retained
   * as the original data structure, and supports looping features of handlebars
   * 
   * Example:
   * ```handlebars
   * {{section.title}} - {{section.paragraph.text}}
   * ```
   */
  embeddingTemplate: string;
  metadata?: Record<string, unknown>;
}

export interface Chunk {
  text: string;
  metadata: Record<string, unknown>;
}
