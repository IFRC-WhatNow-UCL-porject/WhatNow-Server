const express = require('express');
const ApiUserController = require('../controllers/ApiUserController');
const ApiUserValidator = require('../validator/ApiUserValidator');

const router = express.Router();
const auth = require('../middlewares/apiUserRouteAuth');

const apiUserController = new ApiUserController();
const apiUserValidator = new ApiUserValidator();

// api user routes

/**
 * @swagger
 * /apiUsers/get_api_users:
 *   post:
 *     summary: Get all API users
 *     tags: [ApiUser]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 body:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier of the user.
 *                         example: 4
 *                       uuid:
 *                         type: string
 *                         description: The UUID of the user.
 *                         example: "aa862a68-a243-4d67-be46-74615bebbe84"
 *                       email:
 *                         type: string
 *                         description: The email address of the user.
 *                         example: "testapiuser2@dev.com"
 *                       first_name:
 *                         type: string
 *                         description: The first name of the user.
 *                         example: "Test first 2"
 *                       last_name:
 *                         type: string
 *                         description: The last name of the user.
 *                         example: "Api user 2"
 *                       status:
 *                         type: integer
 *                         description: The status of the user.
 *                         example: 1
 *                       email_verified:
 *                         type: integer
 *                         description: The email verification status of the user.
 *                         example: 0
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the user was created.
 *                         example: "2024-03-12T00:07:38.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The time when the user was last updated.
 *                         example: "2024-03-12T00:07:38.000Z"
 *                       role_id:
 *                         type: integer
 *                         description: The role ID of the user.
 *                         example: 3
 *                       society_id:
 *                         type: string
 *                         description: The society ID of the user.
 *                         example: "0f21cd24-ad15-414f-8706-a433f2319c4a"
 *                       location:
 *                         type: string
 *                         description: The location of the user.
 *                         example: "GB"
 *                       organization:
 *                         type: string
 *                         description: The organization of the user.
 *                         example: "IFRC"
 *                       industry_type:
 *                         type: string
 *                         description: The industry type of the user.
 *                         example: "Red Cross"
 *                       usage:
 *                         type: string
 *                         description: Additional usage information about the user.
 *                         example: "For individual use"
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
 *                   description: A brief message explaining the error.
 *                   example: "Please authenticate"
 */
router.post('/get_api_users', auth(), apiUserController.getAllApiUsers);

/**
 * @swagger
 * /apiUsers/get_api_user_by_id:
 *   post:
 *     summary: Get API user by ID
 *     tags:
 *       - ApiUser
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: ID of the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *     responses:
 *       '200':
 *         description: Successful get by id operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 response:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 200
 *                     message:
 *                       type: string
 *                       example: "API User found!"
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: The unique identifier of the user.
 *                           example: 4
 *                         uuid:
 *                           type: string
 *                           description: The UUID of the user.
 *                           example: "aa862a68-a243-4d67-be46-74615bebbe84"
 *                         email:
 *                           type: string
 *                           description: The email address of the user.
 *                           example: "testapiuser2@dev.com"
 *                         first_name:
 *                           type: string
 *                           description: The first name of the user.
 *                           example: "Test first 2"
 *                         last_name:
 *                           type: string
 *                           description: The last name of the user.
 *                           example: "Api user 2"
 *                         status:
 *                           type: integer
 *                           description: The status of the user.
 *                           example: 1
 *                         email_verified:
 *                           type: integer
 *                           description: The email verification status of the user.
 *                           example: 0
 *                         createAt:
 *                           type: string
 *                           format: date-time
 *                           description: The timestamp when the user was created.
 *                           example: "2024-03-12T00:07:38.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The times when the user was last updated.
 *                           example: "2024-03-12T00:07:38.000Z"
 *                         role_id:
 *                           type: integer
 *                           description: The role ID of the user.
 *                           example: 3
 *                         society_id:
 *                           type: string
 *                           description: The society ID of the user.
 *                           example: "0f21cd24-ad15-414f-8706-a433f2319c4a"
 *                         location:
 *                           type: string
 *                           description: The location of the user.
 *                           example: "GB"
 *                         organization:
 *                           type: string
 *                           description: The organization of the user.
 *                           example: "IFRC"
 *                         industry_type:
 *                           type: string
 *                           description: The industry type of the user.
 *                           example: red cross
 *                         usage:
 *                           type: string
 *                           description: Additional usage information about the user.
 *                           example: for individual use
 *       '400':
 *         description: Known error
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
 *                   example: "\"userId\" is required"
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
 */
router.post('/get_api_user_by_id', auth(), apiUserValidator.getApiUserByIdValidator, apiUserController.getApiUserById)

