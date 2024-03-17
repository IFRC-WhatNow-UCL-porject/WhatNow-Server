const httpStatus = require('http-status');
const UserRoleService = require('../service/UserRoleService');
const logger = require('../config/logger');

class userRoleController {
    constructor() {
        this.userRoleService = new UserRoleService();
    }

    setAuth = async (req, res, next) => {
        try {
            const { user_id } = req.body;
            const { role_id } = req.body;
            const result = await this.userRoleService.setAuth(user_id, role_id);

            res.status(result.statusCode).send(result.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getUserRole = async (req, res, next) => {
        try {
            const { user_id } = req.body;
            const result = await this.userRoleService.checkUserRole(user_id);

            res.status(result.statusCode).send(result.response);
        } catch (error) {
            logger.error(error);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }
}

module.exports = userRoleController;