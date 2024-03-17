const express = require('express');
const AuditLogController = require('../controllers/AuditController');
const AuditLogValidator = require('../validator/AuditValidator');

const router = express.Router();
const auth = require('../middlewares/auditLogRouteAuth');

const auditLogController = new AuditLogController();
const auditLogValidator = new AuditLogValidator();

// audit log routes
router.post('/get_audit_log', auth(), auditLogValidator.auditLogGetValidator, auditLogController.getAuditLog);

module.exports = router;