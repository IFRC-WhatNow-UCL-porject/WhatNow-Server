const express = require('express');

const router = express.Router();
const auth = require('../middlewares/SuperAdminAuth');
const ContentController = require('../controllers/ContentController');
const MessageController = require('../controllers/MessageController');
const SocietyController = require('../controllers/SocietyController');
const LanguageController = require('../controllers/LanguageController');
const RegionController = require('../controllers/RegionController');
const AuditLogController = require('../controllers/AuditController');
const ContentValidator = require('../validator/ContentValidator');
const MessageValidator = require('../validator/MessageValidator');
const SocietyValidator = require('../validator/SocietyValidator');
const LanguageValidator = require('../validator/LanguageValidator');
const RegionValidator = require('../validator/RegionValidator');
const AuditLogValidator = require('../validator/AuditValidator');
const UserRoleController = require('../controllers/UserRoleController');
const UserRoleValidator = require('../validator/UserRoleValidator');

const contentController = new ContentController();
const messageController = new MessageController();
const societyController = new SocietyController();
const languageController = new LanguageController();
const regionController = new RegionController();
const auditLogController = new AuditLogController();
const contentValidator = new ContentValidator();
const messageValidator = new MessageValidator();
const societyValidator = new SocietyValidator();
const languageValidator = new LanguageValidator();
const regionValidator = new RegionValidator();
const auditLogValidator = new AuditLogValidator();
const userRoleController = new UserRoleController();
const userRoleValidator = new UserRoleValidator();


router.post('/set_auth', auth(), userRoleValidator.setAuthValidator, userRoleController.setAuth);

// content routes
router.post('/get_content', auth(), contentValidator.contentGetValidator, contentController.getContent);

router.post('/add_content', auth(), contentValidator.contentAddValidator, contentController.addContent);

router.post('/update_content', auth(), contentValidator.contentUpdateValidator, contentController.updateContent);

router.post('/delete_content', auth(), contentValidator.contentDeleteValidator, contentController.deleteContent);

// message routes
router.post('/get_content_message', auth(), messageValidator.messageGetValidator, messageController.getContentMessage);

router.post('/update_content_message', auth(), messageValidator.messageUpdateValidator, messageController.updateContentMessage);

// language routes
router.post('/get_language', auth(), languageValidator.languageGetValidator, languageController.getLanguage);

router.post('/add_language', auth(), languageValidator.languageAddValidator, languageController.addLanguage);

router.post('/update_language', auth(), languageValidator.languageUpdateValidator, languageController.updateLanguage);

// region routes
router.post('/get_region', auth(), regionValidator.regionGetValidator, regionController.getRegion);

router.post('/add_region', auth(), regionValidator.regionAddValidator, regionController.addRegion);

router.post('/update_region', auth(), regionValidator.regionUpdateValidator, regionController.updateRegion);

router.post('/delete_region', auth(), regionValidator.regionDeleteValidator, regionController.deleteRegion);

// society routes
router.post('/get_society', auth(), societyController.getAllSocieties);

router.post('/add_society', auth(), societyValidator.addSocietyValidator, societyController.addSociety);

router.post('/update_society', auth(), societyValidator.updateSocietyValidator, societyController.updateSociety);

router.post('/delete_society', auth(), societyValidator.deleteSocietyValidator, societyController.deleteSociety);

// audit log routes
router.post('/get_audit_log', auth(), auditLogValidator.auditLogGetValidator, auditLogController.getAuditLog);

module.exports = router;