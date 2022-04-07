const express = require('express');
const router = express.Router();
const datesController = require('../controllers/dates');
const { isLoggedIn } = require('../helpers');

router.get('/',isLoggedIn, datesController.display_dates);
router.get('/:service/create', isLoggedIn, datesController.create_get);
router.post('/:service/create', datesController.create_post);
router.get('/:id/delete',isLoggedIn, datesController.delete_get);
router.post('/:id/delete', datesController.delete_post);
router.get('/:id/edit', isLoggedIn, datesController.update_get);
router.post('/:id/edit', datesController.update_post);

module.exports = router;