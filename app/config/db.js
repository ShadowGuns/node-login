const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const port = parseInt(process.env.PORT, 10);
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const db = process.env.DB;
const dialect = process.env.DIALECT;
const pool = {
    max: parseInt(process.env.POOL_MAX, 10),
    min: parseInt(process.env.POOL_MIN, 10),
    acquire: parseInt(process.env.POOL_ACQUIRE, 10),
    idle: parseInt(process.env.POOL_IDLE, 10)
}

module.exports={
    port,
    host,
    user,
    password,
    db,
    dialect,
    pool
}

