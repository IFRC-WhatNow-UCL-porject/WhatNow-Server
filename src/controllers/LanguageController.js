const httpStatus = require('http-status');
const logger = require('../config/logger');

const LanguageService = require('../service/LanguageService');

class LanguageController {
    constructor() {
        this.languageService = new LanguageService();
    }

    getLanguage = async (req, res) => {
        try {
            const result = await this.languageService.getLanguageBySocietyId(req.body.society_id);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    addLanguage = async (req, res) => {
        try {
            const result = await this.languageService.createLanguage(req.body);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    updateLanguage = async (req, res) => {
        try {
            const result = await this.languageService.updateLanguage(req.body);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }
}

module.exports = LanguageController;