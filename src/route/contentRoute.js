const express = require('express');
const ContentController = require('../controllers/ContentController');
const ContentValidator = require('../validator/ContentValidator');

const router = express.Router();
const auth = require('../middlewares/contentRouteAuth');

const contentController = new ContentController();
const contentValidator = new ContentValidator();

// content routes
router.post('/get_content', auth(), contentValidator.contentGetValidator, contentController.getContent);

router.post('/get_content_by_id', auth(), contentValidator.contentGetByIdValidator, contentController.getContentById);

router.post('/get_contentIds', auth(), contentValidator.contentGetIdsValidator, contentController.getContentIds);

router.post('/add_content', auth(), contentValidator.contentAddValidator, contentController.addContent);

router.post('/init_content', auth(), contentValidator.contentInitValidator, contentController.initContent);

router.post('/update_content', auth(), contentValidator.contentUpdateValidator, contentController.updateContent);

router.post('/delete_content', auth(), contentValidator.contentDeleteValidator, contentController.deleteContent);

router.post('/get_existed_content_type', auth(), contentValidator.contentTypeGetValidator, contentController.getContentType);

module.exports = router;