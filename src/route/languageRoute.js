const express = require('express');
const LanguageController = require('../controllers/LanguageController');
const LanguageValidator = require('../validator/LanguageValidator');

const router = express.Router();
const auth = require('../middlewares/languageRouteAuth');

const languageController = new LanguageController();
const languageValidator = new LanguageValidator();

// language routes
router.post('/get_language', auth(), languageValidator.languageGetValidator, languageController.getLanguage);

router.post('/add_language', auth(), languageValidator.languageAddValidator, languageController.addLanguage);

router.post('/update_language', auth(), languageValidator.languageUpdateValidator, languageController.updateLanguage);

module.exports = router;