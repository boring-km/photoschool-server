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

router.get('/check', userController.signUpCheck);
router.get('/mypost/:index', postController.getMyActivities);

module.exports = router;