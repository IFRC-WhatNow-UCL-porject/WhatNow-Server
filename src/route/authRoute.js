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


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
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
 *                 required: true
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 required: true
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Successfully Registered the account! Please Verify your email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully Registered the account! Please Verify your email.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 9
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: testuser2@dev.com
 *                     uuid:
 *                       type: string
 *                       example: "caee7b25-aa6c-43ae-81a1-c224b3b5a4be"
 *                     status:
 *                       type: integer
 *                       example: 1
 *                     email_verified:
 *                       type: integer
 *                       example: 0
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-14T22:12:57.432Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-14T22:12:57.432Z"
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
 *                   example: "password is required"
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
router.post('/register', userValidator.userCreateValidator, authController.register);

/**
 * @swagger
 * /auth/add_api_user:
 *   post:
 *     summary: Add a new API user
 *     tags: [Auth]
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
 *                 response:
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
 *                   example: "Unauthorized"
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
router.post('/add_api_user', apiUserValidator.addApiUserValidator, apiUserController.addApiUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
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
 *                 required: true
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 required: true
 *     responses:
 *       '200':
 *         description: Login Successful
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
 *                   example: "Login Successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 9
 *                     uuid:
 *                       type: string
 *                       example: "caee7b25-aa6c-43ae-81a1-c224b3b5a4be"
 *                     first_name:
 *                       type: string
 *                       nullable: true
 *                     last_name:
 *                       type: string
 *                       nullable: true
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "testuser2@dev.com"
 *                     status:
 *                       type: integer
 *                       example: 1
 *                     email_verified:
 *                       type: integer
 *                       example: 0
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-14T22:12:57.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-14T22:12:57.000Z"
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjYWVlN2IyNS1hYTZjLTQzYWUtODFhMS1jMjI0YjNiNWE0YmUiLCJpYXQiOjE3MTA0NTQ4MjAsImV4cCI6MTcxMDU0MTIyMCwidHlwZSI6ImFjY2VzcyJ9.hBP8P-4-vBPsbR4EypOc3m-djWNj_7FXUP7JxitvsI8"
 *                         expires:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-15T22:20:20.696Z"
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
 *                   example: "password is required"
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
router.post('/login', userValidator.userLoginValidator, authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: Array of tokens to be revoked
 *     responses:
 *       '204':
 *         description: No Content
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/check_user_role:
 *   post:
 *     summary: Check User Role
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: Success
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
 *                       example: success
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 6
 *                         user_id:
 *                           type: string
 *                           example: "1b499138-6e04-4622-9362-03f67b842844"
 *                         role_id:
 *                           type: integer
 *                           example: 3
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-12T17:34:51.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-12T17:34:51.000Z"
 *       '400':
 *         description: Confirm password not matched
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
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid User Role!"
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
 *                   example: "Unauthorized"
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
    '/check_user_role',
    userRoleValidator.getUserRoleValidator,
    userRoleController.getUserRole,
);

/**
 * @swagger
 * /auth/check_user_login_info:
 *   post:
 *     summary: Checks user's login information.
 *     description: Validates user's email and password, checks for email verification and user's active status before allowing login.
 *     tags: [Auth]
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
 *                 description: User's email address.
 *                 example: user@dev.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: securePassword123!
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login Successful. Returns user's email and UUID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Login Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: “user@dev.com”
 *                     uuid:
 *                       type: string
 *                       example: uuid-of-the-user
 *       400:
 *         description: Bad Request. Possible reasons include invalid email address, user not active, email not verified, or wrong password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid Email Address! / User is not active! / Email is not verified! / Wrong Password!
 *       502:
 *         description: Bad Gateway. An error occurred while attempting to log in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 502
 *                 message:
 *                   type: string
 *                   example: Login Error
 */
router.post(
    '/check_user_login_info',
    userValidator.userLoginValidator,
    authController.checkLoginInfo,
);

/**
 * @swagger
 * /auth/check_user_status:
 *   post:
 *     summary: Verifies the user's token status.
 *     description: Checks if the provided token is valid, not blacklisted, and corresponds to an active user session.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is verified successfully, indicating the user is logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: token verified
 *                 data:
 *                   type: object
 *                   properties:
 *                     isLoggedIn:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad Request. Possible reasons include invalid token, or token not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: token not found / [specific JWT error message]
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: The HTTP status code.
 *                   example: 401
 *                 message:
 *                   type: string
 *                   description: A brief message explaining the error.
 *                   example: "Please authenticate"
 *       502:
 *         description: Bad Gateway. An error occurred while attempting to verify the token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 502
 *                 message:
 *                   type: string
 *                   example: token verify failed
 */
router.post(
    '/check_user_status',
    authController.checkUserStatus,
);

