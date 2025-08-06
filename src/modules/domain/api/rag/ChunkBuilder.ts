import Handlebars from 'handlebars';
import { Chunk, ChunkSpec } from './types';

export type JSONValue = string | number | boolean | null | undefined | JSONValue[] | { [key: string]: JSONValue };

interface SubjectMatch {
  node: JSONValue;
  fullPath: string;
}

export const generateChunks = (dataTree: JSONValue, chunkSpecs: ChunkSpec[]): Chunk[] => {
  return chunkSpecs.flatMap(spec => {
    const matches = extractSubjectNodesWithPaths(dataTree, spec.subjectPath);
    return matches.map(match => {
      const context = buildUnifiedRenderContext(dataTree, match.fullPath);
      const text = renderTemplate(spec.embeddingTemplate, context);
      return {
        text,
        metadata: spec.metadata || {},
      };
    });
  });
};

const extractSubjectNodesWithPaths = (dataTree: JSONValue, subjectPath: string): SubjectMatch[] => {
  const resolvedPaths = resolveWildcardPaths(dataTree, subjectPath);
  return resolvedPaths.map(path => ({
    node: getNodeByPath(dataTree, path),
    fullPath: path,
  }));
};

const buildUnifiedRenderContext = (dataTree: JSONValue, subjectPath: string): JSONValue => {
  const pathSegments = subjectPath.split('.');
  const scopedTree = buildScopedTree(dataTree, pathSegments);
  // const subject = getNodeByPath(dataTree, subjectPath);
  return scopedTree;
};

const renderTemplate = (template: string, context: JSONValue): string => {
  if (typeof context !== 'object' || context === null) {
    throw new Error('Template context must be an object');
  }
  const compiled = Handlebars.compile(template);
  return compiled(context);
};

const resolveWildcardPaths = (tree: JSONValue, path: string): string[] => {
  const segments = path.split('.');
  const resolve = (node: JSONValue, segs: string[], currentPath: string[]): string[] => {
    if (segs.length === 0) return [currentPath.join('.')];
    const [head, ...tail] = segs;

    if (head === '*') {
      if (Array.isArray(node)) {
        return node.flatMap((_, idx) => resolve(node[idx], tail, [...currentPath, String(idx)]));
      } else if (typeof node === 'object' && node !== null) {
        return Object.keys(node).flatMap(key => resolve((node as Record<string, JSONValue>)[key], tail, [...currentPath, key]));
      } else {
        return [];
      }
    }

    const nextNode = (node as Record<string, JSONValue>)?.[head];
    if (nextNode === undefined) return [];
    return resolve(nextNode, tail, [...currentPath, head]);
  };

  return resolve(tree, segments, []);
};

const getNodeByPath = (tree: JSONValue, path: string): JSONValue => {
  return path.split('.').reduce((acc, segment) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, JSONValue>)[segment];
    }
    return undefined;
  }, tree);
};

const buildScopedTree = (node: JSONValue, segments: string[]): JSONValue => {
  if (segments.length === 0) return node;

  const [current, ...rest] = segments;

  if (Array.isArray(node)) {
    const index = parseInt(current, 10);
    if (isNaN(index) || index < 0 || index >= node.length) return undefined;
    return buildScopedTree(node[index], rest); // collapse array
  }

  if (typeof node === 'object' && node !== null) {
    const child = (node as Record<string, JSONValue>)[current];
    return {
      ...(node as Record<string, JSONValue>),
      [current]: buildScopedTree(child, rest),
    };
  }

  return undefined;
};
