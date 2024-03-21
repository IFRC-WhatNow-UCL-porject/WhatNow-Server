const express = require('express');
const MessageController = require('../controllers/MessageController');
const MessageValidator = require('../validator/MessageValidator');

const router = express.Router();
const auth = require('../middlewares/contentMessageRouteAuth');

const messageController = new MessageController();
const messageValidator = new MessageValidator();

// message routes
/**
 * @swagger
 * /contentMessage/get_content_message:
 *   post:
 *     summary: Get messages in content
 *     tags: [ContentMessage]
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
 *       '200':
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
 *                           example: "2024-03-14T20:28:43.000Z"
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
router.post('/get_content_message', auth(), messageValidator.messageGetValidator, messageController.getContentMessage);

/**
 * @swagger
 * /contentMessage/update_content_message:
 *   post:
 *     summary: Update content message
 *     tags: [ContentMessage]
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
 *               messages:
 *                 type: object
 *                 patternProperties:
 *                   "^[a-zA-Z0-9_]+$":
 *                     type: array
 *                     items:
 *                       type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: Message Updated
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
 *                       example: "Update content message successful"
 *                     data:
 *                       type: integer
 *                       description: effected id
 *                       example: 2
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
router.post('/update_content_message', auth(), messageValidator.messageUpdateValidator, messageController.updateContentMessage);

module.exports = router;