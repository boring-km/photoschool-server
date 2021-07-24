const db = require('../loaders/db');
const logger = require('../config/winston');

const getMySchoolName = (email) => new Promise((resolve) => {
  db((connection) => {
    const query = `select S.schoolName from User U, School S where U.schoolId = S.schoolId and U.email = '${email}';`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getMySchoolName: ${err}`);
        throw err;
      }
      resolve(results[0].schoolName);
    });
    connection.release();
  });
});

const getMyPosts = (email, index) => new Promise((resolve) => {
  db((connection) => {
    const query = `select P.postId, P.title, P.likes, P.views, P.tbImgURL, P.regTime, P.upTime, P.isApproved, P.isRejected
        from Post P, User U
        where P.writerId = U.userId and U.email = '${email}'
        limit 9 offset ${index * 9}`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getMyPosts: ${err}`);
        throw err;
      }
      resolve(results);
    });
    connection.release();
  });
});

const getMyAwards = (email) => new Promise((resolve) => {
  db((connection) => {
    const query = `select * from User U, Post P, Award A where U.email = '${email}' and U.userId = P.writerId and P.postId = A.postId;`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getMyAwards: ${err}`);
        throw err;
      }
      resolve(results);
    });
    connection.release();
  });
});

const getPostsByApi = (apiId, index) => new Promise((resolve) => {
  db((connection) => {
    const query = `select P.postId, P.title, U.nickname, P.likes, P.views, P.tbImgURL, P.regTime, P.upTime
        from Post P, User U 
        where apiId = '${apiId}' and P.writerId = U.userId and P.isApproved = true
        limit 5 offset ${index * 5};`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getPostsByApi: ${err}`);
        throw err;
      }
      resolve(results);
    });
    connection.release();
  });
});

const getAwardPosts = (index) => new Promise((resolve) => {
  db((connection) => {
    const query = `select P.postId, P.title, P.likes, P.views, (select nickname from User where userId = P.writerId) 'nickname', P.tbImgURL, P.regTime, P.upTime, A.awardName, A.month
        from Post P, Award A 
        where P.postId = A.postId
        order by A.month desc
        limit 4 offset ${index * 4};`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getAwardPosts: ${err}`);
        throw err;
      }
      resolve(results);
    });
    connection.release();
  });
});

const getAllPosts = (index) => new Promise((resolve) => {
  db((connection) => {
    const query = `select P.postId, P.title, U.nickname, P.likes, P.views, P.tbImgURL, P.regTime, P.upTime, S.schoolName
        from Post P, User U, School S
        where P.writerId = U.userId and U.schoolId = S.schoolId and P.isApproved = true
        limit 9 offset ${index * 9};`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getAllPosts: ${err}`);
        throw err;
      }
      resolve(results);
    });
    connection.release();
  });
});

const getSearchedPosts = (searchType, sortType, searchText, index) => new Promise((resolve) => {
  db((connection) => {
    // 검색 타입: 제목, 닉네임, 학교
    let select = '';
    switch (searchType) {
      case 'title':
        select = `select P.postId, P.title, U.nickname, P.likes, P.views, P.tbImgURL, P.regTime, P.upTime, S.schoolName from Post P, User U, School S where title like '%${searchText}%'`;
        break;
      case 'nickname':
        select = `select P.postId, P.title, U.nickname, P.likes, P.views, P.tbImgURL, P.regTime, P.upTime, S.schoolName from Post P, User U, School S where U.nickname = '${searchText}'`;
        break;
      case 'school':
        select = `select P.postId, P.title, U.nickname, P.likes, P.views, P.tbImgURL, P.regTime, P.upTime, S.schoolName from Post P, User U, School S where S.schoolName like '%${searchText}%'`;
        break;
      default:
        resolve(false);
        break;
    }

    // 정렬 타입: 최신순, 오래된 순, 조회 높은 순, 조회 낮은 순, 좋아요 높은 순, 좋아요 낮은 순
    let sortQuery = '';
    switch (sortType) {
      case 'new':
        sortQuery = 'order by regTime desc';
        break;
      case 'old':
        sortQuery = 'order by regTime asc';
        break;
      case 'highviews':
        sortQuery = 'order by views desc';
        break;
      case 'lowviews':
        sortQuery = 'order by views asc';
        break;
      case 'highlikes':
        sortQuery = 'order by likes desc';
        break;
      case 'lowlikes':
        sortQuery = 'order by likes asc';
        break;
      default:
        resolve(false);
        break;
    }
    const query = `${select} and P.writerId = U.userId and U.schoolId = S.schoolId and P.isApproved = true ${sortQuery} limit 9 offset ${index * 9};`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`getSearchedPosts: ${err}`);
        throw err;
      }
      resolve(results);
    });
    connection.release();
  });
});

