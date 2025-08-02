export interface DataTreeSpec {
  from: string;
  project?: string[];
  relationships?: ChildDataTreeSpec[];
}

export interface ChildDataTreeSpec extends DataTreeSpec {
  as?: string; // alias
  parentField: string; // field in parent
  childField: string; // field in child
}
