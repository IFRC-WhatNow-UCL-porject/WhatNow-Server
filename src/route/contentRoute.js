const express = require('express');
const ContentController = require('../controllers/ContentController');
const ContentValidator = require('../validator/ContentValidator');

const router = express.Router();
const auth = require('../middlewares/contentRouteAuth');

const contentController = new ContentController();
const contentValidator = new ContentValidator();

// content routes
/**
 * @swagger
 * /content/get_content:
 *   post:
 *     summary: Get content
 *     tags: [Content]
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
 *         description: success
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
 *                       example: "success"
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
 *                             example: "ecb9c707-ee24-4f57-95d7-0596f5881572"
 *                           society_id:
 *                             type: string
 *                             example: "0f21cd24-ad15-414f-8706-a433f2319c4a"
 *                           language_code:
 *                             type: string
 *                             example: "ZH"
 *                           region_id:
 *                             type: string
 *                             example: "84f22fc8-e004-4a7d-b3e9-9429f08dbfce"
 *                           content_type:
 *                             type: string
 *                             example: "TYPE_ONE"
 *                           title:
 *                             type: string
 *                             example: "Earthquake In China"
 *                           description:
 *                             type: string
 *                             example: "description in ZH"
 *                           url:
 *                             type: string
 *                             example: "https://baidu.com"
 *                           is_published:
 *                             type: boolean
 *                             example: null
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-03-14T20:28:43.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-03-14T20:28:43.000Z"
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
 *                   example: "society_id is required"
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
router.post('/get_content', auth(), contentValidator.contentGetValidator, contentController.getContent);

/**
 * @swagger
 * /content/get_content_by_id:
 *   post:
 *     summary: Fetch content by its unique identifier
 *     tags: [Content]
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
 *                 description: Unique identifier for the content.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Content fetched successfully by id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "fetch content by id successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ContentData'
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
 *         description: Error fetching content by id.
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
 *                   example: "fetch content error"
 */
router.post('/get_content_by_id', auth(), contentValidator.contentGetByIdValidator, contentController.getContentById);

/**
 * @swagger
 * /content/get_contentIds:
 *   post:
 *     summary: Retrieve content IDs based on society, language, and region
 *     tags: [Content]
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
 *                 description: The language code to filter the content.
 *                 example: "en"
 *               region_id:
 *                 type: string
 *                 description: The unique identifier of the region.
 *                 example: "region123"
 *     responses:
 *       200:
 *         description: Content IDs fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "fetch content ids successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: A content UUID.
 *                     example: "uuid123"
 *       400:
 *         description: Invalid request parameters.
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
 *                   example: "Society not exist" # Or "Region not exist", "Language code not exist"
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
 *         description: Error fetching content IDs.
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
 *                   example: "fetch content ids error"
 */
router.post('/get_contentIds', auth(), contentValidator.contentGetIdsValidator, contentController.getContentIds);

