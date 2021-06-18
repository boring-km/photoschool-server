const express = require('express');
const router = express.Router();
const testController = require('./controller');

// test
router.get('/', testController.serverTest);
router.get('/test/jwt/get', testController.jwtGetTest);
router.post('/test/jwt/post', testController.jwtPostTest);

// services
const userController = require('./user_controller');
const postController = require('./post_controller');
const schoolController = require('./school_controller');

router.get('/check', userController.signUpCheck);
router.get('/mypost/:index', postController.getMyActivities);
router.get('/others/:apiId/:index', postController.getPostsByApiId);
router.get('/awards/:index', postController.getAwardPosts);
router.get('/rank', postController.getSchoolRank);
router.get('/post/all/:index', postController.getAllPosts);
router.get('/post/:searchType/:sortType/:searchText/:index', postController.searchPosts);

router.get('/school/:schoolName', schoolController.searchSchool);

module.exports = router;