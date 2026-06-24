import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { envConfig } from '../env';

const runMigration = async () => {
    console.log('Running migrations...');
    const pool = new Pool({ connectionString: envConfig.DATABASE_URL, max: 1 });
    const db = drizzle(pool);

    try {
        await migrate(db, { migrationsFolder: './src/db/migrations' });
        console.log('Migrations complete!');
    } catch (error) {
        console.error('Migration failed with error:', error);
    } finally {
        await pool.end();
        process.exit(0);
    }
};

runMigration();
