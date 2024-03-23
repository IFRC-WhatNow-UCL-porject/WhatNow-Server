const jwt = require('jsonwebtoken');
const moment = require('moment');
const { Op } = require('sequelize');
const config = require('../config/config');
const TokenDao = require('../dao/TokenDao');
const UserDao = require('../dao/UserDao');
const responseHandler = require('../utils/responseHandler');
const httpStatus = require('http-status');
const logger = require('../config/logger');

class TokenService {
    constructor() {
        this.tokenDao = new TokenDao();
        this.userDao = new UserDao();
    }

    generateToken = (uuid, expires, type, secret = config.jwt.secret) => {
        const payload = {
            sub: uuid,
            iat: moment().unix(),
            exp: expires.unix(),
            type,
        };
        return jwt.sign(payload, secret);
    };

    verifyToken = async (token, type) => {
        try {
            let payload;
            try {
                payload = jwt.verify(token, config.jwt.secret);
            } catch (err) {
                // logger.error(err);
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'token not found');
            }
    
            console.log('payload', payload);
            const tokenDoc = await this.tokenDao.findOne({
                token,
                type,
                user_uuid: payload.sub,
                blacklisted: false,
            });
            if (!tokenDoc) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'token not found');
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'token verified', { isLoggedIn: true });
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'token verify failed');
        }
    };

    saveMultipleTokens = async (tokens) => {
        return this.tokenDao.bulkCreate(tokens);
    };

    generateAuthTokens = async (user, tokenType) => {
        const tokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
        const token = await this.generateToken(
            user.uuid,
            tokenExpires,
            tokenType,
        );
        const authTokens = [];
        authTokens.push({
            token: token,
            user_uuid: user.uuid,
            expires: tokenExpires.toDate(),
            type: tokenType,
            blacklisted: false,
        });

        await this.saveMultipleTokens(authTokens);
        const expiredAccessTokenWhere = {
            expires: {
                [Op.lt]: moment(),
            },
            type: tokenType,
        };
        await this.tokenDao.remove(expiredAccessTokenWhere);
        const tokens = {
            token: token,
            expires: tokenExpires.toDate(),
        };

        return tokens;
    };

    cleanExpiredTokens = async () => {
        const expiredAccessTokenWhere = {
            expires: {
                [Op.lt]: moment(),
            },
        };
        await this.tokenDao.remove(expiredAccessTokenWhere);
    };

    getUserIdFromToken = async (token, tokenType) => {
        const tokenDoc = await this.tokenDao.findOne({
            token,
            type: tokenType,
            blacklisted: false,
        });
        if (!tokenDoc) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'token not found');
        }
        return responseHandler.returnSuccess(httpStatus.OK, 'token verified', { user_uuid: tokenDoc.user_uuid });
    }
}

module.exports = TokenService;
