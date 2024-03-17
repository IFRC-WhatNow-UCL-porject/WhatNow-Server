const passport = require('passport');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const UserRoleService = require('../service/UserRoleService');
const UserService = require('../service/UserService');

const { permission } = require('../config/constant');

const config = require('../config/config');

const verifyCallback = (req, res, resolve, reject) => {
    return async (err, user, info) => {
        if (err || info || !user) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
        req.user = user;

        const userRoleService = new UserRoleService();
        const authorization = req.headers.authorization.split(' ');
        const user_id = jwt.verify(authorization[1], config.jwt.secret).sub;
        const result = await userRoleService.checkUserRole(user_id);
        const response = result.response;
        
        if (!response.status) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }

        const userRole = response.data.role_id;

        // if user role is wrong
        if (!permission.audit_log.includes(userRole)) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }

        // if all pass, record a log of last active
        const userService = new UserService();
        await userService.updateUserAvtiveTime(user_id);

        resolve();
    };
};

const auth = () => {
    return async (req, res, next) => {
        return new Promise((resolve, reject) => {
            passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, res, resolve, reject),
            )(req, res, next);
        })
            .then(() => {
                return next();
            })
            .catch((err) => {
                return next(err);
            });
    };
};

module.exports = auth;
