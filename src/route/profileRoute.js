const express = require('express');
const UserValidator = require('../validator/UserValidator');
const AuthController = require('../controllers/AuthController');
const SocietyValidator = require('../validator/SocietyValidator');
const SocietyController = require('../controllers/SocietyController');
const UserRoleValidator = require('../validator/UserRoleValidator');
const UserRoleController = require('../controllers/UserRoleController');

const router = express.Router();
const auth = require('../middlewares/profileRouteAuth');

const userValidator = new UserValidator();
const authController = new AuthController();
const societyValidator = new SocietyValidator();
const societyController = new SocietyController();
const userRoleValidator = new UserRoleValidator();
const userRoleController = new UserRoleController();

// profile routes
/**
 * @swagger
 * /profile/change_password:
 *   post:
 *     summary: Change User Password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               new_password:
 *                 type: string
 *                 minLength: 6
 *                 required: true
 *               uuid:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: Password updated Successfully!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Password updated Successfully!
 *                 data:
 *                   type: object
 *                   description: Usually empty({}) since password will not be returned and email is known
 *                   example: {}
 *       '400':
 *         description: User Not found!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User Not found!
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Please authenticate"
 *       '502':
 *         description: Unknown error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 502
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.post(
    '/change_password',
    auth(),
    userValidator.profileCangePasswordValidator,
    authController.profileChangePassword,
);

/**
 * @swagger
 * /profile/get_profile:
 *   post:
 *     summary: Retrieves a user's profile by UUID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: Unique identifier of the user.
 *                 example: "a12b3c4d-5e6f-7g8h-9i0j-123k456l789m"
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User Profile"
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       example: "a12b3c4d-5e6f-7g8h-9i0j-123k456l789m"
 *                     first_name:
 *                       type: string
 *                       example: "Jane"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "user@dev.com"
 *                     status:
 *                       type: integer
 *                       example: 1
 *                     email_verified:
 *                       type: integer
 *                       example: 0
 *                     last_active:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-17T12:00:00Z"
 *                     terms_version:
 *                       type: string
 *                       example: "v1.2"
 *       400:
 *         description: Bad request, user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "User Not found!"
 *       401:
 *         description: Unauthorized, token not provided or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Please authenticate"
 *       502:
 *         description: Server error, unable to retrieve user profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 502
 *                 message:
 *                   type: string
 *                   example: "get user profile failed!"
 */
router.post(
    '/get_profile',
    auth(),
    userValidator.profileGetValidator,
    authController.getProfile,
);

/**
 * @swagger
 * /profile/update_profile:
 *   post:
 *     summary: Updates the user's profile information
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: Unique identifier of the user.
 *                 example: "a12b3c4d-5e6f-7g8h-9i0j-123k456l789m"
 *               first_name:
 *                 type: string
 *                 description: The first name of the user.
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 description: The last name of the user.
 *                 example: "Doe"
 *               user_role:
 *                 type: number
 *                 description: The role ID to be assigned to the user.
 *                 example: 2
 *               society:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of society IDs the user is associated with.
 *                 example: ["society1", "society2"]
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile updated Successfully!"
 *       400:
 *         description: Bad request, profile update failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Profile Update Failed!"
 *       401:
 *         description: Unauthorized, token not provided or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Please authenticate"
 *       502:
 *         description: Server error, profile update failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 502
 *                 message:
 *                   type: string
 *                   example: "profile update failed!"
 */
router.post(
    '/update_profile',
    auth(),
    userValidator.profileUpdateValidator,
    authController.profileUpdate,
);

/**
 * @swagger
 * /profile/get_user_societies:
 *   post:
 *     summary: Retrieves societies associated with a user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: Unique identifier of the user.
 *                 example: "user-uuid-1234"
 *     responses:
 *       200:
 *         description: Societies associated with the user retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "get societies of user-uuid-1234 success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uuid:
 *                         type: string
 *                         example: "society-uuid-5678"
 *                       name:
 *                         type: string
 *                         example: "Global Health Society"
 *                       description:
 *                         type: string
 *                         example: "Dedicated to global health improvements"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T00:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-02T12:00:00.000Z"
 *       400:
 *         description: Bad request, user societies could not be retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "User societies retrieval failed"
 *       401:
 *         description: Unauthorized, token not provided or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Please authenticate"
 *       502:
 *         description: Server error, unable to fetch user societies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 502
 *                 message:
 *                   type: string
 *                   example: "get user societies error"
 */
router.post('/get_user_societies', auth(), societyValidator.getUserSocietiesValidator, societyController.getUserSocieties);

/**
 * @swagger
 * /profile/get_user_role:
 *   post:
 *     summary: Retrieves the role of a user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID of the user to check role for.
 *                 example: "user-uuid-1234"
 *     responses:
 *       200:
 *         description: User role retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "user role checked"
 *                 data:
 *                   type: object
 *                   properties:
 *                     role_id:
 *                       type: string
 *                       description: The role ID associated with the user.
 *                       example: "role-uuid-5678"
 *       400:
 *         description: Invalid request, due to incorrect user ID or the role cannot be found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid User Role!"
 *       401:
 *         description: Unauthorized, token not provided or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Please authenticate"
 *       502:
 *         description: Server error, unable to fetch user societies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 502
 *                 message:
 *                   type: string
 *                   example: "check user role error"
 */
router.post('/get_user_role', auth(), userRoleValidator.getUserRoleValidator, userRoleController.getUserRole);

module.exports = router;