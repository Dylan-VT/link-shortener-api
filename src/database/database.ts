
import createConnectionPool, {sql} from '@databases/pg';
import tables from '@databases/pg-typed';
import DatabaseSchema, {serializeValue} from './__generated__/index';

export {sql};

const db = createConnectionPool('postgres://dbadmin:PNqEMKEC8Gc3Wwd@link-shortener.postgres.database.azure.com/postgres?sslmode=require');
export default db;

// You can list whatever tables you actually have here:
const {links} = tables<DatabaseSchema>({
  serializeValue,
});

export {links};