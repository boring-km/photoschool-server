const db = require('../loaders/db');
const logger = require('../config/winston');

const getNotApprovedPosts = (index) => new Promise((resolve) => {
  db((connection) => {
    const query = `select *, (select nickname from user where userId = P.writerId) nickname from Post P where isApproved = false and isRejected = false order by upTime desc limit 10 offset ${index * 10};`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getNotApprovedPosts: ${err}`);
        throw err;
      }
      resolve(results);
    });
    connection.release();
  });
});

const processApproval = (email, postId, approval) => new Promise((resolve) => {
  let query = '';
  if (approval === 'approve') {
    query = `update Post set isApproved = true, isRejected = false where postId = ${postId} and true = (select if (isAdmin = true, true, false) from User where email = '${email}');`;
  } else if (approval === 'reject') {
    query = `update Post set isApproved = false, isRejected = true where postId = ${postId} and true = (select if (isAdmin = true, true, false) from User where email = '${email}');`;
  } else {
    resolve(false);
  }
  db((connection) => {
    logger.debug(query);
    connection.query(query, (err) => {
      if (err) {
        logger.error(`processApproval: ${err}`);
        throw err;
      }
      resolve(true);
    });
    connection.release();
  });
});

module.exports = {
  getNotApprovedPosts,
  processApproval,
};
