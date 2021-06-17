const express = require('express');
const router = express.Router();
const testController = require('./controller');

router.get('/', testController.serverTest);
router.get('/test/jwt/get', testController.jwtGetTest);
router.post('/test/jwt/post', testController.jwtPostTest);

module.exports = router;