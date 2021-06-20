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
            const query = `select nickname from User where email = '${email}';`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`findNickName: ${err}`);
                    resolve(false);
                }
                resolve(results[0].nickname);
            });
        })
    });
}

const insertUser = (email, nickname, schoolId) => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `insert into User(email, nickname, schoolId) values('${email}', '${nickname}', ${schoolId});`;
            logger.debug(query);
            connection.query(query, (err, _) => {
                if (err) {
                    logger.error(`insertUser: ${err}`);
                    resolve(false);
                }
                resolve(true);
            });
        })
    })
}

module.exports = {
    isIncludeEmail,
    findNickName,
    insertUser
}