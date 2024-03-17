const express = require('express');
const SocietyController = require('../controllers/SocietyController');
const SocietyValidator = require('../validator/SocietyValidator');
const LanguagValidator = require('../validator/LanguageValidator');
const LanguageController = require('../controllers/LanguageController');
const RegionValidator = require('../validator/RegionValidator');
const RegionController = require('../controllers/RegionController');
const ContentValidator = require('../validator/ContentValidator');
const ContentController = require('../controllers/ContentController');
const MessageValidator = require('../validator/MessageValidator');
const MessageController = require('../controllers/MessageController');

const router = express.Router();
const auth = require('../middlewares/messagesRouteAuth');

const societyController = new SocietyController();
const societyValidator = new SocietyValidator();
const languageController = new LanguageController();
const languageValidator = new LanguagValidator();
const regionController = new RegionController();
const regionValidator = new RegionValidator();
const contentController = new ContentController();
const contentValidator = new ContentValidator();
const messageController = new MessageController();
const messageValidator = new MessageValidator();

router.post('/get_all_societies', auth(), societyValidator.getAllSocietiesValidator, societyController.getAllSocieties);

router.post('/get_language', auth(), languageValidator.languageGetValidator, languageController.getLanguage);

router.post('/get_published_region', auth(), regionValidator.regionGetPublishedValidator, regionController.getPublishedRegion);

router.post('/get_region_content', auth(), contentValidator.regionContentGetValidator, contentController.getRegionContent);

router.post('/get_content_message', auth(), messageValidator.messageGetValidator, messageController.getContentMessage);

router.post('/get_society_and_region_name', auth(), societyValidator.getSocietyAndRegionNameValidator, societyController.getSocietyAndRegionName);

module.exports = router;