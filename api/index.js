const express = require('express');

const router = express.Router();

// services
const userController = require('./user_controller');
const postController = require('./post_controller');
const schoolController = require('./school_controller');
const creatureController = require('./creature_controller');
const manageController = require('./manage_controller');

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
router.get('/check/like/:postId', postController.checkLike);
router.post('/register/post', postController.registerPost);
router.post('/post/like', postController.likeOrNotLikePost);

// Post Management
router.patch('/update/title', manageController.updateTitle);
router.patch('/update/image', manageController.updateImage);
router.delete('/delete/:postId', manageController.deletePost);
router.get('/admin/posts/:index', manageController.getNotApprovedPosts);
router.post('/admin/approve', manageController.approvePost);
router.post('/admin/reject', manageController.rejectPost);

// School
router.get('/school/:schoolName', schoolController.searchSchool);
router.get('/mySchool', schoolController.getMySchoolInfo);

// Creature
router.get('/creature', creatureController.searchCreature);
router.get('/creature/detail', creatureController.searchDetail);

module.exports = router;
