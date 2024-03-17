const express = require('express');
const RegionController = require('../controllers/RegionController');
const RegionValidator = require('../validator/RegionValidator');

const router = express.Router();
const auth = require('../middlewares/regionRouteAuth');

const regionController = new RegionController();
const regionValidator = new RegionValidator();

// region routes
router.post('/get_region', auth(), regionValidator.regionGetValidator, regionController.getRegion);

router.post('/add_region', auth(), regionValidator.regionAddValidator, regionController.addRegion);

router.post('/check_region', auth(), regionValidator.regionCheckValidator, regionController.checkRegion);

router.post('/update_region', auth(), regionValidator.regionUpdateValidator, regionController.updateRegion);

router.post('/delete_region', auth(), regionValidator.regionDeleteValidator, regionController.deleteRegion);

module.exports = router;