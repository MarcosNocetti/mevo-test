import { Provider } from '@nestjs/common';
import { resolve } from 'path';
import * as pgPromise from 'pg-promise';
const migrationFile = new pgPromise.QueryFile(resolve('src/migrations/migration.sql'), {
    minify: true
})

const config = {
    host: process.env.DB_HOST ?? 'localhost',
    port: 5432,
    database: process.env.DB_NAME ?? 'chatbots',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'mysecretpassword',
};

const pgp = pgPromise();

export const DbProvider: Provider = {
    provide: 'DbConnectionToken',
    useValue: pgp(config),
};

DbProvider.useValue.query(migrationFile)
    .then(() => {
        console.log('DDL Migration finished!')
    })
    .catch((error) => {
        console.log('Error on DDL migration: ', error)
        process.exit(1)
})

