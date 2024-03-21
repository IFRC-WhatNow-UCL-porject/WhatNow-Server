const express = require('express');
const TermValidator = require('../validator/termValidator');
const TermController = require('../controllers/termController');

const router = express.Router();
const auth = require('../middlewares/termRouteAuth');
const termController = new TermController();
const termValidator = new TermValidator();

/**
 * @swagger
 * /term/get_all_versions:
 *   post:
 *     summary: Retrieves all versions of the terms and conditions
 *     tags: [Term]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All versions of the terms and conditions fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All versions fetched successfully"
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       version:
 *                         type: string
 *                         description: Version identifier of the terms and conditions.
 *                         example: "v1.0"
 *                       date:
 *                         type: string
 *                         description: Publication date of the version.
 *                         example: "2022-01-01"
 *       401:
 *         description: Unauthorized access, token not provided or invalid.
 *         content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Please authenticate"
 *       502:
 *         description: Server error, unable to fetch the versions of terms and conditions.
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
 *                   example: "Unable to fetch versions due to a server error."
 */
router.post('/get_all_versions', auth(), termController.getAllVersions);

/**
 * @swagger
 * /term/get_term_by_version:
 *   post:
 *     summary: Retrieves the terms and conditions for a specified version
 *     tags: [Term]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               version:
 *                 type: string
 *                 description: The version identifier of the terms and conditions.
 *                 example: "1.0"
 *     responses:
 *       200:
 *         description: Terms and conditions for the specified version fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Term fetched successfully"
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   description: Full text of the terms and conditions for the requested version.
 *                   example: "Terms and Conditions for version v1.0..."
 *       400:
 *         description: Bad request, specified version not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Version not found"
 *                 status:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized access, token not provided or invalid.
 *         content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Please authenticate"
 *       502:
 *         description: Server error while fetching the terms for the specified version.
 *         content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 502
 *                 message:
 *                   type: string
 *                   example: "Unable to fetch term due to a server error."
 */
router.post('/get_term_by_version', auth(), termValidator.getTermByVersionValidator, termController.getTermByVersion);

/**
 * @swagger
 * /term/publish_term:
 *   post:
 *     summary: Publishes a new version of the terms and conditions
 *     tags: [Term]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - version
 *             properties:
 *               version:
 *                 type: string
 *                 description: The version identifier for the new terms and conditions.
 *                 example: "2.0"
 *               term:
 *                 type: string
 *                 description: Full text of the terms and conditions.
 *                 example: "Terms and Conditions text..."
 *     responses:
 *       200:
 *         description: New version of terms and conditions published successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Term published successfully"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request, such as missing required fields.
 *         content:
 *           application/json:
*             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
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
 *                   example: "Please authenticate"
 *       502:
 *         description: Server error while publishing the term.
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
 *                   example: "Unable to publish term due to a server error."
 */
router.post('/publish_term', auth(), termValidator.publishTermValidator, termController.publishTerm);

// no auth required
/**
 * @swagger
 * /term/get_latest_term:
 *   post:
 *     summary: Retrieves the latest version of the terms and conditions
 *     tags: [Term]
 *     responses:
 *       200:
 *         description: Latest version of terms and conditions fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Latest term fetched successfully"
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   description: Full text of the latest version of the terms and conditions.
 *                   example: "Terms and Conditions text for version v2.0..."
 *       502:
 *         description: Server error while fetching the latest terms and conditions.
 *         content:
 *           application/json:
*             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to fetch latest term due to a server error."
 */
router.post('/get_latest_term', termController.getLatestTerm);

module.exports = router;