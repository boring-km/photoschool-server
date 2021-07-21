const db = require('../loaders/db');
const logger = require('../config/winston');

const getNotApprovedPosts = (index) => new Promise((resolve) => {
  db((connection) => {
    const query = `select * from Post P where isApproved = false and isRejected = false limit 10 offset ${index * 10};`;
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

const approvePost = (email, postId) => new Promise((resolve) => {
  db((connection) => {
    const query = `update Post set isApproved = true, isRejected = false where postId = ${postId} and true = (select if (isAdmin = true, true, false) from User where email = '${email}');`;
    logger.debug(query);
    connection.query(query, (err) => {
      if (err) {
        logger.error(`approvePost: ${err}`);
        throw err;
      }
      resolve(true);
    });
    connection.release();
  });
});

const rejectPost = (email, postId) => new Promise((resolve) => {
  db((connection) => {
    const query = `update Post set isApproved = false, isRejected = true where postId = ${postId} and true = (select if (isAdmin = true, true, false) from User where email = '${email}');`;
    logger.debug(query);
    connection.query(query, (err) => {
      if (err) {
        logger.error(`rejectPost: ${err}`);
        throw err;
      }
      resolve(true);
    });
    connection.release();
  });
});

module.exports = {
  getNotApprovedPosts,
  approvePost,
  rejectPost,
};
