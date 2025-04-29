import { getSpecByName, listAllSpecs } from '../specs/specRegistry';
import {
  SpecDefinition,
  SpecField,
  ObjectField,
  ArrayField
} from '../specs/types/spec.types';

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
const toPascalCase = (parts: string[]) => parts.map(capitalize).join('');

const nestedInterfaces: string[] = [];

const inferFieldType = (
  field: SpecField,
  domainName: string,
  pathParts: string[] = []
): string => {
  switch (field.type) {
    case 'string':
    case 'number':
    case 'boolean':
      return field.type;

    case 'enum':
      return field.options.map((opt) => `"${opt.value}"`).join(' | ');

    case 'object':
      const objectName = toPascalCase([domainName, ...pathParts]);
      nestedInterfaces.push(generateInterfaceFromFields(objectName, field.fields, domainName, pathParts));
      return objectName;

    case 'array':
      let itemType: string;

      if (field.itemType === 'object' && field.fields) {
        const arrayName = toPascalCase([domainName, ...pathParts]);
        nestedInterfaces.push(generateInterfaceFromFields(arrayName, field.fields, domainName, pathParts));
        itemType = arrayName;
      } else {
        itemType = field.itemType;
      }

      return `${itemType}[]`;

    default:
      return 'any';
  }
};

const generateInterfaceFromFields = (
  interfaceName: string,
  fields: Record<string, SpecField>,
  domainName: string,
  pathParts: string[] = []
): string => {
  let output = `export interface ${interfaceName} {`;

  for (const key in fields) {
    const field = fields[key];
    const tsType = inferFieldType(field, domainName, [...pathParts, key]);
    const optional = field.required ? '' : '?';
    output += `\n  ${key}${optional}: ${tsType};`;
  }

  // Add system metadata fields
  output += `\n  id: string;`;
  output += `\n  reference: string;`;
  output += `\n  createdBy: string;`;
  output += `\n  createdAt: string;`;
  output += `\n  updatedBy: string;`;
  output += `\n  updatedAt: string;`;

  output += `\n}`;
  return output;
};

export const generateTypesFromSpecs = (): string => {
  nestedInterfaces.length = 0; // Reset in case reused
  const mainInterfaces: string[] = [];

  const domains = listAllSpecs();

  for (const domain of domains) {
    const spec = getSpecByName(domain);
    if (!spec) continue;

    const domainInterfaceName = capitalize(domain);
    const mainInterface = generateInterfaceFromFields(domainInterfaceName, spec.fields, domain);
    mainInterfaces.push(mainInterface);
  }

  return [...mainInterfaces, ...nestedInterfaces].join('\n\n');
};
