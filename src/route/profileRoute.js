const express = require('express');
const UserValidator = require('../validator/UserValidator');
const AuthController = require('../controllers/authController');
const SocietyValidator = require('../validator/SocietyValidator');
const SocietyController = require('../controllers/societyController');
const UserRoleValidator = require('../validator/UserRoleValidator');
const UserRoleController = require('../controllers/userRoleController');

const router = express.Router();
const auth = require('../middlewares/profileRouteAuth');

const userValidator = new UserValidator();
const authController = new AuthController();
const societyValidator = new SocietyValidator();
const societyController = new SocietyController();
const userRoleValidator = new UserRoleValidator();
const userRoleController = new UserRoleController();

router.post(
    '/change_password',
    auth(),
    userValidator.profileCangePasswordValidator,
    authController.profileChangePassword,
);

router.post(
    '/get_profile',
    auth(),
    userValidator.profileGetValidator,
    authController.getProfile,
);

router.post(
    '/update_profile',
    auth(),
    userValidator.profileUpdateValidator,
    authController.profileUpdate,
);

router.post('/get_user_societies', auth(), societyValidator.getUserSocietiesValidator, societyController.getUserSocieties);

router.post('/get_user_role', auth(), userRoleValidator.getUserRoleValidator, userRoleController.getUserRole);

module.exports = router;