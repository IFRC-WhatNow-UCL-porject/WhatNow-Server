const httpStatus = require('http-status');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');
const UserSocietyDao = require('../dao/UserSocietyDao');

class UserSocietyService {
    constructor() {
        this.userSocietyDao = new UserSocietyDao();
    }


    async createUserSociety(userSocietyBody) {
        try {
            const userSociety = await this.userSocietyDao.createUserSociety(userSocietyBody);
            return responseHandler.returnSuccess(httpStatus.CREATED, 'UserSociety created successfully', userSociety);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'create userSociety error');
        }
    }


    async getAllUserSocieties() {
        try {
            const userSocieties = await this.userSocietyDao.getAllUserSocieties();
            return responseHandler.returnSuccess(httpStatus.OK, 'UserSocieties fetched successfully', userSocieties);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get all userSocieties error');
        }
    }


    async getUserSocietyByUserId(userId) {
        try {
            const userSocieties = await this.userSocietyDao.getUserSocietyByUserId(userId);
            return responseHandler.returnSuccess(httpStatus.OK, 'UserSocieties fetched successfully', userSocieties.map(userSociety => userSociety.toJSON()));
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get userSocieties error');
        }
    }


    async updateUserSocietyById(id, userSocietyBody) {
        try {
            const userSociety = await this.userSocietyDao.updateUserSocietyById(id, userSocietyBody);
            return responseHandler.returnSuccess(httpStatus.OK, 'UserSociety updated successfully', userSociety);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'update userSociety error');
        }
    }

    async deleteUserSocietyById(id) {
        try {
            const userSociety = await this.userSocietyDao.deleteUserSocietyById(id);
            return responseHandler.returnSuccess(httpStatus.OK, 'UserSociety deleted successfully', userSociety);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'delete userSociety error');
        }
    }
}

module.exports = UserSocietyService;