const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');
const AuditDao = require('../dao/AuditDao');
const UserDao = require('../dao/UserDao');
const SocietyDao = require('../dao/SocietyDao');

class AuditService {
    constructor() {
        this.auditDao = new AuditDao();
        this.userDao = new UserDao();
        this.societyDao = new SocietyDao();
    }

    async getAuditLog(reqBody) {
        try {
            const society_list = reqBody.society_ids;
            const auditLog = await this.auditDao.getAuditLog(society_list);
            for (let i = 0; i < auditLog.length; i++) {
                const uuid = auditLog[i].user_id;
                const user = await this.userDao.getUserById(uuid);
                auditLog[i].dataValues.user = user.first_name + ' ' + user.last_name;
                const society = await this.societyDao.getSocietyById(auditLog[i].society_id);
                auditLog[i].dataValues.society = society.society_name;
            }
            return responseHandler.returnSuccess(httpStatus.OK, "fetch audit-logs successfully!", auditLog);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'fetch audit-logs error');
        }
    }

    async createAuditLog(action, info) {
        try {
            const audit = {
                uuid: uuidv4(),
                action: action,
                society_id: info.society_id,
                user_id: info.user_id,
                language_code: info.language_code,
                content_type: info.content_type,
                time: new Date()
            }
            await this.auditDao.createAuditLog(audit);
            return responseHandler.returnSuccess(httpStatus.CREATED, "audit-log created successfully!");
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'create audit-log error');
        }
    }

    async deleteAuditLog(reqBody) {
        try {
            const society_list = reqBody.society_ids;
            const auditLog = await this.auditDao.deleteAuditLog(society_list);
            return responseHandler.returnSuccess(httpStatus.OK, "delete audit-logs successfully!", auditLog);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'error');
        }
    }
}

module.exports = AuditService;