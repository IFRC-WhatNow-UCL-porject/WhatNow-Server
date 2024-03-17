const httpStatus = require('http-status');
const logger = require('../config/logger');

const ApiUserService = require('../service/ApiUserService');

class ApiUserController {
    constructor () {
        this.ApiUserService = new ApiUserService();
    }

    getAllApiUsers = async (req, res) => {
        try {
            const result = await this.ApiUserService.getApiUsers();
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getApiUserById = async (req, res) => {
        try {
            const result = await this.ApiUserService.getApiUserByUuid(req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    addApiUser = async (req, res) => {
        try {
            const result = await this.ApiUserService.createApiUser(req.body);
            const response = result.response;

            // const country_code = req.body.country_code;
            // const url = req.body.url;
            // const image_url = req.body.image_url;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateApiUser = async (req, res) => {
        try {
            const result = await this.ApiUserService.updateApiUser(req.body, req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    deleteApiUser = async (req, res) => {
        try {
            const result = await this.ApiUserService.deleteApiUser(req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

}

module.exports = ApiUserController;