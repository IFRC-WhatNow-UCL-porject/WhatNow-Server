const httpStatus = require('http-status');
const AuthService = require('../service/AuthService');
const TokenService = require('../service/TokenService');
const UserService = require('../service/UserService');
const UserRoleService = require('../service/UserRoleService');
const logger = require('../config/logger');

class UserController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
        this.userRoleService = new UserRoleService();
    }

    getAllUsers = async (req, res) => {
        try {
            const result = await this.userService.getUsers();
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getUserRole = async (req, res) => {
        try {
            const result = await this.userRoleService.getUserRole();
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getUserSociety = async (req, res) => {
        try {
            const result = await this.userService.getUserSociety();
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

}

module.exports = UserController;
