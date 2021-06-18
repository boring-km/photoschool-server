const db = require('../loaders/db');
const logger = require('../config/winston');

const getMyPostsLength = (email) => {
    return new Promise(resolve => {
        db((connection) => {
            connection.query(`select count(*) as 'count' from Post where email = '${email}'`, (err, results) => {
                if (err) {
                    logger.info(err);
                    resolve(false)
                }
                resolve(results[0].count);
            });
            connection.release();
        });
    });
}

const getMySchoolName = (email) => {
    return new Promise(resolve => {
        db((connection) => {
            connection.query(`select S.schoolName as 'name' from User U, School S where U.schoolId = S.schoolId and U.email = '${email}';`, (err, results) => {
                if (err) {
                    logger.info(err);
                    resolve(false)
                }
                resolve(results[0].name);
            });
            connection.release();
        });
    });
}

const getMyPosts = (email, index) => {
    return new Promise(resolve => {
        db((connection) => {
            connection.query(`select postId, title, likes, views, imgURL from Post where email = '${email}' limit 10 offset ${index}`, (err, results) => {
                if (err) {
                    logger.info(err);
                    resolve(false)
                }
                resolve(results);
            });
            connection.release();
        });
    })
}

module.exports = {
    getMyPostsLength,
    getMySchoolName,
    getMyPosts
}