const express = require('express');
const AuditLogController = require('../controllers/AuditController');
const AuditLogValidator = require('../validator/AuditValidator');

const router = express.Router();
const auth = require('../middlewares/auditLogRouteAuth');

const auditLogController = new AuditLogController();
const auditLogValidator = new AuditLogValidator();

// audit log routes
/**
 * @swagger
 * /auditLog/get_audit_log:
 *   post:
 *     summary: Get audit logs
 *     tags: [AuditLog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               society_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 required: true
 *     responses:
 *       '200':
 *         description: Fetch audit logs successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "fetch audit-logs successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       uuid:
 *                         type: string
 *                         example: "38d4eec4-b43a-491e-b93c-5df61d18437c"
 *                       language_code:
 *                         type: string
 *                         example: "ZH"
 *                       content_type:
 *                         type: string
 *                         example: "contents"
 *                       action:
 *                         type: string
 *                         example: "create"
 *                       time:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-13T21:53:21.000Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-13T21:53:21.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-13T21:53:21.000Z"
 *                       user:
 *                         type: string
 *                         example: "Test first 3 Test last 3"
 *                       society:
 *                         type: string
 *                         example: "Test Society"
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
 *                   example: "society_ids must be an array of strings"
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
router.post('/get_audit_log', auth(), auditLogValidator.auditLogGetValidator, auditLogController.getAuditLog);

module.exports = router;