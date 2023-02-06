const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.HOST_NAME,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 0,
    database: process.env.DB_NAME,
});

function query(query) {
    return pool.query(query);
}

module.exports = {
    query: query
};