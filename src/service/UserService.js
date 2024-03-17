const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const UserDao = require('../dao/UserDao');
const UserRoleDao = require('../dao/UserRoleDao');
const ApiUserDao = require('../dao/ApiUserDao');
const UserSocietyDao = require('../dao/UserSocietyDao');
const TokenService = require('../service/TokenService');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');
const { userConstant, userRoles } = require('../config/constant');
const { tokenTypes } = require('../config/tokens');


class UserService {
    constructor() {
        this.userDao = new UserDao();
        this.userRoleDao = new UserRoleDao();
        this.apiUserDao = new ApiUserDao();
        this.tokenService = new TokenService();
        this.userSocietyDao = new UserSocietyDao();
    }

    createUser = async (userBody) => {
        try {
            let message = 'Successfully Registered the account! Please Verify your email.';
            if (await this.userDao.isEmailExists(userBody.email)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already taken');
            }
            const uuid = uuidv4();
            userBody.email = userBody.email.toLowerCase();
            userBody.password = bcrypt.hashSync(userBody.password, 10);
            userBody.uuid = uuid;
            userBody.status = userConstant.STATUS_ACTIVE;
            userBody.email_verified = userConstant.EMAIL_VERIFIED_FALSE;

            let userData = await this.userDao.create(userBody);

            if (!userData) {
                message = 'Registration Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }
          
            userData = userData.toJSON();
            delete userData.password;

            const userRole = {
                user_id: userBody.uuid,
                role_id: userBody.user_role || userRoles.API_USER,
            };
            await this.userRoleDao.create(userRole);

            return responseHandler.returnSuccess(httpStatus.CREATED, message, userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'create user failed!');
        }
    };

    checkEmailExist = async (email) => {
        try {
            if (await this.userDao.isEmailExists(email)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already taken');
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Email is available');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'check email exist failed!');
        }
    };

    createProfile = async (userBody) => {
        try {
            let message = 'Profile Created Successfully!';
            const uuid = uuidv4();
            const profile = {
                uuid: uuid,
                email: userBody.email.toLowerCase(),
                first_name: userBody.first_name,
                last_name: userBody.last_name,
                status: userConstant.STATUS_ACTIVE,
                email_verified: userConstant.EMAIL_VERIFIED_FALSE,
            }
            const user = await this.userDao.create(profile);
            if (!user) {
                message = 'Registration Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            };

            const userRole = {
                user_id: uuid,
                role_id: userBody.user_role,
            };
            await this.userRoleDao.create(userRole);
            if (userBody.society) {
                for (let i = 0; i < userBody.society.length; i++) {
                    const data = {
                        user_id: uuid,
                        society_id: userBody.society[i],
                    };
                    await this.userSocietyDao.create(data);
                }
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Profile Creation Success!');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'create profile failed!');
        }
    };


    isEmailExists = async (email) => {
        const message = 'Email found!';
        if (!(await this.userDao.isEmailExists(email))) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email not Found!!');
        }
        return responseHandler.returnSuccess(httpStatus.OK, message);
    };

    updateUserAvtiveTime = async (uuid) => {
        return this.userDao.updateWhere({ last_active: new Date() }, { uuid });
    };

    profileChangePassword = async (password, uuid) => {
        let message = 'Login Successful';
        let statusCode = httpStatus.OK;
        let user = await this.userDao.findOneByWhere({ uuid });

        if (!user) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User Not found!');
        }

        const updateUser = await this.userDao.updateWhere(
            { password: bcrypt.hashSync(password, 10) },
            { uuid },
        );

        if (updateUser) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Password updated Successfully!',
                {},
            );
        }

        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Password Update Failed!');
    };

    setUserTermsVersion = async (terms_version, user_id) => {
        try {
            const updateUser = await this.userDao.updateWhere({ terms_version }, { uuid: user_id });
            if (updateUser) {
                return responseHandler.returnSuccess(
                    httpStatus.OK,
                    'Terms version updated Successfully!',
                    {},
                );
            }
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Terms version Update Failed!');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'set user terms version failed!');
        }
    }

