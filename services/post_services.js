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
            const query = `select P.postId, P.title, P.likes, P.views, P.tbImgURL, P.regTime from Post P, User U where P.writerId = U.userId and U.email = '${email}' limit 10 offset ${index * 10}`;
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
            const query = `select postId, title, likes, views, tbImgURL, regTime from Post where apiId = ${apiId} limit 5 offset ${index * 5};`;
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
            const query = `select P.postId, P.title, P.likes, P.views, P.tbImgURL, P.regTime, A.awardName, A.month from Post P, Award A where P.postId = A.postId limit 10 offset ${index * 10}`;
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
           const query = `select S.region, S.schoolName, sum(P.views) sumOfViews, count(*) sumOfStudents
                          from post P, user U, school S
                          where P.writerId = U.userId and U.schoolId = S.schoolId
                          group by(U.schoolId)
                          order by sumOfViews desc, sumOfStudents desc limit 10;`
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
            const query = `select postId, title, likes, views, tbImgURL, regTime from Post limit 10 offset ${index * 10};`
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

const getSearchedPosts = (searchType, sortType, searchText, index) => {
    return new Promise(resolve => {
        db((connection) => {
            // 검색 타입: 제목, 닉네임, 학교
            let select = "";
            switch (searchType) {
                case "title":
                    select = `select postId, title, likes, views, tbImgURL, regTime from Post where title like '%${searchText}%'`;
                    break;
                case "nickname":
                    select = `select P.postId, P.title, P.likes, P.views, P.tbImgURL, P.regTime from Post P, User U where P.writerId = U.userId and U.nickname like '%${searchText}%'`;
                    break;
                case "school":
                    select = `select P.postId, P.title, P.likes, P.views, P.tbImgURL, P.regTime from Post P, User U, School S where P.writerId = U.userId and U.schoolId = S.schoolId and S.schoolName like '%${searchText}%'`;
                    break;
                default:
                    resolve(false);
                    break;
            }

            // 정렬 타입: 최신순, 오래된 순, 조회 높은 순, 조회 낮은 순, 좋아요 높은 순, 좋아요 낮은 순
            let sortQuery = "";
            switch (sortType) {
                case "new":
                    sortQuery = "order by regTime desc";
                    break;
                case "old":
                    sortQuery = "order by regTime asc";
                    break;
                case "highviews":
                    sortQuery = "order by views desc";
                    break;
                case "lowviews":
                    sortQuery = "order by views asc";
                    break;
                case "highlikes":
                    sortQuery = "order by likes desc";
                    break;
                case "lowlikes":
                    sortQuery = "order by likes asc";
                    break;
                default:
                    resolve(false);
                    break;
            }
            const query = `${select} ${sortQuery} limit 10 offset ${index};`;
            logger.debug(query);
            connection.query(query, (err, results) => {
                if (err) {
                    logger.error(`getSearchedPosts: ${err}`);
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
    getAllPosts,
    getSearchedPosts
}