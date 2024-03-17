const httpStatus = require('http-status');
const AuditService = require('../service/AuditService');
const logger = require('../config/logger');

class AuditController {
    constructor() {
        this.auditService = new AuditService();
    }

    getAuditLog = async (req, res) => {
        try {
            const result = await this.auditService.getAuditLog(req.body);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    deleteAuditLog = async (req, res) => {
        try {
            const auditLog = await this.auditService.deleteAuditLog(req.body);
            const { message } = auditLog.response;
            const { data } = auditLog.response;
            const { status } = auditLog.response;
            const code = auditLog.statusCode;
            res.status(auditLog.statusCode).send({ status, code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = AuditController;