const searchDetailPost = (postId, isApproved) => new Promise((resolve) => {
  db((connection) => {
    if (isApproved) {
      const firstQuery = `update Post set views = views + 1 where postId = ${postId};`;
      logger.debug(firstQuery);
      connection.query(firstQuery, (err) => {
        if (err) {
          logger.error(`searchDetailPost views: ${err}`);
          throw err;
        }
      });
    }
    const secondQuery = `select P.title, U.nickname, P.apiId, P.likes, P.views, P.imgURL, P.regTime, P.upTime, S.region, S.schoolName
        from Post P, User U, School S
        where P.writerId = U.userId and U.schoolId = S.schoolId and postId = ${postId};`;
    logger.debug(secondQuery);
    connection.query(secondQuery, (err, results) => {
      if (err) {
        logger.error(`searchDetailPost: ${err}`);
        throw err;
      }
      resolve(results[0]);
    });
    connection.release();
  });
});

const checkDoLikeBefore = (email, postId) => new Promise((resolve) => {
  db((connection) => {
    const query = `select count(*) as 'count' from User U, LikeRecord L where U.userId = L.userId and U.email = '${email}' and L.postId = '${postId}';`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`checkDoLikeBefore: ${err}`);
        throw err;
      }
      resolve(results[0].count === 1);
    });
    connection.release();
  });
});

const registerPost = (email, apiId, title) => new Promise((resolve) => {
  db((connection) => {
    const query = `insert into post(apiId, writerId, title, imgURL, tbImgURL)
                        values('${apiId}', (select userId 'writerId' from User where email = '${email}'), '${title}', '', '');`;
    logger.debug(query);
    connection.query(query, (err, results) => {
      if (err) {
        logger.error(`registerPost: ${err}`);
        throw err;
      }
      resolve(results.insertId);
    });
    connection.release();
  });
});

const likeOrNotLikePost = (email, postId) => new Promise((resolve) => {
  db((firstConnection) => {
    const firstQuery = `select count(*) as 'count' from User where userId = (select writerId from Post where postId = ${postId}) and email = '${email}';`;
    logger.debug(firstQuery);
    firstConnection.query(firstQuery, (firstErr, results) => {
      if (firstErr) {
        logger.error(`likeOrNotLikePost first: ${firstErr}`);
        throw firstErr;
      }
      const result = results[0].count > 0;
      if (result) {
        resolve(false);
      } else {
        db((connection) => {
          // likeOrNotLikePost 프로시저 호출
          const secondQuery = `call likeOrNotLikePost('${email}', ${postId}, @isLikedBy${postId});`;
          logger.debug(secondQuery);
          logger.debug('프로시저 likeOrNotLikePost(\n'
              + '    IN userEmail VARCHAR(254),\n'
              + '    IN likedPostId INT(10),\n'
              + '    OUT result TINYINT(1)\n'
              + ')\n'
              + 'begin\n'
              + '    declare foundId INT(10);\n'
              + '    declare userIdResult INT(10) default 0;\n'
              + '# 해당 userId 찾기\n'
              + '    select userId\n'
              + '    into foundId\n'
              + '    from User\n'
              + '    where email = userEmail;\n'
              + '# 이미 좋아요를 누른 사용자인지 확인\n'
              + '    select userId\n'
              + '    into userIdResult\n'
              + '    from likerecord\n'
              + '    where userId = foundId and postId = likedPostId;\n'
              + '# 좋아요 버튼 toggle \n'
              + '    if userIdResult = 0 then\n'
              + '        insert into likerecord(userId, postId) values(foundId, likedPostId);\n'
              + '        update Post set likes = likes + 1 where postId = likedPostId;\n'
              + '        set result = 1;\n'
              + '    else\n'
              + '        delete from likerecord where postId = likedPostId and userId = foundId;\n'
              + '        update Post set likes = likes - 1 where postId = likedPostId;\n'
              + '        set result = 0;\n'
              + '    end if;\n'
              + 'end$$');
          connection.query(secondQuery, (err) => {
            if (err) {
              logger.error(`likeOrNotLikePost: ${err}`);
              throw err;
            }
          });
          const thirdQuery = `select @isLikedBy${postId} as 'result';`;
          logger.debug(thirdQuery);
          connection.query(thirdQuery, (err) => {
            if (err) {
              logger.error(`likeOrNotLikePost result: ${err}`);
              throw err;
            }
            resolve(true);
          });
          connection.release();
        });
      }
      firstConnection.release();
    });
  });
});

