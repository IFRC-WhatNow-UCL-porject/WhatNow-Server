const httpStatus = require('http-status');
const AuthService = require('../service/AuthService');
const TokenService = require('../service/TokenService');
const UserService = require('../service/UserService');
const UserRoleService = require('../service/UserRoleService');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/tokens');
const { userConstant } = require('../config/constant');
const nodemailer = require('nodemailer');

class AuthController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
        this.userRoleService = new UserRoleService();
    }

    register = async (req, res) => {
        try {
            const result = await this.userService.createUser(req.body);
            const response = result.response;

            const status = response.status;
            const message = response.message;
            const code = response.code;

            res.status(code).send({ status, code, message });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    checkEmailExist = async (req, res) => {
        try {
            const result = await this.userService.checkEmailExist(req.body.email);
            const response = result.response;

            const status = response.status;
            const message = response.message;
            const code = response.code;

            res.status(code).send({ status, code, message });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result_log = await this.authService.loginWithEmailPassword(
                email.toLowerCase(),
                password,
            );
            const response_log = result_log.response;
            if (!response_log.status) {
                res.status(response_log.code).send(response_log);
            }

            const status = response_log.status;
            const message = response_log.message;
            const code = response_log.code;
            const data = response_log.data;

            let tokens = {};
            if (status) {
                tokens = await this.tokenService.generateAuthTokens(data, tokenTypes.ACCESS);
            }

            res.status(code).send({ status, code, message, data, tokens });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    checkLoginInfo = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.loginWithEmailPassword(
                email.toLowerCase(),
                password,
            );
            result.response.message = 'User login info is correct!';

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    logout = async (req, res) => {
        try {
            const { access_token } = req.body;
            const result = await this.authService.logout(access_token);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    profileChangePassword = async (req, res) => {
        try {
            const result = await this.userService.profileChangePassword(req.body.new_password, req.body.uuid);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    checkUserRole = async (req, res) => {
        try {
            const result = await this.userRoleService.checkUserRole(req.body.uuid);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    checkUserStatus = async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (token === 'null') {
                res.status(httpStatus.BAD_REQUEST).send({ message: 'Token not found' });
            } else {
                const result = await this.tokenService.verifyToken(token, tokenTypes.ACCESS);
                res.status(result.statusCode).send(result.response);
            }
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    setUserTermsVersion = async (req, res) => {
        try {
            const version = req.body.terms_version;
            const uuid = req.body.uuid;
            const result = await this.userService.setUserTermsVersion(version, uuid);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getProfile = async (req, res) => {
        try {
            const result = await this.userService.getUserProfile(req.body.uuid);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    profileUpdate = async (req, res) => {
        try {
            const result = await this.userService.profileUpdate(req.body);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    oauthCheckEmailExist = async (req, res) => {
        try {
            const result = await this.userService.oauthCheckEmailExist(req.body.email);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    sendActivationEmail = async (req, res) => {
        try {
            const result = await this.userService.getUserByEmail(req.body.email);
            if (!result.response.status) {
                return res.status(result.response.code).send(result.response);
            }
            const data = result.response.data;
            const tokens = await this.tokenService.generateAuthTokens(data, tokenTypes.VERIFY_EMAIL);
            await this.userService.updateUserByEmail({ email_verified: userConstant.EMAIL_VERIFIED_FALSE }, req.body.email);

            const token = tokens.token;

            const transporter = nodemailer.createTransport(
                {
                    service: process.env.SERVICE || "Gmail",
                    host: process.env.SMTP_HOST || "smtp.gmail.com",
                    port: process.env.SMTP_PORT || 465,
                    secure: process.env.SMTP_SECURE || true,
                    auth: {
                      user: process.env.SMTP_USER,
                      pass: process.env.SMTP_PASS,
                    },
                }
            );

            transporter.sendMail({
                from: process.env.SMTP_USER,
                to: req.body.email,
                subject: 'WhatNow? - Activate your account!',
                text: `Click link to activate: https://whatnow-preparecenter.azurewebsites.net/activate/?tokenAct=${token}`,
            }).then(result => {
                console.log(`success, id ${result.messageId}`);
                res.status(httpStatus.OK).send({ status: true, code: httpStatus.OK, message: 'Activation email sent successfully!' });
            }).catch(error => {
                console.log(error);
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    sendResetPasswordEmail = async (req, res) => {
        try {
            const result = await this.userService.getUserByEmail(req.body.email);
            if (!result.response.status) {
                return res.status(result.response.code).send(result.response);
            }
            const data = result.response.data;
            const tokens = await this.tokenService.generateAuthTokens(data, tokenTypes.RESET_PASSWORD);
            await this.userService.updateUserByEmail({ email_verified: userConstant.EMAIL_VERIFIED_FALSE }, req.body.email);

            const token = tokens.token;

            const transporter = nodemailer.createTransport(
                {
                    service: process.env.SERVICE || "Gmail",
                    host: process.env.SMTP_HOST || "smtp.gmail.com",
                    port: process.env.SMTP_PORT || 465,
                    secure: process.env.SMTP_SECURE || true,
                    auth: {
                      user: process.env.SMTP_USER,
                      pass: process.env.SMTP_PASS,
                    },
                }
            );

            transporter.sendMail({
                from: process.env.SMTP_USER,
                to: req.body.email,
                subject: 'WhatNow? - Reset your password!',
                text: `Click link to activate: https://whatnow-preparecenter.azurewebsites.net/reset/?tokenPass=${token}`,
            }).then(result => {
                console.log(`success, id ${result.messageId}`);
                res.status(httpStatus.OK).send({ status: true, code: httpStatus.OK, message: 'Reset password email sent successfully!' });
            }).catch(error => {
                console.log(error);
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    changeStatus = async (req, res) => {
        try {
            const result = await this.userService.changeStatus(req.body.uuid, req.body.status);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    createProfile = async (req, res) => {
        try {
            const result = await this.userService.createProfile(req.body);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    checkEmailToken = async (req, res) => {
        try {
            const result = await this.tokenService.verifyToken(req.body.token, req.body.type);
            const response = result.response;
            if (!response.status) {
                res.status(response.code).send(response);
            } else {
                const resToken = await this.tokenService.getUserIdFromToken(req.body.token, req.body.type);
                const resData = await this.userService.updateUserById({ email_verified: userConstant.EMAIL_VERIFIED_TRUE }, resToken.response.data.user_uuid);
                res.status(resData.statusCode).send(resData.response);
            }
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    resetPassword = async (req, res) => {
        try {
            const result = await this.userService.resetPassword(req.body.token, req.body.password);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    updateTermAgree = async (req, res) => {
        try {
            const result = await this.userService.updateTermAgree(req.body.uuid);

            res.status(result.statusCode).send(result.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }
}

module.exports = AuthController;
