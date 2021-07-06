const db = require('../loaders/db');
const logger = require('../config/winston');

const searchSchoolName = (schoolName) => new Promise((resolve) => {
  db((connection) => {
    const query = `select * from school where schoolName like '%${schoolName}%';`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`searchSchoolName: ${err}`);
        throw err;
      }
      resolve(results);
    });
    connection.release();
  });
});

const getMySchoolInfo = (email) => new Promise((resolve) => {
  db((connection) => {
    const query = `select S.region, S.schoolName, S.address from School S, User U where S.schoolId = U.schoolId and U.email = '${email}';`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getMySchoolInfo: ${err}`);
        throw err;
      }
      if (!results.isEmpty) {
        resolve(results[0]);
      } else {
        resolve(false);
      }
    });
    connection.release();
  });
});

module.exports = {
  searchSchoolName,
  getMySchoolInfo,
};
