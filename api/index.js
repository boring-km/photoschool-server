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

// User
router.get('/check', userController.signUpCheck);
router.get('/nickname', userController.getUserNickName);
router.post('/register/user', userController.registerUser);

// Post
router.get('/mypost/:index', postController.getMyActivities);
router.get('/others/:apiId/:index', postController.getPostsByApiId);
router.get('/awards/:index', postController.getAwardPosts);
router.get('/rank', postController.getSchoolRank);
router.get('/post/all/:index', postController.getAllPosts);
router.get('/post/:searchType/:sortType/:searchText/:index', postController.searchPosts);
router.get('/post/detail/:postId', postController.searchDetail);
router.post('/register/post', postController.registerPost);
router.post('/post/like', postController.likeOrNotLikePost);
router.patch('/update/title', postController.updateTitle);
router.patch('/update/image', postController.updateImage);
router.delete('/delete/:postId', postController.deletePost);

// School
router.get('/school/:schoolName', schoolController.searchSchool);

module.exports = router;
