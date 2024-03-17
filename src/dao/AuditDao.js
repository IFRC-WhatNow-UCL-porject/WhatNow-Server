const SuperDao = require('./SuperDao');
const models = require('../models');

const Audit = models.audit;

class AuditDao extends SuperDao {
    constructor() {
        super(Audit);
    }

    findAll = async () => {
        try {
            return await this.Model.findAll();
        } catch (error) {
            throw error;
        }
    }

    getAuditLog = async (society_list) => {
        try {
            const audit_logs = await this.Model.findAll({
                where: {
                    society_id: society_list
                }
            });
            return audit_logs;
        } catch (error) {
            throw error;
        }
    }

    createAuditLog = async (audit) => {
        try {
            const result = await this.Model.create(audit);
            return result;
        } catch (error) {
            throw error;
        }
    }

    deleteAuditLog = async (society_list) => {
        return await this.Model.destroy({
            where: {
                society_id: society_list
            }
        });
    }

}

module.exports = AuditDao;