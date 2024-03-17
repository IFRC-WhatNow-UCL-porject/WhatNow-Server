const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const UserDao = require('../dao/UserDao');
const TokenDao = require('../dao/TokenDao');
const { tokenTypes } = require('../config/tokens');
const { userConstant } = require('../config/constant');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');

class AuthService {
    constructor() {
        this.userDao = new UserDao();
        this.tokenDao = new TokenDao();
    }

    loginWithEmailPassword = async (email, password) => {
        try {
            let message = 'Login Successful';
            let statusCode = httpStatus.OK;
            let user = await this.userDao.findByEmail(email);
            if (user == null) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'Invalid Email Address!',
                );
            }
            if (user.status !== userConstant.STATUS_ACTIVE) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'User is not active!',
                );
            }
            if (user.email_verified !== userConstant.EMAIL_VERIFIED_TRUE) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    'Email is not verified!',
                );
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            user = user.toJSON();
            delete user.password;

            if (!isPasswordValid) {
                statusCode = httpStatus.BAD_REQUEST;
                message = 'Wrong Password!';
                return responseHandler.returnError(statusCode, message);
            }

            return responseHandler.returnSuccess(statusCode, message, { email: email, uuid: user.uuid });
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Login Error');
        }
    };

    logout = async (access_token) => {
        try {
            await this.tokenDao.remove({
                token: access_token,
                type: tokenTypes.ACCESS,
                blacklisted: false,
            });

            return responseHandler.returnSuccess(httpStatus.OK, "logout successfully", { toekn: access_token });
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Logout Error');
        }
    };
}

module.exports = AuthService;