/**
 * @swagger
 * /auth/set_user_terms_version:
 *   post:
 *     summary: Sets the terms and conditions version for a user.
 *     description: Updates the terms and conditions version for a user, identified by UUID, to the specified version.
 *     tags: [Auth]
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
 *                 description: The UUID of the user.
 *                 example: '123e4567-e89b-12d3-a456-426614174000'
 *               terms_version:
 *                 type: string
 *                 description: The version of the terms and conditions that the user has agreed to.
 *                 example: 'v1.2'
 *             required:
 *               - uuid
 *               - terms_version
 *     responses:
 *       200:
 *         description: Terms version updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Terms version updated Successfully!
 *       400:
 *         description: Bad Request. 
 *         Possible reason: Terms version update failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Terms version Update Failed!
 *       401:
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
 *                   example: "Unauthorized"
 *       502:
 *         description: Bad Gateway. An error occurred while setting the user terms version.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 502
 *                 message:
 *                   type: string
 *                   example: set user terms version failed!
 */
router.post(
    '/set_user_terms_version',
    auth(),
    userValidator.setUserTermsVersionValidator,
    authController.setUserTermsVersion,
);

/**
 * @swagger
 * /auth/oauth_check_email_exist:
 *   post:
 *     summary: Checks if an email exists and its verification status
 *     tags: [Auth]
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
 *                 description: Email to check for existence and verification status.
 *                 example: user@dev.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Email existence and verification status checked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exist:
 *                   type: boolean
 *                   description: Whether the email exists or not.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     status:
 *                       type: string
 *                     email_verified:
 *                       type: boolean
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     access:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                         expires:
 *                           type: string
 *                         example:
 *                           token: "access-token"
 *                           expires: "2024-03-12T01:06:54.000Z"
 *       400:
 *         description: Bad request. User is inactive or email not verified.
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
 *                   example: "User is Inactive!" # Or "Email not verified!"
 *       502:
 *         description: Server error. Unable to check email existence.
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
 *                   example: "check email exist failed!"
 */
router.post(
    '/oauth_check_email_exist',
    userValidator.oauthCheckEmailExistValidator,
    authController.oauthCheckEmailExist
)

/**
 * @swagger
 * /auth/check_email_exist:
 *   post:
 *     summary: Check if email exists
 *     tags: [Auth]
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
 *                 required: true
 *     responses:
 *       '200':
 *         description: Email found!
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
 *                   example: "Email is available"
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
 *                   example: "Email already taken"
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
    '/check_email_exist',
    userValidator.checkEmailExistValidator,
    authController.checkEmailExist
)

/**
 * @swagger
 * /auth/check_email_token:
 *   post:
 *     summary: Checks the validity of an email token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token to be verified.
 *                 example: "some-email-token"
 *               type:
 *                 type: string
 *                 description: The type of the token to be verified.
 *                 example: "emailVerification"
 *             required:
 *               - token
 *               - type
 *     responses:
 *       200:
 *         description: Token has been verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isLoggedIn:
 *                   type: boolean
 *                   description: Indicates if the user is logged in based on the token verification.
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "token verified"
 *       400:
 *         description: Bad request. Possible reasons include invalid token or token not found.
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
 *                   example: "token not found" # or specific error message
 *       502:
 *         description: Server error. Unable to verify the token.
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
 *                   example: "token verify failed"
 */
router.post(
    '/check_email_token',
    userValidator.checkEmailTokenValidator,
    authController.checkEmailToken
)

/**
 * @swagger
 * /auth/reset_password:
 *   post:
 *     summary: Change User Password
 *     tags: [Auth]
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
 *                   example: false
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
 *         description: Confirm password not matched
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
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Confirm password not matched
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
 *                   example: "Unauthorized"
 *       '404':
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
    '/reset_password',
    userValidator.resetPasswordValidator,
    authController.resetPassword
)

/**
 * @swagger
 * /auth/send_reset_password_email:
 *   post:
 *     summary: Sends a reset password email to the user
 *     tags: [Auth]
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
 *                 description: The email address of the user who wants to reset their password.
 *                 example: user@dev.com
 *     responses:
 *       200:
 *         description: Reset password email sent successfully.
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
 *                   example: Reset password email sent successfully!
 *       400:
 *         description: Bad request. The provided email may not exist or other validation errors.
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
 *                   example: "Email does not exist or other error message"
 *       502:
 *         description: Server error. Unable to send reset password email due to an issue with the mail server or other backend issue.
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
 *                   example: "Failed to send reset password email"
 */
router.post(
    '/send_reset_password_email',
    userValidator.sendResetPasswordEmailValidator,
    authController.sendResetPasswordEmail
)

/**
 * @swagger
 * /auth/send_activation_email:
 *   post:
 *     summary: Sends an account activation email to the user
 *     tags: [Auth]
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
 *                 description: The email address of the user who needs to activate their account.
 *                 example: user@dev.com
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
 *                   example: Activation email sent successfully!
 *       400:
 *         description: Bad request. The provided email may not exist or other validation errors.
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
 *                   example: "Email does not exist or other error message"
 *       502:
 *         description: Server error. Unable to send activation email due to an issue with the mail server or other backend issue.
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
 *                   example: "Failed to send activation email"
 */
router.post(
    '/send_activation_email',
    userValidator.sendActivationEmailValidator,
    authController.sendActivationEmail
)

module.exports = router;
