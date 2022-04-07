const express = require('express');
const router = express.Router();
const loginController = require('../controllers/authentication');

router.get('/signup', loginController.signup_get);
router.post('/signup', loginController.signup_post);
router.get('/signin', loginController.signin_get);
router.post('/signin', loginController.signin_post);
router.get('/logOut', loginController.logOut);

module.exports = router;
