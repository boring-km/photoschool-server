const db = require('../loaders/db');
const logger = require('../config/winston');

const updateTitle = (email, postId, title) => new Promise((resolve) => {
  db((connection) => {
    const query = `update Post
        set title = '${title}', upTime = now(), isApproved = false, isRejected = false
        where postId = '${postId}' and writerId = (select userId from User where email = '${email}');`;
    logger.debug(query);
    connection.query(query, (err) => {
      if (err) {
        logger.error(`updateTitle: ${err}`);
        throw err;
      }
      resolve(true);
    });
    connection.release();
  });
});

const updateImage = (email, postId, tbImgURL, imgURL) => new Promise((resolve) => {
  db((connection) => {
    const query = `update Post
        set tbImgURL = '${tbImgURL}', imgURL = '${imgURL}', upTime = now(), isApproved = false, isRejected = false
        where postId = '${postId}' and writerId = (select userId from User where email = '${email}');`;
    logger.debug(query);
    connection.query(query, (err) => {
      if (err) {
        logger.error(`updateImage: ${err}`);
        throw err;
      }
      resolve(true);
    });
    connection.release();
  });
});

const deletePost = (email, postId) => new Promise((resolve) => {
  db((connection) => {
    const firstQuery = `delete from Post
        where postId = '${postId}' and writerId = (select userId from User where email = '${email}');`;
    logger.debug(firstQuery);
    connection.query(firstQuery, (err) => {
      if (err) {
        logger.error(`deletePost: ${err}`);
        throw err;
      }
    });
    const secondQuery = `delete from LikeRecord where postId = ${postId};`;
    logger.debug(secondQuery);
    connection.query(secondQuery, (err) => {
      if (err) {
        logger.error(`deletePost LikeRecord: ${err}`);
        throw err;
      }
      resolve(true);
    });
    connection.release();
  });
});

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
  updateTitle,
  updateImage,
  deletePost,
  getNotApprovedPosts,
  approvePost,
  rejectPost,
};
