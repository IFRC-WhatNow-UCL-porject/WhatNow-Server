const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserRoleController = require('../controllers/UserRoleController');
const UserValidator = require('../validator/UserValidator');
const UserRoleValidator = require('../validator/UserRoleValidator');
const ApiUserController = require('../controllers/ApiUserController');
const ApiUserValidator = require('../validator/ApiUserValidator');


const router = express.Router();
const auth = require('../middlewares/auth');

const authController = new AuthController();
const userRoleController = new UserRoleController();
const userValidator = new UserValidator();
const userRoleValidator = new UserRoleValidator();
const apiUserController = new ApiUserController();
const apiUserValidator = new ApiUserValidator();


router.post('/register', userValidator.userCreateValidator, authController.register);

router.post('/add_api_user', apiUserValidator.addApiUserValidator, apiUserController.addApiUser);

router.post('/login', userValidator.userLoginValidator, authController.login);

router.post('/logout', authController.logout);

router.post(
    '/check_user_role',
    userRoleValidator.getUserRoleValidator,
    userRoleController.getUserRole,
);

router.post(
    '/check_user_login_info',
    userValidator.userLoginValidator,
    authController.checkLoginInfo,
);

router.post(
    '/check_user_status',
    authController.checkUserStatus,
);

router.post(
    '/set_user_terms_version',
    auth(),
    userValidator.setUserTermsVersionValidator,
    authController.setUserTermsVersion,
);

router.post(
    '/oauth_check_email_exist',
    userValidator.oauthCheckEmailExistValidator,
    authController.oauthCheckEmailExist
)

router.post(
    '/check_email_exist',
    userValidator.checkEmailExistValidator,
    authController.checkEmailExist
)

router.post(
    '/check_email_token',
    userValidator.checkEmailTokenValidator,
    authController.checkEmailToken
)

router.post(
    '/reset_password',
    userValidator.resetPasswordValidator,
    authController.resetPassword
)

router.post(
    '/send_reset_password_email',
    userValidator.sendResetPasswordEmailValidator,
    authController.sendResetPasswordEmail
)

router.post(
    '/send_activation_email',
    userValidator.sendActivationEmailValidator,
    authController.sendActivationEmail
)

module.exports = router;
