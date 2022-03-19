// ************ Require's ************
const express = require('express');
const router = express.Router();
const upload = require ('../../middlewares/multer')

// ************ Controller Require ************
const mainController = require('../controllers/mainController');

router.get('/', mainController.index);
router.get('/search', mainController.search);

module.exports = router;
