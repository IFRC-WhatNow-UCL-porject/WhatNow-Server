const express = require('express');
const LanguageController = require('../controllers/LanguageController');
const LanguageValidator = require('../validator/LanguageValidator');

const router = express.Router();
const auth = require('../middlewares/languageRouteAuth');

const languageController = new LanguageController();
const languageValidator = new LanguageValidator();

// language routes
/**
 * @swagger
 * /language/get_language:
 *   post:
 *     summary: Get language by society id
 *     tags: [Language]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               society_id:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: Language retrieved successfully
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
 *                       example: "fetch language by society successfully"
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           uuid:
 *                             type: string
 *                             example: "32a377d5-8f1c-4dc2-899b-b1135e7c146e"
 *                           society_id:
 *                             type: string
 *                             example: "0f21cd24-ad15-414f-8706-a433f2319c4a"
 *                           language_code:
 *                             type: string
 *                             example: "EN"
 *                           url:
 *                             type: string
 *                             example: "https://www.google.com"
 *                           description:
 *                             type: string
 *                             example: "English"
 *                           message:
 *                             type: string
 *                             example: "English"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-03-11T22:21:13.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-03-11T22:21:13.000Z"
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
 *                   description: error message
 *                   example: "\"society_id\" is required"
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
 *                   description: error message
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
router.post('/get_language', auth(), languageValidator.languageGetValidator, languageController.getLanguage);

/**
 * @swagger
 * /language/add_language:
 *   post:
 *     summary: Add language
 *     tags: [Language]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               society_id:
 *                 type: string
 *                 required: true
 *               language_code:
 *                 type: string
 *                 required: true
 *               url:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *               message:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: Language added successfully
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
 *                       example: "create language successfully"
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 10
 *                         society_id:
 *                           type: string
 *                           example: "0f21cd24-ad15-414f-8706-a433f2319c4a"
 *                         language_code:
 *                           type: string
 *                           example: "ZH"
 *                         description:
 *                           type: string
 *                           example: "Chineses"
 *                         url:
 *                           type: string
 *                           example: "https://google.com"
 *                         message:
 *                           type: string
 *                           example: "Chinese"
 *                         uuid:
 *                           type: string
 *                           example: "073f77a0-6c1a-45ae-b9ee-4edae2d2fa47"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-13T21:12:52.597Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-13T21:12:52.597Z"
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
 *                   description: error message
 *                   example: "Language code not exist"
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
 *                   description: error message
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
router.post('/add_language', auth(), languageValidator.languageAddValidator, languageController.addLanguage);

/**
 * @swagger
 * /language/update_language:
 *   post:
 *     summary: Update language
 *     tags: [Language]
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
 *                 required: true
 *               url:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *               message:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: Language updated successfully
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
 *                       example: "update language successfully"
 *                     data:
 *                       type: array
 *                       items:
 *                         type: integer
 *                         description: effected ids
 *                         example: 1
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
 *                   description: error message
 *                   example: "Language code not exist"       
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
 *                   description: error message
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
router.post('/update_language', auth(), languageValidator.languageUpdateValidator, languageController.updateLanguage);

module.exports = router;