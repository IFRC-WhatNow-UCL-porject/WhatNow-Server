const express = require('express');
const UserController = require('../controllers/UserController');
const UserValidator = require('../validator/UserValidator');
const AuthController = require('../controllers/AuthController');

const router = express.Router();
const auth = require('../middlewares/apiUserRouteAuth');

const userController = new UserController();
const userValidator = new UserValidator();
const authController = new AuthController();

router.post('/get_users', auth(), userController.getAllUsers);

router.post('/get_user_role', auth(), userController.getUserRole);

router.post('/get_user_society', auth(), userController.getUserSociety);

router.post(
    '/send_activation_email',
    auth(),
    userValidator.sendActivationEmailValidator,
    authController.sendActivationEmail
)

router.post(
    '/change_status',
    auth(),
    userValidator.changeStatusValidator,
    authController.changeStatus,
)

router.post(
    '/create_profile',
    auth(),
    userValidator.createProfileValidator,
    authController.createProfile,
)

module.exports = router;