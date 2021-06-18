const db = require('../loaders/db');
const logger = require('../config/winston');

const searchSchoolName = (schoolName) => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `select * from school where schoolName like '%${schoolName}%';`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`searchSchoolName: ${err}`);
                    resolve(false);
                }
                resolve(results);
            });
            connection.release();
        });
    });
}

module.exports = {
    searchSchoolName
}