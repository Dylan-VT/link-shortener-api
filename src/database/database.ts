
import createConnectionPool, {sql} from '@databases/pg';
import tables from '@databases/pg-typed';
import DatabaseSchema, {serializeValue} from './__generated__/index';

const dotenv = require('dotenv')

dotenv.config()

export {sql};

const db = createConnectionPool();
export default db;

// You can list whatever tables you actually have here:
const {links, users} = tables<DatabaseSchema>({
  serializeValue,
});

export {links, users};