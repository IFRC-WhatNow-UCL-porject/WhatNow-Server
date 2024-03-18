const express = require('express');
const TermValidator = require('../validator/TermValidator');
const TermController = require('../controllers/TermController');

const router = express.Router();
const auth = require('../middlewares/termRouteAuth');
const termController = new TermController();
const termValidator = new TermValidator();

router.post('/get_all_versions', auth(), termController.getAllVersions);

router.post('/get_term_by_version', auth(), termValidator.getTermByVersionValidator, termController.getTermByVersion);

router.post('/publish_term', auth(), termValidator.publishTermValidator, termController.publishTerm);

// no auth required
router.post('/get_latest_term', termController.getLatestTerm);

module.exports = router;