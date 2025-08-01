import crypto from 'crypto';

export const computeHash = (text: string): string =>
    crypto.createHash('sha256').update(text).digest('hex');

export const formatFieldNameAsLabel = (field: string): string =>
    field.replace(/[_\-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
