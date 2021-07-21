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

const getSchoolRank = (index) => new Promise((resolve) => {
  db((connection) => {
    const query = `select S.region, S.schoolName, sum(P.views) sumOfViews, count(*) sumOfPosts, S.address
        from post P, user U, school S
        where P.writerId = U.userId and U.schoolId = S.schoolId and P.isApproved = true
        group by(U.schoolId)
        order by sumOfViews desc, sumOfPosts desc
        limit 20 offset ${index * 20};`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getSchoolRank: ${err}`);
        throw err;
      }
      resolve(results);
    });
    connection.release();
  });
});

module.exports = {
  searchSchoolName,
  getMySchoolInfo,
  getSchoolRank,
};
