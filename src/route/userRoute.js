const express = require('express');
const UserController = require('../controllers/UserController');
const UserValidator = require('../validator/UserValidator');
const AuthController = require('../controllers/AuthController');

const router = express.Router();
const auth = require('../middlewares/apiUserRouteAuth');

const userController = new UserController();
const userValidator = new UserValidator();
const authController = new AuthController();

/**
 * @swagger
 * /user/get_users:
 *   post:
 *     summary: Retrieves all users excluding API users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uuid:
 *                     type: string
 *                     description: Unique identifier for the user.
 *                     example: "user-uuid-1234"
 *                   first_name:
 *                     type: string
 *                     description: The user's first name.
 *                     example: "Jane"
 *                   last_name:
 *                     type: string
 *                     description: The user's last name.
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     description: The user's email address.
 *                     example: "jane.doe@dev.com"
 *                   status:
 *                     type: integer
 *                     description: The user's account status.
 *                     example: 1
 *                   email_verified:
 *                     type: integer
 *                     description: Indicates if the user's email is verified.
 *                     example: 1
 *                   last_active:
 *                     type: string
 *                     format: date-time
 *                     description: The last active timestamp of the user.
 *                     example: "2024-01-01T12:34:56.789Z"
 *                   terms_version:
 *                     type: string
 *                     description: The terms version the user has agreed to.
 *                     example: "v1.2"
 *       401:
 *         description: Unauthorized access, token not provided or invalid.
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
 *                   example: "Unauthorized"
 *       502:
 *         description: Server error while fetching users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to fetch users due to a server error."
 */
router.post('/get_users', auth(), userController.getAllUsers);

/**
 * @swagger
 * /user/get_user_role:
 *   post:
 *     summary: Retrieves a list of all user roles
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user roles fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: string
 *                     example: "user123"
 *                   role_id:
 *                     type: integer
 *                     example: 2
 *       401:
 *         description: Unauthorized access, token not provided or invalid.
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
 *                   example: "Unauthorized"
 *       502:
 *         description: Server error while fetching the user roles.
 */
router.post('/get_user_role', auth(), userController.getUserRole);

/**
 * @swagger
 * /user/get_user_society:
 *   post:
 *     summary: Retrieves all user-society associations
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user-society associations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: string
 *                     description: Unique identifier of the user.
 *                     example: "user123"
 *                   society_id:
 *                     type: string
 *                     description: Unique identifier of the society.
 *                     example: "society456"
 *       401:
 *         description: Unauthorized access, token not provided or invalid.
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
 *                   example: "Unauthorized"
 *       502:
 *         description: Server error while fetching the user-society associations.
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
 *                   example: "get user society failed!"
 */
router.post('/get_user_society', auth(), userController.getUserSociety);

/**
 * @swagger
 * /user/send_activation_email:
 *   post:
 *     summary: Sends an activation email to the specified user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user to send the activation email to.
 *                 example: "user@dev.com"
 *     responses:
 *       200:
 *         description: Activation email sent successfully.
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
 *                   example: "Activation email sent successfully!"
 *       400:
 *         description: Bad request, such as when the user is not found or already activated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found or already activated"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized access, token not provided or invalid.
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
 *                   example: "Unauthorized"
 *       502:
 *         description: Server error while attempting to send the activation email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to send activation email due to a server error."
 */
router.post(
    '/send_activation_email',
    auth(),
    userValidator.sendActivationEmailValidator,
    authController.sendActivationEmail
)

/**
 * @swagger
 * /user/change_status:
 *   post:
 *     summary: Updates the status of a specified user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uuid
 *               - status
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: Unique identifier of the user whose status is to be updated.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               status:
 *                 type: number
 *                 description: The new status to assign to the user.
 *                 example: 1
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User status updated Successfully!"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request, such as when the user cannot be found or the status update fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User status Update Failed!"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized access, token not provided or invalid.
 *         content:
 *           application/json:
*             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       502:
 *         description: Server error while attempting to change the user's status.
 *         content:
 *           application/json:
*             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "change status failed!"
 */
router.post(
    '/change_status',
    auth(),
    userValidator.changeStatusValidator,
    authController.changeStatus,
)

/**
 * @swagger
 * /user/create_profile:
 *   post:
 *     summary: Creates a new user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *                 example: "user@dev.com"
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
 *         description: Profile created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile Created Successfully!"
 *       400:
 *         description: Registration failed, such as due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registration Failed! Please Try again."
 *       401:
 *         description: Unauthorized access, token not provided or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       502:
 *         description: Server error while creating the profile.
 *         content:
 *           application/json:
*             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "create profile failed!"
 */
router.post(
    '/create_profile',
    auth(),
    userValidator.createProfileValidator,
    authController.createProfile,
)

module.exports = router;