/**
 * @swagger
 * /apiUsers/add_api_user:
 *   post:
 *     summary: Add a new API user
 *     tags: [ApiUser]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: API user data to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user (required)
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Password of the user (required)
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *               society_id:
 *                 type: string
 *                 description: Society ID of the user
 *               location:
 *                 type: string
 *                 description: Location of the user
 *               organization:
 *                 type: string
 *                 description: Organization of the user
 *               industry_type:
 *                 type: string
 *                 description: Industry type of the user
 *     responses:
 *       '201':
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 body:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     code:
 *                       type: integer
 *                       example: 201
 *                     message:
 *                       type: string
 *                       example: "Successfully Registered the account! Please Verify your email."
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 6
 *                         uuid:
 *                           type: string
 *                           example: "1b499138-6e04-4622-9362-03f67b842844"
 *                         email:
 *                           type: string
 *                           example: "testapiuser4@dev.com"
 *                         first_name:
 *                           type: string
 *                           example: "Test first 1"
 *                         last_name:
 *                           type: string
 *                           example: "Test last 1"
 *                         status:
 *                           type: integer
 *                           example: 1
 *                         email_verified:
 *                           type: integer
 *                           example: 0
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-12T17:34:51.327Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-12T17:34:51.327Z"
 *       '400':
 *         description: known error
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
 *                   example: "\"emial\" is required"
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
 *         description: unknown error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: The HTTP status code.
 *                   example: 502
 *                 message:
 *                   type: string
 *                   description: A brief message explaining the unknown error.
 *                   example: "Something went wrong"
 */
router.post('/add_api_user', auth(), apiUserValidator.addApiUserValidator, apiUserController.addApiUser);

/** 
 * @swagger
 * /apiUsers/update_api_user:
 *   post:
 *     summary: Update an existing API user
 *     tags: [ApiUser]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: API user data to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user (required)
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Password of the user (required)
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *               society_id:
 *                 type: string
 *                 description: Society ID of the user
 *               location:
 *                 type: string
 *                 description: Location of the user
 *               organization:
 *                 type: string
 *                 description: Organization of the user
 *               industry_type:
 *                 type: string
 *                 description: Industry type of the user
 *               uuid:
 *                 type: string
 *                 description: UUID of the user to be updated (required)
 *     responses:
 *       '200':
 *         description: API User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 response:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     code:
 *                       type: integer
 *                       example: 200
 *                     message:
 *                       type: string
 *                       example: "API User updated Successfully!"
 *                     data:
 *                       type: object
 *                       properties: {}
 *       '400':
 *         description: Bad request
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
 *                   description: A brief message explaining the error.
 *                   example: "\"uuid\" is required"
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
 *                   description: A brief message explaining the error.
 *                   example: "Please authenticate"
 *       '502':
 *         description: unknown error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: The HTTP status code.
 *                   example: 502
 *                 message:
 *                   type: string
 *                   description: A brief message explaining the error.
 *                   example: "Something went wrong"
*/
router.post('/update_api_user', auth(), apiUserValidator.updateApiUserValidator, apiUserController.updateApiUser);

/**
 * @swagger
 * /apiUsers/delete_api_user:
 *   post:
 *     summary: Delete an existing API user
 *     tags: [ApiUser]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: API user data to be deleted
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: UUID of the user to be deleted (required)
 *     responses:
 *       '200':
 *         description: API User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 response:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     code:
 *                       type: integer
 *                       example: 200
 *                     message:
 *                       type: string
 *                       example: "API User deleted Successfully!"
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 7
 *                         uuid:
 *                           type: string
 *                           example: "b9cf7f89-1b63-4e07-b948-c2a93232a944"
 *                         first_name:
 *                           type: string
 *                           example: "Test first 1"
 *                         last_name:
 *                           type: string
 *                           example: "API User"
 *                         email:
 *                           type: string
 *                           example: "testapiuser5@dev.com"
 *                         password:
 *                           type: null
 *                         status:
 *                           type: integer
 *                           example: 1
 *                         email_verified:
 *                           type: integer
 *                           example: 0
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-12T17:48:04.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-13T11:17:45.000Z"
 *       '400':
 *         description: Bad request
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
 *                   example: "\"email\" is required"
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
 *         description: unknown error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: The HTTP status code.
 *                   example: 502
 *                 message:
 *                   type: string
 *                   description: A brief message explaining the error.
 *                   example: "Something went wrong"
 */
router.post('/delete_api_user', auth(), apiUserValidator.deleteApiUserValidator, apiUserController.deleteApiUser);

module.exports = router;