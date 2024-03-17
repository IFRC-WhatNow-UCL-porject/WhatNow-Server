const httpStatus = require('http-status');
const logger = require('../config/logger');

const {messageTypes} = require('../config/constant');

const SocietyService = require('../service/SocietyService');
const RegionService = require('../service/RegionService');
const LanguageService = require('../service/LanguageService');
const ContentService = require('../service/ContentService');
const MessageService = require('../service/MessageService');

class AppController {
    constructor () {
        this.societyService = new SocietyService();
        this.regionService = new RegionService();
        this.languageService = new LanguageService();
        this.contentService = new ContentService();
        this.messageService = new MessageService();
    }

    getSociety = async (countryCode) => {
        try {
            const result = await this.societyService.getSocietyByCountryCode(countryCode);
            const data = result.response.data;
            return data;
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getLanguage = async (societyId) => {
        try {
            const result = await this.languageService.getLanguageBySocietyId(societyId);
            const data = result.response.data;
            return data;
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getRegion = async (society_id, code) => {
        try {
            const result = await this.regionService.getRegionByMultipleIds(society_id, code);
            const data = result.response.data;
            return data;
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getContent = async (society_id) => {
        try {
            const result = await this.contentService.getContentBySocietyId(society_id);
            const data = result.response.data;
            return data;
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

    getContentMessages = async (society_id, region_id, language_code, content_type) => {
        try {
            const result = await this.messageService.getMessageByMultipleIds(society_id, region_id, language_code, content_type);
            var data = result.response.data;

            data = data.map(message => message.toJSON());
            var messages = {}
            for (let i = 0; i < Object.keys(messageTypes).length; i++) {
                const messageType = Object.keys(messageTypes)[i];
                const message = data.filter(message => message.type == messageType);
                messages[messageType] = [];
                for (let j = 0; j < message.length; j++) {
                    messages[messageType].push(message[j].content);
                }
            }

            return messages;
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    }

}

module.exports = AppController;