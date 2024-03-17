const express = require('express');
const RegionController = require('../controllers/RegionController');
const RegionValidator = require('../validator/RegionValidator');

const router = express.Router();
const auth = require('../middlewares/publishRouteAuth');

const regionController = new RegionController();
const regionValidator = new RegionValidator();

// publish routes
router.post('/publish', auth(), regionValidator.publishValidator, regionController.publish);

router.post('/stop_publish', auth(), regionValidator.stopPublishValidator, regionController.stopPublish);

module.exports = router;