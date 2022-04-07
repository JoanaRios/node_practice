const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/:key/index', adminController.adminKey, adminController.index);
router.get('/:id/user_detail', adminController.userDetail)

module.exports = router;