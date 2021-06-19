const db = require('../loaders/db');
const logger = require('../config/winston');

const isIncludeEmail = (email) => {
    return new Promise(resolve => {
        db((connection) => {
            connection.query(`select count(*) as 'count' from User where email = '${email}'`, (err, results) => {
                if (err) {
                    logger.error(`isIncludeEmail: ${err}`);
                    resolve(false)
                }
                if (results[0].count > 0) resolve(true);
                else resolve(false);
            });
            connection.release();
        });
    })
}

const findNickName = (email) => {
    return new Promise(resolve => {
        db((connection) => {
            connection.query(`select nickname from User where email = '${email}';`, (err, results) => {
                if (err) {
                    logger.error(`findNickName: ${err}`);
                    resolve(false);
                }
                resolve(results[0].nickname);
            });
        })
    });
}

module.exports = {
    isIncludeEmail,
    findNickName
}