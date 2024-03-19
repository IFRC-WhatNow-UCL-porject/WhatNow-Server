const express = require('express');
const ApiController = require('../controllers/ApiController');
const ApiValidator = require('../validator/ApiValidator');

const router = express.Router();
const auth = require('../middlewares/apiRouteAuth');

const apiController = new ApiController();
const apiValidator = new ApiValidator();


// api routes
/**
 * @swagger
 * /apps/get_apis:
 *   post:
 *     summary: Get all APIs
 *     tags: [ApiUsage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the API.
 *                     example: 2
 *                   uuid:
 *                     type: string
 *                     description: The UUID of the API.
 *                     example: "739e0391-2c1b-498e-a5d9-7426712dc09d"
 *                   user_name:
 *                     type: string
 *                     description: The user name associated with the API.
 *                     example: "Test first 2 Api user 2"
 *                   name:
 *                     type: string
 *                     description: The name of the API.
 *                     example: "Test API 2"
 *                   description:
 *                     type: string
 *                     description: The description of the API.
 *                     example: "test api 2"
 *                   reach:
 *                     type: integer
 *                     description: The reach of the API.
 *                     example: 10
 *                   hits:
 *                     type: integer
 *                     description: The number of hits of the API.
 *                     example: 0
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the API was created.
 *                     example: "2024-03-12T01:06:54.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the API was last updated.
 *                     example: "2024-03-12T01:06:54.000Z"
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
 */
router.post('/get_apis', auth(), apiController.getAllApis);

/**
 * @swagger
 * /apps/get_api_by_id:
 *   post:
 *     summary: Get API by ID
 *     tags: [ApiUsage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: UUID of the API to retrieve
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: UUID of the API to retrieve
 *                 example: "87bc0526-8bdf-476b-b192-03b0411e42cb"
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 4
 *                 uuid:
 *                   type: string
 *                   example: "87bc0526-8bdf-476b-b192-03b0411e42cb"
 *                 user_name:
 *                   type: string
 *                   example: "Test first 3 Test last 3"
 *                 name:
 *                   type: string
 *                   example: "Test api 2"
 *                 description:
 *                   type: string
 *                   example: null
 *                 reach:
 *                   type: string
 *                   example: null
 *                 hits:
 *                   type: integer
 *                   example: 0
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-13T11:48:51.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-13T11:48:51.000Z"
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
 *                   example: "\"email\" is required"
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
 *                   description: A brief message explaining the error.
 *                   example: "Something went wrong"
 */
router.post('/get_api_by_id', auth(), apiValidator.getApiByIdValidator, apiController.getApiById);

/**
 * @swagger
 * /apps/add_api:
 *   post:
 *     summary: Add a new API
 *     tags: [ApiUsage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: API data to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The UUID of the user who owns the API (required)
 *               name:
 *                 type: string
 *                 description: The name of the API
 *               description:
 *                 type: string
 *                 description: Description of the API
 *               reach:
 *                 type: string
 *                 description: Reach of the API
 *     responses:
 *       '200':
 *         description: API added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 uuid:
 *                   type: string
 *                   example: "20733298-6473-44c8-9cc7-5bd52ec73711"
 *                 hits:
 *                   type: integer
 *                   example: 0
 *                 user_id:
 *                   type: string
 *                   example: "aa862a68-a243-4d67-be46-74615bebbe84"
 *                 name:
 *                   type: string
 *                   example: "Test api"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-13T11:46:57.197Z"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-13T11:46:57.197Z"
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
 *                   example: "\"email\" is required"
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
 *                   description: A brief message explaining the error.
 *                   example: "Something went wrong"
 */
router.post('/add_api', auth(), apiValidator.addApiValidator, apiController.addApi);

/**
 * @swagger
 * /apps/update_api:
 *   post:
 *     summary: Update an existing API
 *     tags: [ApiUsage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: API data to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The UUID of the user who owns the API (required)
 *               name:
 *                 type: string
 *                 description: The name of the API
 *               description:
 *                 type: string
 *                 description: Description of the API
 *               reach:
 *                 type: string
 *                 description: Reach of the API
 *               uuid:
 *                 type: string
 *                 description: UUID of the API to be updated (required)
 *     responses:
 *       '200':
 *         description: API updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: integer
 *                description: the id of updated api
 *                example: 1
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
 *                   description: A brief message explaining the error.
 *                   example: "Something went wrong"
 */
router.post('/update_api', auth(), apiValidator.updateApiValidator, apiController.updateApi);

/**
 * @swagger
 * /apps/delete_api:
 *   post:
 *     summary: Update an existing API
 *     tags: [ApiUsage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: API data to be deleted
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *                 description: UUID of the API to be updated (required)
 *     responses:
 *       '200':
 *         description: API updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               description: the id of updated api
 *               example: 1
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
 *                   description: A brief message explaining the error.
 *                   example: "Something went wrong"
 */
router.post('/delete_api', auth(), apiValidator.deleteApiValidator, apiController.deleteApi);

module.exports = router;