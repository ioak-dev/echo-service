export interface DataTreeSpec {
  collection: string;                      // Root collection name
  project?: string[];                      // Fields to include at this level
  relationships?: RelationshipSpec[];      // Recursive relationships
}

export interface RelationshipSpec {
  name: string;                            // Field name in the parent object
  localField?: string;                    // For lookups: field in parent
  foreignField?: string;                  // For lookups: field in child
  from?: string;                          // For lookups: target collection
  spec?: DataTreeSpec;                    // Recursive spec for nested relationships
}
