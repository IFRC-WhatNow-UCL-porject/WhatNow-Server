const httpStatus = require('http-status');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');
const UserRoleDao = require('../dao/UserRoleDao');
const UserDao = require('../dao/UserDao');

class UserRoleService {
    constructor() {
        this.userRoleDao = new UserRoleDao();
        this.userDao = new UserDao();
    }

    checkUserRole = async (user_id) => {
        try {
            const userRole = await this.userRoleDao.checkUserRole(user_id);
            if (userRole == null) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Invalid User Role!');
            }
            const data = {
                role_id: userRole.dataValues.role_id,
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'user role checked', data);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'check user role error');
        }
    }

    setAuth = async (user_id, role_id) => {
        try {
            const user = await this.userDao.getUserById(user_id);
            if (user == null) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Invalid User!');
            }
            const userRole = await this.userRoleDao.createAuth(user_id, role_id);
            return responseHandler.returnSuccess(httpStatus.OK, 'auth set', userRole);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'set auth error');
        }
    }

    getUserRole = async () => {
        try {
            const userRole = await this.userRoleDao.findAll();
            return responseHandler.returnSuccess(httpStatus.OK, 'User Role', userRole);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get user role failed!');
        }
    }
}

module.exports = UserRoleService;