const httpStatus = require('http-status');
const MessageDao = require('../dao/MessageDao');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');


class MessageService {
    constructor() {
        this.messageDao = new MessageDao();
    }

    getAllMessages = async () => {
        try {
            const messages = await this.messageDao.findAll();
            return responseHandler.returnSuccess(httpStatus.OK, 'fetch messages successfully', messages);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get all messages error');
        }
    }

    getMessageByMultipleIds = async (society_id, region_id, language_code, content_type) => {
        try {
            const messages = await this.messageDao.findByWhere({ society_id: society_id, region_id: region_id, content_type: content_type, language_code: language_code });
            return responseHandler.returnSuccess(httpStatus.OK, 'fetch messages successfully', messages);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get message error');
        }
    }

    addMessage = async (society_id, region_id, language_code, content_type, type, content) => {
        try {
            const uuid = uuidv4();
            const message = await this.messageDao.create({ uuid, society_id: society_id, region_id: region_id, language_code: language_code, content_type: content_type, type, content });
            return responseHandler.returnSuccess(httpStatus.OK, 'Message Added', message);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'add message error');
        }
    }

    deleteAllMessage = async (society_id, region_id, content_type, language_code) => {
        try {
            const message = await this.messageDao.deleteByMultipleIds({ society_id: society_id, region_id: region_id, content_type: content_type, language_code: language_code });
            return responseHandler.returnSuccess(httpStatus.OK, 'Message Deleted', message);
        } catch (e) {
            logger.error(e);
            console.log(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'delete message error');
        }
    }
}

module.exports = MessageService;