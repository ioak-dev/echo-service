import { loadSpec } from "./schemaValidator";
import { specsMap } from '../../specs/domains'

type FieldSpec = {
  type: string;
  required?: boolean;
  schema?: any;
};

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
const toPascalCase = (parts: string[]) =>
  parts.map(capitalize).join("");

const nestedInterfaces: string[] = [];

const inferTsType = (
  field: FieldSpec,
  domainName: string,
  pathParts: string[] = []
): string => {
  switch (field.type) {
    case "string":
    case "number":
    case "boolean":
    case "any":
      return field.type;

    case "object":
      if (!field.schema) return "Record<string, any>";
      const interfaceName = toPascalCase([domainName, ...pathParts]);
      nestedInterfaces.push(generateNestedInterface(interfaceName, field.schema, domainName, pathParts));
      return interfaceName;

    case "array":
      const itemType = inferTsType(field.schema, domainName, pathParts);
      return `${itemType}[]`;

    default:
      return "any";
  }
};

const generateNestedInterface = (
  interfaceName: string,
  spec: Record<string, FieldSpec>,
  domainName: string,
  pathParts: string[] = []
): string => {
  let fields = "";

  for (const field in spec) {
    const fieldDef = spec[field];
    const tsType = inferTsType(fieldDef, domainName, [...pathParts, field]);
    fields += `\n  ${field}${fieldDef.required ? "" : "?"}: ${tsType};`;
  }
  fields += `\n  id: string;`;
  fields += `\n  reference: string;`;
  fields += `\n  createdBy: string;`;
  fields += `\n  createdAt: string;`;
  fields += `\n  updatedBy: string;`;
  fields += `\n  updatedAt: string;`;

  return `export interface ${interfaceName} {${fields}\n}`;
};

export const generateTypes = (space: string): string => {
  const types: string[] = [];

  Object.keys(specsMap).forEach((specName) => {
    const spec = specsMap[specName];

    const domainInterfaceName = capitalize(specName);
    const mainInterface = generateNestedInterface(domainInterfaceName, spec.fields, specName);
    types.push(mainInterface);
  });

  return [...types, ...nestedInterfaces].join("\n\n");
};
