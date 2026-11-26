import { createClient } from '@libsql/client';

const isTurso = Boolean(
    process.env.TURSO_DATABASE_URL?.trim && process.env.TURSO_AUTH_TOKEN?.trim()
);

export const db = createClient({
    url: isTurso ? process.env.TURSO_DATABASE_URL! : 'file:local.db',
    authToken: isTurso ? process.env.TURSO_AUTH_TOKEN : undefined,
});

export const baseType = isTurso ? 'Turso' : 'fichier local';
