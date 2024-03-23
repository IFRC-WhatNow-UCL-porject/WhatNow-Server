const express = require('express');
const ContentController = require('../controllers/ContentController');
const ContentValidator = require('../validator/ContentValidator');

const router = express.Router();
const auth = require('../middlewares/bulkUploadRouteAuth');

const contentController = new ContentController();
const contentValidator = new ContentValidator();


// bulk upload routes
/**
 * @swagger
 * /bulkUpload/is_content_init:
 *   post:
 *     summary: Checks if content initialization is needed for a given society, language, and region
 *     tags: [BulkUpload]
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
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               language_code:
 *                 type: string
 *                 description: The language code for the content.
 *                 example: "en"
 *               region_id:
 *                 type: string
 *                 description: The unique identifier of the region.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Fetch content status success. Returns the initialization status.
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
 *                   example: "fetch content status success"
 *                 data:
 *                   type: boolean
 *                   description: Indicates whether content initialization is needed.
 *                   example: true
 *       400:
 *         description: Bad request. Possible reasons include society not existing, region not existing, or language code not existing.
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
 *         description: Server error. Unable to fetch content status.
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
 *                   example: "fetch content status error"
 */
router.post('/is_content_init', auth(), contentValidator.iSContentInitValidator, contentController.iSContentInit);

module.exports = router;