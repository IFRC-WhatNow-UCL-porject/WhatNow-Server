const express = require('express');
const RegionController = require('../controllers/RegionController');
const RegionValidator = require('../validator/RegionValidator');

const router = express.Router();
const auth = require('../middlewares/regionRouteAuth');

const regionController = new RegionController();
const regionValidator = new RegionValidator();

// region routes
/**
 * @swagger
 * /region/get_region:
 *   post:
 *     summary: Get region
 *     tags: [Region]
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
 *     responses:
 *       '200':
 *         description: Region fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
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
 *                       example: "Region fetched successfully"
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 4
 *                           uuid:
 *                             type: string
 *                             example: "330f4b79-4665-4b6b-9ead-f7f7623b3354"
 *                           region_name:
 *                             type: string
 *                             example: "Test Region"
 *                           society_id:
 *                             type: string
 *                             example: "0f21cd24-ad15-414f-8706-a433f2319c4a"
 *                           description:
 *                             type: string
 *                             example: "Test Region"
 *                           language_code:
 *                             type: string
 *                             example: "ZH"
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
router.post('/get_region', auth(), regionValidator.regionGetValidator, regionController.getRegion);

/**
 * @swagger
 * /region/add_region:
 *   post:
 *     summary: Add region
 *     tags: [Region]
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
 *               region_name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *               is_published:
 *                 type: boolean
 *                 required: true
 *     responses:
 *       '200':
 *         description: Region created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
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
 *                       example: "Region created successfully"
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 11
 *                         uuid:
 *                           type: string
 *                           example: "38d4eec4-b43a-491e-b93c-5df61d18437c"
 *                         region_name:
 *                           type: string
 *                           example: "Test region ZH"
 *                         society_id:
 *                           type: string
 *                           example: "0f21cd24-ad15-414f-8706-a433f2319c4a"
 *                         description:
 *                           type: string
 *                           example: "Chineses simplified region"
 *                         language_code:
 *                           type: string
 *                           example: "ZH"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-13T21:31:38.043Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-13T21:31:38.043Z"
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
 *                   example: "Language code not found"  
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
router.post('/add_region', auth(), regionValidator.regionAddValidator, regionController.addRegion);

/**
 * @swagger
 * /region/check_region:
 *   post:
 *     summary: Checks if a region exists or is unique before adding or updating it
 *     tags: [Region]
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
 *                 description: Unique identifier of the region (required for update action).
 *                 example: "region-uuid-1234"
 *               society_id:
 *                 type: string
 *                 description: Unique identifier of the society.
 *                 example: "society-uuid-5678"
 *               language_code:
 *                 type: string
 *                 description: Language code associated with the region.
 *                 example: "en"
 *               region_name:
 *                 type: string
 *                 description: Name of the region.
 *                 example: "Northern Region"
 *               action:
 *                 type: string
 *                 description: Action to perform (add or update).
 *                 enum: [add, update]
 *                 example: "add"
 *     responses:
 *       200:
 *         description: Region checked successfully. Proceed with add or update.
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
 *                   example: "Region checked successfully"
 *       400:
 *         description: Bad request, such as society not found, language code not found, or region already exists.
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
 *                   example: "Society not found" # Or "Language code not found", "Region already exist"
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
 *         description: Server error while checking the region.
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
 *                   example: "check region error"
 */
router.post('/check_region', auth(), regionValidator.regionCheckValidator, regionController.checkRegion);

/**
 * @swagger
 * /region/update_region:
 *   post:
 *     summary: Update region
 *     tags: [Region]
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
 *               region_name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: Region updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
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
 *                       example: "Region updated successfully"
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
router.post('/update_region', auth(), regionValidator.regionUpdateValidator, regionController.updateRegion);

/**
 * @swagger
 * /region/delete_region:
 *   post:
 *     summary: Delete region
 *     tags: [Region]
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
 *     responses:
 *       '200':
 *         description: Region deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
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
 *                       example: "Region deleted successfully"
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
 * 
 *                   example: 400
 *                 message:
 *                   type: string
 *                   description: error message
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
router.post('/delete_region', auth(), regionValidator.regionDeleteValidator, regionController.deleteRegion);

module.exports = router;