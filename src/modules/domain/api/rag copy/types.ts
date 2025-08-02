// Type to represent the different kinds of relationships
type RelationshipType = 'lookup' | 'embedded';

interface Relationship {
  as: string; // The field name in the parent document for the child data
  relationshipType: RelationshipType;
  collection: string; // The target collection name
  project?: string[]; // Optional array of fields to project from the child documents
}


// Interface for a lookup relationship, defining the foreign key join
export interface LookupRelationship extends Relationship {
  relationshipType: 'lookup';
  fromField: string; // The field in the child collection to match
  localField: string; // The field in the parent collection to join on
}

// Interface for an embedded relationship
export interface EmbeddedRelationship extends Relationship {
  relationshipType: 'embedded';
  localField: string; // The field in the parent document that contains the embedded array
}

// Interface for a deeply nested relationship
// This combines a LookupRelationship with a full DataTreeSpec for the nested level.
export interface NestedRelationship {
  as: string; // The field name in the parent document for the nested data
  relationshipType: 'lookup'; // It must be a lookup to a new collection
  collection: string;
  localField: string; // The field in the parent to join on
  fromField: string; // The field in the child to match
  // This is the key: we embed a new DataTreeSpec for the child
  nestedSpec: Omit<DataTreeSpec, 'rootCollection'>; 
  // We use Omit because the rootCollection is already specified by the relationship itself.
}

export type DataTreeRelationship = LookupRelationship | EmbeddedRelationship | NestedRelationship;

// The core DataTreeSpec interface remains the blueprint for a single level of the tree.
export interface DataTreeSpec {
  rootCollection: string;
  project?: string[]; // Optional array of fields to project from the root document
  relationships?: DataTreeRelationship[];
}
