const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const ApiUserDao = require('../dao/ApiUserDao');
const userDao = require('../dao/UserDao');
const userRoleDao = require('../dao/UserRoleDao');
const userSocietyDao = require('../dao/UserSocietyDao');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');
const { userConstant, userRoles } = require('../config/constant');

class ApiUserService {
    constructor() {
        this.apiUserDao = new ApiUserDao();
        this.userDao = new userDao();
        this.userRoleDao = new userRoleDao();
        this.userSocietyDao = new userSocietyDao();
    }

    createApiUser = async (apiUserBody) => {
        try {
            let message = 'Successfully Registered the account! Please Verify your email.';
            if (await this.userDao.isEmailExists(apiUserBody.email)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already taken');
            }
            const uuid = uuidv4();
            var splitedData = await this.splitData(apiUserBody, uuid, true);
            splitedData.user = {
                ...splitedData.user,
                password: bcrypt.hashSync(apiUserBody.password, 10),
            }
            console.log(splitedData);
            let userData = await this.userDao.create(splitedData.user);
            let userRoleData = await this.userRoleDao.create(splitedData.userRole);
            let userSocietyData = await this.userSocietyDao.create(splitedData.userSociety);
            let apiUserData = await this.apiUserDao.create(splitedData.apiUser);

            if (!userData || !userRoleData || !userSocietyData || !apiUserData) {
                message = 'Registration Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }

            apiUserData = userData.toJSON();
            delete apiUserData.password;

            return responseHandler.returnSuccess(httpStatus.CREATED, message, apiUserData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something went wrong!');
        }
    };


    isEmailExists = async (email) => {
        const message = 'Email found!';
        if (!(await this.userDao.isEmailExists(email))) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email not Found!!');
        }
        return responseHandler.returnSuccess(httpStatus.OK, message);
    };

    getApiUserByUuid = async (uuid) => {
        const userRole = await this.userRoleDao.findByWhere({ user_id: uuid, role_id: userRoles.API_USER});
        if (userRole.length === 0) {
            return {};
        }
        const user = await this.userDao.findOneByWhere({ uuid });
        const userSociety = await this.userSocietyDao.findOneByWhere({ user_id: uuid });
        const apiUser = await this.apiUserDao.findOneByWhere({ uuid });
        delete user.password;
        const mergedData = await this.mergeData(user, userRole, userSociety, apiUser);
        return responseHandler.returnSuccess(httpStatus.OK, 'API User found!', mergedData);
    };

    getApiUsers = async () => {
        const usersRole = await this.userRoleDao.findByWhere({ role_id: userRoles.API_USER });
        const mergedData = [];
        for (const userRole of usersRole) {
            const user = await this.userDao.findOneByWhere({ uuid: userRole.user_id });
            const userSociety = await this.userSocietyDao.findOneByWhere({ user_id: userRole.user_id });
            const apiUser = await this.apiUserDao.findOneByWhere({ uuid: userRole.user_id });
            delete user.password;
            mergedData.push(await this.mergeData(user, userRole, userSociety, apiUser));
        }
        return responseHandler.returnSuccess(httpStatus.OK, 'API Users found!', mergedData);
    }

    updateApiUser = async (data, uuid) => {
        let message = 'API User updated Successfully!';
        let statusCode = httpStatus.OK;
        let user = await this.userDao.findOneByWhere({ uuid });

        if (!user) {
            return responseHandler.returnError(httpStatus.NOT_FOUND, 'API User Not found!');
        }

        const splitedData = await this.splitData(data, uuid, false);
        splitedData.user = {
            ...splitedData.user,
            password: user.password,
        };
        const updateUser = await this.userDao.updateWhere(splitedData.user, { uuid });
        const updateUserRole = await this.userRoleDao.updateWhere(splitedData.userRole, { user_id: uuid });
        const updateUserSociety = await this.userSocietyDao.updateWhere(splitedData.userSociety, { user_id: uuid });
        const updateApiUser = await this.apiUserDao.updateWhere(splitedData.apiUser, { uuid });

        if (!updateUser) {
            message = 'API User Update Failed!';
            return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
        }
        delete updateUser.password;

        return responseHandler.returnSuccess(httpStatus.OK, message, this.mergeData(updateUser, updateUserRole, updateUserSociety, updateApiUser));
    };

    deleteApiUser = async (uuid) => {
        let message = 'API User deleted Successfully!';
        let statusCode = httpStatus.OK;
        const user = await this.userDao.findOneByWhere({ uuid });

        if (!user) {
            return responseHandler.returnError(httpStatus.NOT_FOUND, 'API User Not found!');
        }
        const deleteUser = await this.userDao.deleteByWhere({ uuid });
        const deleteUserRole = await this.userRoleDao.deleteByWhere({ user_id: uuid });
        const deleteUserSociety = await this.userSocietyDao.deleteByWhere({ user_id: uuid });
        const deleteApiUser = await this.apiUserDao.deleteByWhere({ uuid });

        if (!deleteUser || !deleteUserRole || !deleteApiUser) {
            message = 'API User Delete Failed!';
            return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
        }
        delete user.password;

        return responseHandler.returnSuccess(httpStatus.OK, message, user);
    }

    splitData = async (data, uuid, isCreate) => {
        let user = {
            uuid,
            email: data.email.toLowerCase(),
            first_name: data.first_name,
            last_name: data.last_name,
            status: userConstant.STATUS_ACTIVE,
            email_verified: isCreate ? userConstant.EMAIL_VERIFIED_FALSE : userConstant.EMAIL_VERIFIED_TRUE,
        };

        let userRole = {
            user_id: uuid,
            role_id: userRoles.API_USER,
        };

        let userSociety = {
            user_id: uuid,
            society_id: data.society_id,
        };

        let apiUser = {
            uuid,
            location: data.location,
            organization: data.organization,
            industry_type: data.industry_type,
            usage: data.usage,
        };

        return { user, userRole, userSociety, apiUser };
    }

    mergeData = async (user, userRole, userSociety, apiUser) => {
        return {
            id : user ? user.id : null,
            uuid: user ? user.uuid : null,
            email: user ? user.email : null,
            first_name: user ? user.first_name : null,
            last_name: user ? user.last_name : null,
            status: user ? user.status : null,
            email_verified: user ? user.email_verified : null,
            createAt : user ? user.createAt : null,
            updatedAt : user ? user.updatedAt : null,
            role_id: userRole ? userRole.role_id : null,
            society_id: userSociety ? userSociety.society_id : null,
            location: apiUser ? apiUser.location : null,
            organization: apiUser ? apiUser.organization : null,
            industry_type: apiUser ? apiUser.industry_type : null,
            usage: apiUser ? apiUser.usage : null,
        };
    };
}

module.exports = ApiUserService;