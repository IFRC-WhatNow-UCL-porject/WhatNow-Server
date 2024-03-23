const express = require('express');
const SocietyController = require('../controllers/SocietyController');
const SocietyValidator = require('../validator/SocietyValidator');
const LanguagValidator = require('../validator/LanguageValidator');
const LanguageController = require('../controllers/LanguageController');
const RegionValidator = require('../validator/RegionValidator');
const RegionController = require('../controllers/RegionController');
const ContentValidator = require('../validator/ContentValidator');
const ContentController = require('../controllers/ContentController');
const MessageValidator = require('../validator/MessageValidator');
const MessageController = require('../controllers/MessageController');

const router = express.Router();
const auth = require('../middlewares/messagesRouteAuth');

const societyController = new SocietyController();
const societyValidator = new SocietyValidator();
const languageController = new LanguageController();
const languageValidator = new LanguagValidator();
const regionController = new RegionController();
const regionValidator = new RegionValidator();
const contentController = new ContentController();
const contentValidator = new ContentValidator();
const messageController = new MessageController();
const messageValidator = new MessageValidator();


/**
 * @swagger
 * /messages/get_all_societies:
 *   post:
 *     summary: Retrieves all societies
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all societies fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "get all societies successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uuid:
 *                         type: string
 *                         description: Unique identifier for the society.
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       name:
 *                         type: string
 *                         description: Name of the society.
 *                         example: "International Federation of Societies"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the society was created.
 *                         example: "2024-03-17T12:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the society was last updated.
 *                         example: "2024-04-17T12:00:00Z"
 *       401:
 *         description: Unauthorized. Token not provided or invalid.
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
 *         description: Server error occurred while fetching all societies.
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
 *                   example: "get all societies error"
 */
router.post('/get_all_societies', auth(), societyValidator.getAllSocietiesValidator, societyController.getAllSocieties);

/**
 * @swagger
 * /messages/get_language:
 *   post:
 *     summary: Get language by society id
 *     tags: [Message]
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
 * /messages/get_published_region:
 *   post:
 *     summary: Retrieves published regions for a given society and language code
 *     tags: [Message]
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
 *                 description: The unique identifier of the society.
 *                 example: "society123"
 *               language_code:
 *                 type: string
 *                 description: The language code to filter the regions.
 *                 example: "en"
 *     responses:
 *       200:
 *         description: Region(s) fetched successfully.
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
 *                   example: "Region fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uuid:
 *                         type: string
 *                         description: Unique identifier for the region.
 *                         example: "region123"
 *                       name:
 *                         type: string
 *                         description: Name of the region.
 *                         example: "Region One"
 *                       status:
 *                         type: string
 *                         description: Publication status of the region.
 *                         example: "published"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the region was created.
 *                         example: "2024-03-17T12:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the region was last updated.
 *                         example: "2024-03-18T12:00:00Z"
 *       400:
 *         description: Bad request due to invalid parameters such as non-existing society or language code.
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
 *                   example: "Society not found" # Or "Language code not found"
 *       401:
 *         description: Unauthorized access due to no token or invalid token provided.
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
 *         description: Server error occurred while fetching the published regions.
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
 *                   example: "get published region error"
 */
router.post('/get_published_region', auth(), regionValidator.regionGetPublishedValidator, regionController.getPublishedRegion);

/**
 * @swagger
 * /messages/get_region_content:
 *   post:
 *     summary: Fetches content for a specific region, society, and language
 *     tags: [Message]
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
 *                 description: Unique identifier of the society.
 *                 example: "society123"
 *               language_code:
 *                 type: string
 *                 description: Language code for filtering content.
 *                 example: "en"
 *               region_id:
 *                 type: string
 *                 description: Unique identifier of the region.
 *                 example: "region123"
 *     responses:
 *       200:
 *         description: Region content fetched successfully.
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
 *                   example: "Region content fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content_id:
 *                         type: string
 *                         description: Unique identifier for the content.
 *                         example: "content123"
 *                       title:
 *                         type: string
 *                         description: Title of the content.
 *                         example: "Title Example"
 *                       description:
 *                         type: string
 *                         description: Description of the content.
 *                         example: "Description Example"
 *                       url:
 *                         type: string
 *                         description: URL to the content.
 *                         example: "http://example.com/content"
 *       400:
 *         description: Bad request due to validation errors such as society not found, language code not found, or region not found.
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
 *                   example: "Society not found" # Or "Language code not found", "Region not found"
 *       401:
 *         description: Unauthorized access due to no token or invalid token provided.
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
 *         description: Server error occurred while fetching region content.
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
 *                   example: "get region content error"
 */
router.post('/get_region_content', auth(), contentValidator.regionContentGetValidator, contentController.getRegionContent);

/**
 * @swagger
 * /messages/get_content_message:
 *   post:
 *     summary: Get messages in content
 *     tags: [Message]
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
 *               region_id:
 *                 type: string
 *                 required: true
 *               content_type:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Messages
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
 *                       example: "fetch messages successfully"
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           uuid:
 *                             type: string
 *                           society_id:
 *                             type: string
 *                           region_id:
 *                             type: string
 *                           language_code:
 *                             type: string
 *                           content_type:
 *                             type: string
 *                           type:
 *                             type: string
 *                           content:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *       400:
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
 *                   example: "society_id is required"
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
 *                   example: "Please authenticate"
 *       502:
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
router.post('/get_content_message', auth(), messageValidator.messageGetValidator, messageController.getContentMessage);

/**
 * @swagger
 * /messages/get_society_and_region_name:
 *   post:
 *     summary: Fetches content for a specific society, language, and region
 *     tags: [Message]
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
 *                 description: Unique identifier of the society
 *                 example: "1234abcd"
 *               language_code:
 *                 type: string
 *                 description: Language code for filtering content
 *                 example: "en"
 *               region_id:
 *                 type: string
 *                 description: Unique identifier of the region
 *                 example: "5678efgh"
 *     responses:
 *       200:
 *         description: Region content fetched successfully
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
 *                   example: "get society and region name successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     society_name:
 *                       type: string
 *                       description: Name of the society
 *                     region_name:
 *                       type: string
 *                       description: Name of the region
 *       400:
 *         description: Invalid input parameters
 *       401:
 *         description: Unauthorized access
 *       502:
 *         description: Server error fetching region content
 */
router.post('/get_society_and_region_name', auth(), societyValidator.getSocietyAndRegionNameValidator, societyController.getSocietyAndRegionName);

module.exports = router;