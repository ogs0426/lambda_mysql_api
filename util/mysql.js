const mysql = require('mysql2/promise');

const db_pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    waitForConnection: false
});

const getConnection = async () => {
    try {
        const conn = await db_pool.getConnection();
        return conn;
    } catch (error) {
        console.error(`DB connection error : ${error.message}`);
        return null;
    }
};

const releaseConnection = async (conn) => {
    try {
        await conn.release();
    } catch (error) {
        console.error(`DB release error : ${error.message}`);
    }
};

module.exports = {
    getConnection,
    releaseConnection
}
