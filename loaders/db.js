const mysql = require('mysql');

const config = {
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_id,
    password: process.env.db_pw,
    database: process.env.db_database,
    connectionLimit: 20
};

let pool = mysql.createPool(config);

function getConnection(callback) {

    pool.getConnection(function (err, conn) {
        if(!err) {
            callback(conn);
        }
    });
}

module.exports = getConnection;