const updateTitle = (email, postId, title) => new Promise((resolve) => {
  db((firstConnection) => {
    const firstQuery = `select count(*) as 'count'
                        from Award
                        where postId = ${postId}`;
    logger.debug(firstQuery);
    firstConnection.query(firstQuery, (firstError, results) => {
      if (firstError) {
        logger.error(`updateTitle Check: ${firstError}`);
        throw firstError;
      }
      if (results[0].count !== 0) { // 우수 게시물은 수정, 삭제 불가
        resolve(false);
      } else {
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
      }
    });
  });
});

const updateImage = (email, postId, tbImgURL, imgURL) => new Promise((resolve) => {
  db((firstConnection) => {
    const firstQuery = `select count(*) as 'count'
                        from Award
                        where postId = ${postId}`;
    logger.debug(firstQuery);
    firstConnection.query(firstQuery, (firstError, results) => {
      if (firstError) {
        logger.error(`updateImage Check: ${firstError}`);
        throw firstError;
      }
      if (results[0].count !== 0) { // 우수 게시물은 수정, 삭제 불가
        resolve(false);
      } else {
        db((connection) => {
          const query = `update Post
                         set tbImgURL   = '${tbImgURL}',
                             imgURL     = '${imgURL}',
                             upTime     = now(),
                             isApproved = false,
                             isRejected = false
                         where postId = '${postId}'
                           and writerId = (select userId from User where email = '${email}');`;
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
      }
      firstConnection.release();
    });
  });
});

const deletePost = (email, postId) => new Promise((resolve) => {
  db((firstConnection) => {
    const firstQuery = `select count(*) as 'count' from Award where postId = ${postId}`;
    logger.debug(firstQuery);
    firstConnection.query(firstQuery, (firstError, results) => {
      if (firstError) {
        logger.error(`deletePost Check: ${firstError}`);
        throw firstError;
      }
      if (results[0].count !== 0) { // 우수 게시물은 수정, 삭제 불가
        resolve(false);
      } else {
        db((connection) => {
          const secondQuery = `delete from Post
        where postId = '${postId}' and writerId = (select userId from User where email = '${email}');`;
          logger.debug(secondQuery);
          connection.query(secondQuery, (err) => {
            if (err) {
              logger.error(`deletePost: ${err}`);
              throw err;
            }
          });
          const thirdQuery = `delete from LikeRecord where postId = ${postId};`;
          logger.debug(thirdQuery);
          connection.query(thirdQuery, (err) => {
            if (err) {
              logger.error(`deletePost LikeRecord: ${err}`);
              throw err;
            }
            resolve(true);
          });
          connection.release();
        });
      }
    });
    firstConnection.release();
  });
});

module.exports = {
  getMySchoolName,
  getMyPosts,
  getMyAwards,
  getPostsByApi,
  getAwardPosts,
  getAllPosts,
  getSearchedPosts,
  searchDetailPost,
  checkDoLikeBefore,
  registerPost,
  likeOrNotLikePost,
  updateTitle,
  updateImage,
  deletePost,
};