/**
 * @swagger
 * /content/add_content:
 *   post:
 *     summary: Add content
 *     tags: [Content]
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
 *               title:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *               url:
 *                 type: string
 *                 required: true
 *               messages:
 *                 type: object
 *                 patternProperties:
 *                   '^[a-zA-Z0-9_]*$':
 *                     type: array
 *                     items:
 *                       type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: success
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
 *                       example: "success"
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         society_id:
 *                           type: string
 *                           example: "0f21cd24-ad15-414f-8706-a433f2319c4a"
 *                         language_code:
 *                           type: string
 *                           example: "ZH"
 *                         region_id:
 *                           type: string
 *                           example: "84f22fc8-e004-4a7d-b3e9-9429f08dbfce"
 *                         content_type:
 *                           type: string
 *                           example: "TYPE_ONE"
 *                         title:
 *                           type: string
 *                           example: "Earthquake In China"
 *                         description:
 *                           type: string
 *                           example: "description in ZH"
 *                         url:
 *                           type: string
 *                           example: "https://baidu.com"
 *                         uuid:
 *                           type: string
 *                           example: "ecb9c707-ee24-4f57-95d7-0596f5881572"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-14T20:28:43.412Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-14T20:28:43.412Z"
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
 *                   example: "society_id is required"
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
router.post('/add_content', auth(), contentValidator.contentAddValidator, contentController.addContent);

/**
 * @swagger
 * /content/init_content:
 *   post:
 *     summary: Initializes content for a given society, language, and region
 *     tags: [Content]
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
 *                 description: The language code for the content.
 *                 example: "en"
 *               region_id:
 *                 type: string
 *                 description: The unique identifier of the region.
 *                 example: "region123"
 *     responses:
 *       200:
 *         description: Content initialized successfully.
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
 *                       example: "init content successfully"
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         society_id:
 *                           type: string
 *                           example: "0f21cd24-ad15-414f-8706-a433f2319c4a"
 *                         language_code:
 *                           type: string
 *                           example: "ZH"
 *                         region_id:
 *                           type: string
 *                           example: "84f22fc8-e004-4a7d-b3e9-9429f08dbfce"
 *                         content_type:
 *                           type: string
 *                           example: "TYPE_ONE"
 *                         title:
 *                           type: string
 *                           example: "Earthquake In China"
 *                         description:
 *                           type: string
 *                           example: "description in ZH"
 *                         url:
 *                           type: string
 *                           example: "https://baidu.com"
 *                         uuid:
 *                           type: string
 *                           example: "ecb9c707-ee24-4f57-95d7-0596f5881572"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-14T20:28:43.412Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-14T20:28:43.412Z"
 *       400:
 *         description: Bad request. Problems such as society not existing, region not existing, or language code not existing.
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
 *                   example: "Society not exist" # Or "Region not exist", "Language code not exist"
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
 *         description: Server error. There was an issue initializing the content.
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
 *                   example: "fetch content ids error"
 */
router.post('/init_content', auth(), contentValidator.contentInitValidator, contentController.initContent);

/**
 * @swagger
 * /content/update_content:
 *   post:
 *     summary: Update content
 *     tags: [Content]
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
 *               title:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *               url:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: success
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
 *                       example: "success"
 *                     data:
 *                       type: array
 *                       items:
 *                         type: integer
 *                         description: effected id
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
 *                   example: "uuid is required"
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
router.post('/update_content', auth(), contentValidator.contentUpdateValidator, contentController.updateContent);

/**
 * @swagger
 * /content/delete_content:
 *   post:
 *     summary: Delete content
 *     tags: [Content]
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
 *     responses:
 *       '200':
 *         description: success
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
 *                       example: "success"
 *                     data:
 *                       type: integer
 *                       description: effected id
 *                       example: 1
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
 *                   example: "uuid is required"
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
router.post('/delete_content', auth(), contentValidator.contentDeleteValidator, contentController.deleteContent);

/**
 * @swagger
 * /content/get_existed_content_type:
 *   post:
 *     summary: Retrieves all content types for a given society, language, and region
 *     tags: [Content]
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
 *                 description: Language code to filter the content.
 *                 example: "en"
 *               region_id:
 *                 type: string
 *                 description: Unique identifier of the region.
 *                 example: "region123"
 *     responses:
 *       200:
 *         description: Fetched content type(s) successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "fetch content type successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Content type identifier.
 *                     example: "TYPE_ONE"
 *       400:
 *         description: Bad request due to invalid parameters such as non-existing society, language code, or region.
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
 *                   example: "Society not exist" # Or "Region not exist", "Language code not exist"
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
 *                   example: "Unauthorized"
 *       502:
 *         description: Server error occurred while fetching content types.
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
 *                   example: "fetch content type error"
 */
router.post('/get_existed_content_type', auth(), contentValidator.contentTypeGetValidator, contentController.getContentType);

module.exports = router;