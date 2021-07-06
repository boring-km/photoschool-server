const db = require('../loaders/db');
const logger = require('../config/winston');

const getNewAwards = () => new Promise((resolve) => {
  db((connection) => {
    const firstQuery = `insert into award(postId, awardName, month) values((select postId
                                                                            from post
                                                                            where regTime between date_sub(now(), interval 1 month) and now()
                                                                            order by views desc limit 1), '조회수 상', date_format(date_sub(now(), interval 1 month ), '%Y%m'));`;
    logger.debug(firstQuery);
    connection.query(firstQuery, (err) => {
      if (err) {
        logger.error(`getNewAwards views: ${err}`);
        throw err;
      }
    });
    const secondQuery = `insert into award(postId, awardName, month) values((select postId
                                                    from post
                                                    where regTime between date_sub(now(), interval 1 month) and now()
                                                    order by likes desc limit 1), '좋아요 상', date_format(date_sub(now(), interval 1 month ), '%Y%m'));`;
    logger.debug(secondQuery);
    connection.query(secondQuery, (err) => {
      if (err) {
        logger.error(`getNewAwards likes: ${err}`);
        throw err;
      }
      resolve(true);
    });
    connection.release();
  });
});

module.exports = {
  getNewAwards,
};
