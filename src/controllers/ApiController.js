const httpStatus = require('http-status');
const logger = require('../config/logger');

const ApiService = require('../service/ApiService');

class ApiController {
    constructor () {
        this.apiService = new ApiService();
    }

    getAllApis = async (req, res) => {
        try {
            const result = await this.apiService.getApis();
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getApiById = async (req, res) => {
        try {
            const result = await this.apiService.getApiById(req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    addApi = async (req, res) => {
        try {
            const result = await this.apiService.createApi(req.body);
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

    updateApi = async (req, res) => {
        try {
            const result = await this.apiService.updateApi(req.body, req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    deleteApi = async (req, res) => {
        try {
            const result = await this.apiService.deleteApi(req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getApisByUserId = async (req, res) => {
        try {
            const result = await this.apiService.getApisByUserId(req.body.user_id);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = ApiController;