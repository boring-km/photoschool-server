const mysql = require('mysql');
const logger = require('../config/winston');

function getConnection(callback) {
    const config = {
        host: process.env.db_host,
        port: process.env.db_port,
        user: process.env.db_id,
        password: process.env.db_pw,
        database: process.env.db_database,
        connectionLimit: 20
    };
    let pool = mysql.createPool(config);
    pool.getConnection(function (err, conn) {
        if(!err) {
            callback(conn);
        } else {
            logger.info(err);
            logger.error("연결 에러?");
        }
    });

}

module.exports = getConnection;