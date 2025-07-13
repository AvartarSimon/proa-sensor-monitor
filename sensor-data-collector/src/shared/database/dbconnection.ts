import { Pool } from 'pg';
import { type Config } from '../../config';

// Pure function to create database pool
export const createDatabasePool = (config: Config): Pool => {
    return new Pool({ connectionString: config.databaseUrl });
};
