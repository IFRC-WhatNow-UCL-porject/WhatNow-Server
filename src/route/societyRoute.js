const express = require('express');
const SocietyController = require('../controllers/SocietyController');
const SocietyValidator = require('../validator/SocietyValidator');

const router = express.Router();
const auth = require('../middlewares/societyRouteAuth');

const societyController = new SocietyController();
const societyValidator = new SocietyValidator();

/**
 * @swagger
 * /society/get_user_societies:
 *   post:
 *     summary: Retrieves societies associated with a given user
 *     tags: [Society]
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
 *                 description: Unique identifier of the user.
 *                 example: "user-uuid-1234"
 *     responses:
 *       200:
 *         description: Societies associated with the user retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uuid:
 *                     type: string
 *                     description: Unique identifier of the society.
 *                     example: "society-uuid-5678"
 *                   society_name:
 *                     type: string
 *                     description: Name of the society.
 *                     example: "Global Health Society"
 *                   country_code:
 *                     type: string
 *                     description: Country code of the society's location.
 *                     example: "US"
 *                   url:
 *                     type: string
 *                     description: Website URL of the society.
 *                     example: "https://www.globalhealthsociety.org"
 *                   image_url:
 *                     type: string
 *                     description: URL of the society's logo or representative image.
 *                     example: "https://www.globalhealthsociety.org/logo.png"
 *       400:
 *         description: Bad request, such as when user societies could not be retrieved.
 *       401:
 *         description: Unauthorized, indicating token not provided or invalid.
 *       502:
 *         description: Server error, unable to fetch user societies.
 */
router.post('/get_user_societies', auth(), societyValidator.getUserSocietiesValidator, societyController.getUserSocieties);

/**
 * @swagger
 * /society/get_all_societies:
 *   post:
 *     summary: Retrieves all societies
 *     tags: [Society]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all societies retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: boolean
 *                   example: true
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
 *                         description: Unique identifier of the society.
 *                         example: "society-uuid-5678"
 *                       society_name:
 *                         type: string
 *                         description: Name of the society.
 *                         example: "Global Health Society"
 *                       country_code:
 *                         type: string
 *                         description: Country code of the society's location.
 *                         example: "US"
 *                       url:
 *                         type: string
 *                         description: Website URL of the society.
 *                         example: "https://www.globalhealthsociety.org"
 *                       image_url:
 *                         type: string
 *                         description: URL of the society's logo or representative image.
 *                         example: "https://www.globalhealthsociety.org/logo.png"
 *       502:
 *         description: Server error, unable to fetch the list of societies.
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
 *                   example: "Unable to retrieve societies due to a server error."
 */
router.post('/get_all_societies', auth(), societyValidator.getAllSocietiesValidator, societyController.getAllSocieties);

module.exports = router;