const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');
const { language_code } = require('../config/constant');

const LanguageDao = require('../dao/LanguageDao');
const SocietyDao = require('../dao/SocietyDao');

class LanguageService {
    constructor () {
        this.languageDao = new LanguageDao();
        this.societyDao = new SocietyDao();
    }

    getLanguageBySocietyId = async (society_id) => {
        try {
            const language = await this.languageDao.getLanguage(society_id);
            return responseHandler.returnSuccess(httpStatus.OK, 'fetch language by society successfully', language);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'fetch language error');
        }
    }

    createLanguage = async (data) => {
        try {
            const society_id = data.society_id;
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            }
            const language_code_to_be_inserted = data.language_code;
            if (!Object.keys(language_code).includes(language_code_to_be_inserted)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not exist');
            }
            const checkLanguage = await this.languageDao.getLanguageByMultipulIds(society_id, language_code_to_be_inserted);
            if (checkLanguage) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language already exist');
            }
            data.uuid = uuidv4();
            const language = await this.languageDao.addLanguage(data);
            return responseHandler.returnSuccess(httpStatus.OK, 'create language successfully', language);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'create language error');
        }
    }

    updateLanguage = async (data) => {
        try {
            const uuid = data.uuid;
            const checkLanguage = await this.languageDao.getLanguageById(uuid);
            if (!checkLanguage) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language not exist');
            }
            const language = await this.languageDao.updateLanguageById(data, data.uuid);
            return responseHandler.returnSuccess(httpStatus.OK, 'update language successfully', language);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'update language error');
        }
    }
}

module.exports = LanguageService;