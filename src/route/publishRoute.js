const express = require('express');
const RegionController = require('../controllers/RegionController');
const RegionValidator = require('../validator/RegionValidator');

const router = express.Router();
const auth = require('../middlewares/publishRouteAuth');

const regionController = new RegionController();
const regionValidator = new RegionValidator();


// publish routes
/**
 * @swagger
 * /publish/publish:
 *   post:
 *     summary: Publishes a region
 *     tags: [Publish]
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
 *                 description: Unique identifier of the region to be published.
 *                 example: "abcd1234"
 *     responses:
 *       200:
 *         description: Region published successfully.
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
 *                   example: "Region published successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       example: "abcd1234"
 *                     name:
 *                       type: string
 *                       example: "Northern Region"
 *                     status:
 *                       type: string
 *                       example: "published"
 *       400:
 *         description: Region not found.
 *       401:
 *         description: Unauthorized access.
 *       502:
 *         description: Server error publishing region.
 */
router.post('/publish', auth(), regionValidator.publishValidator, regionController.publish);

/**
 * @swagger
 * /publish/stop_publish:
 *   post:
 *     summary: Stops the publication of a region
 *     tags: [Publish]
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
 *                 description: Unique identifier of the region to stop publishing.
 *                 example: "abcd1234"
 *     responses:
 *       200:
 *         description: Region publication stopped successfully.
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
 *                   example: "Region stop published successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       example: "abcd1234"
 *                     name:
 *                       type: string
 *                       example: "Northern Region"
 *                     status:
 *                       type: string
 *                       example: "unpublished"
 *       400:
 *         description: Region not found or invalid request.
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
 *                   example: "Region not found"
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
 *         description: Server error while attempting to stop publishing the region.
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
 *                   example: "stop publish region error"
 */
router.post('/stop_publish', auth(), regionValidator.stopPublishValidator, regionController.stopPublish);

module.exports = router;