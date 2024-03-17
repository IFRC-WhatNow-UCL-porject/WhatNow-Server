const express = require('express');
const ApiUserController = require('../controllers/ApiUserController');
const ApiUserValidator = require('../validator/ApiUserValidator');

const router = express.Router();
const auth = require('../middlewares/apiUserRouteAuth');

const apiUserController = new ApiUserController();
const apiUserValidator = new ApiUserValidator();

// api user routes
router.post('/get_api_users', auth(), apiUserController.getAllApiUsers);

router.post('/get_api_user_by_id', auth(), apiUserValidator.getApiUserByIdValidator, apiUserController.getApiUserById)

router.post('/add_api_user', auth(), apiUserValidator.addApiUserValidator, apiUserController.addApiUser);

router.post('/update_api_user', auth(), apiUserValidator.updateApiUserValidator, apiUserController.updateApiUser);

router.post('/delete_api_user', auth(), apiUserValidator.deleteApiUserValidator, apiUserController.deleteApiUser);

module.exports = router;