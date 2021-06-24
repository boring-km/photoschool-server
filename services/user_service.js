const db = require('../loaders/db');
const logger = require('../config/winston');

const isIncludeEmail = (email) => new Promise((resolve) => {
  db((connection) => {
    const query = `select count(*) 'count' from User where email = '${email}'`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`isIncludeEmail: ${err}`);
        throw err;
      }
      if (results[0].count > 0) resolve(true);
      else resolve(false);
    });
    connection.release();
  });
});

const findNickName = (email) => new Promise((resolve) => {
  db((connection) => {
    const query = `select nickname from User where email = '${email}';`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`findNickName: ${err}`);
        throw err;
      }
      resolve(results[0].nickname);
    });
  });
});

const insertUser = (email, nickname, schoolId) => new Promise((resolve) => {
  db((connection) => {
    const query = `insert into User(email, nickname, schoolId) values('${email}', '${nickname}', ${schoolId});`;
    logger.debug(query);
    connection.query(query, (err) => {
      if (err) {
        logger.error(`insertUser: ${err}`);
        throw err;
      }
      resolve(true);
    });
  });
});

module.exports = {
  isIncludeEmail,
  findNickName,
  insertUser,
};
