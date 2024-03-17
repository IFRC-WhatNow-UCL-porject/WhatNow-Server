const express = require('express');
const ApiController = require('../controllers/ApiController');
const ApiValidator = require('../validator/ApiValidator');

const router = express.Router();
const auth = require('../middlewares/apiRouteAuth');

const apiController = new ApiController();
const apiValidator = new ApiValidator();

// api routes

router.post('/get_apis', auth(), apiController.getAllApis);

router.post('/get_api_by_id', auth(), apiValidator.getApiByIdValidator, apiController.getApiById);

router.post('/add_api', auth(), apiValidator.addApiValidator, apiController.addApi);

router.post('/update_api', auth(), apiValidator.updateApiValidator, apiController.updateApi);

router.post('/delete_api', auth(), apiValidator.deleteApiValidator, apiController.deleteApi);

module.exports = router;