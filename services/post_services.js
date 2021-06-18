const db = require('../loaders/db');
const logger = require('../config/winston');

const getMyPostsLength = (email) => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `select count(*) as 'count' from Post P, User U where U.userId = P.writerId and U.email = '${email}'`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`getMyPostsLength: ${err}`);
                    resolve(false)
                }
                logger.debug(JSON.stringify(results[0]));
                resolve(results[0].count);
            });
            connection.release();
        });
    });
}

const getMySchoolName = (email) => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `select S.schoolName as 'name' from User U, School S where U.schoolId = S.schoolId and U.email = '${email}';`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`getMySchoolName: ${err}`);
                    resolve(false)
                }
                logger.debug(JSON.stringify(results[0]));
                resolve(results[0].name);
            });
            connection.release();
        });
    });
}

const getMyPosts = (email, index) => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `select P.postId, P.title, P.likes, P.views, P.tbImgURL, P.regTime from Post P, User U where P.writerId = U.userId and U.email = '${email}' limit 10 offset ${index}`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`getMyPosts: ${err}`);
                    resolve(false)
                }
                logger.debug(JSON.stringify(results[0]));
                resolve(results);
            });
            connection.release();
        });
    })
}

const getPostLengthByApi = (apiId) => {
    return new Promise(resolve => {
       db((connection) => {
           const query = `select count(*) as 'count' from Post where apiId = ${apiId};`;
           logger.debug(query);
           connection.query(query, (err, results) => {
               if (err) {
                   logger.error(`getPostLengthByApi: ${err}`);
                   resolve(false);
               }
               resolve(results[0].count);
           });
        });
    });
}

const getPostsByApi = (apiId, index) => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `select postId, title, likes, views, tbImgURL, regTime from Post where apiId = ${apiId} limit 5 offset ${index};`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`getPostsByApi: ${err}`);
                    resolve(false);
                }
                resolve(results);
            });
            connection.release();
        })
    })
}

const getAwardPostsLength = () => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `select count(*) as 'count' from Award;`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`getAwardPostsLength: ${err}`);
                    resolve(false);
                }
                resolve(results[0].count);
            });
            connection.release();
        });
    });
}

const getAwardPosts = (index) => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `select P.postId, P.title, P.likes, P.views, P.tbImgURL, P.regTime, A.awardName, A.month from Post P, Award A where P.postId = A.postId limit 10 offset ${index}`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`getAwardPosts: ${err}`);
                    resolve(false);
                }
                resolve(results);
            });
            connection.release();
        });
    });
}

const getTop10Schools = () => {
    return new Promise(resolve => {
       db((connection) => {
           const query = `select (select schoolName from school s where s.schoolId = u.schoolId) as schoolName, sum(p.views) sumOfViews, count(*) sumOfStudents
                          from post p, user u
                          where p.writerId = u.userId
                          group by(u.schoolId)
                          order by sumOfViews desc, sumOfStudents desc
                          limit 10;`
           logger.debug(query);
           connection.query(query, (err, results) => {
               if (err) {
                   logger.error(`getTop10Schools: ${err}`);
                   resolve(false);
               }
               resolve(results);
           });
           connection.release();
       })
    });
}

const getAllPostLength = () => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `select count(*) as 'count' from Post`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`getAllPostLength: ${err}`);
                    resolve(false);
                }
                resolve(results[0].count);
            });
            connection.release();
        })
    });
}

const getAllPosts = (index) => {
    return new Promise(resolve => {
        db((connection) => {
            const query = `select postId, title, likes, views, tbImgURL, regTime from Post limit 10 offset ${index};`
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`getAllPosts: ${err}`);
                    resolve(false);
                }
                resolve(results);
            });
            connection.release();
        });
    });
}


module.exports = {
    getMyPostsLength,
    getMySchoolName,
    getMyPosts,
    getPostLengthByApi,
    getPostsByApi,
    getAwardPostsLength,
    getAwardPosts,
    getTop10Schools,
    getAllPostLength,
    getAllPosts
}