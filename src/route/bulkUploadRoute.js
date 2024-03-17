const express = require('express');
const ContentController = require('../controllers/ContentController');
const ContentValidator = require('../validator/ContentValidator');

const router = express.Router();
const auth = require('../middlewares/bulkUploadRouteAuth');

const contentController = new ContentController();
const contentValidator = new ContentValidator();

// bulk upload routes
router.post('/is_content_init', auth(), contentValidator.iSContentInitValidator, contentController.iSContentInit);

module.exports = router;