    getUserProfile = async (uuid) => {
        try {
            var user = await this.userDao.findOneByWhere({ uuid });
            if (!user) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User Not found!');
            }
            user = user.toJSON();
            delete user.password;
            return responseHandler.returnSuccess(httpStatus.OK, 'User Profile', user);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get user profile failed!');
        }
    }

    profileUpdate = async (userBody) => {
        try {
            const updateUser = await this.userDao.updateWhere(userBody, { uuid: userBody.uuid });
            if (updateUser) {
                if (userBody.user_role) {
                    const data = {
                        user_id: userBody.uuid,
                        role_id: userBody.user_role,
                    };
                    await this.userRoleDao.updateByWhere({ user_id: data.user_id }, data);
                };
                if (userBody.society) {
                    await this.userSocietyDao.deleteByWhere({ user_id: userBody.uuid });
                    for (let i = 0; i < userBody.society.length; i++) {
                        const data = {
                            user_id: userBody.uuid,
                            society_id: userBody.society[i],
                        };
                        await this.userSocietyDao.create(data);
                    }
                }
                return responseHandler.returnSuccess(httpStatus.OK, 'Profile updated Successfully!', {});
            }
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Profile Update Failed!');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'profile update failed!');
        }
    }

    oauthCheckEmailExist = async (email) => {
        try {
            if (await this.userDao.isEmailExists(email)) {
                const data = await this.userDao.findByEmail(email);
                if (data.status === userConstant.STATUS_INACTIVE) {
                    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User is Inactive!');
                }
                if (data.email_verified === userConstant.EMAIL_VERIFIED_FALSE) {
                    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email not verified!');
                }
                const tokens = await this.tokenService.generateAuthTokens(data, tokenTypes.ACCESS);
                return responseHandler.returnSuccess(httpStatus.OK, 'Email is found!', { exist: true, data, tokens});
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Email not found!', { exist: false });
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'check email exist failed!');
        }
    }

    getUsers = async () => {
        try {
            var users = await this.userDao.findAll();
            var usersSelected = [];
            var apiUsers = await this.userRoleDao.findByWhere({ role_id: userRoles.API_USER });
            var append = true;
            for (let i = 0; i < users.length; i++) {
                append = true;
                for (let j = 0; j < apiUsers.length; j++) {
                    if (users[i].uuid === apiUsers[j].user_id) {
                        append = false;
                        break;
                    }
                }
                if (append) {
                    var temp = users[i].toJSON();
                    delete temp.password;
                    usersSelected.push(temp);
                }
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'All Users', usersSelected);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get users failed!');
        }
    }

    getUserSociety = async () => {
        try {
            const userSociety = await this.userSocietyDao.findAll();
            return responseHandler.returnSuccess(httpStatus.OK, 'User Society', userSociety);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get user society failed!');
        }
    }

    updateUserByEmail = async (data, email) => {
        try {
            const updateUser = await this.userDao.updateWhere(data, { email });
            if (updateUser) {
                return responseHandler.returnSuccess(httpStatus.OK, 'User updated Successfully!', {});
            }
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User Update Failed!');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'update user by email failed!');
        }
    }

    updateUserById = async (data, uuid) => {
        try {
            const updateUser = await this.userDao.updateWhere(data, { uuid });
            if (updateUser) {
                return responseHandler.returnSuccess(httpStatus.OK, 'User updated Successfully!', {});
            }
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User Update Failed!');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'update user by id failed!');
        }
    }

    getUserByEmail = async (email) => {
        try {
            const user = await this.userDao.findByEmail(email);
            if (!user) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User Not found!');
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'User Found', user);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get user by email failed!');
        }
    }

    changeStatus = async (uuid, status) => {
        try {
            const updateUser = await this.userDao.updateWhere({ status }, { uuid });
            if (updateUser) {
                return responseHandler.returnSuccess(httpStatus.OK, 'User status updated Successfully!', {});
            }
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User status Update Failed!');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'change status failed!');
        }
    }

    resetPassword = async (token, password) => {
        try {
            const data = await this.toeknDao.findOneByWhere({ token: token });
            if (!data) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Invalid Token!');
            }
            const user = await this.userDao.findOneByWhere({ uuid: data.user_uuid });
            if (!user) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User Not found!');
            }
            const updateUser = await this.userDao.updateWhere(
                { password: bcrypt.hashSync(password, 10) },
                { uuid: user.uuid },
            );
            if (updateUser) {
                return responseHandler.returnSuccess(
                    httpStatus.OK,
                    'Password updated Successfully!',
                    {},
                );
            }
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Password Update Failed!');
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'reset password failed!');
        }
    }
}

module.exports = UserService;
