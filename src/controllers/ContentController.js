const httpStatus = require('http-status');
const ContentService = require('../service/ContentService');
const MessageService = require('../service/MessageService');
const AuditService = require('../service/AuditService');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');

const { messageTypes, contentTypes } = require('../config/constant');
const config = require('../config/config');

class ContentController {
    constructor() {
        this.contentService = new ContentService();
        this.messageService = new MessageService();
        this.auditService = new AuditService();
    }

    getContent = async (req, res) => {
        try {
            const result = await this.contentService.getContentBySocietyId(req.body.society_id);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    addContent = async (req, res) => {
        try {
            const result_create_content = await this.contentService.createContent(req.body);
            const response_create_content = result_create_content.response;
            if (!response_create_content.status) {
                return res.status(response_create_content.code).send(response_create_content);
            }

            const messages = req.body.messages;
            const types = Object.keys(messages);
            const society_id = req.body.society_id;
            const region_id = req.body.region_id;
            const content_type = req.body.content_type;
            const language_code = req.body.language_code;
            for (let i = 0; i < types.length; i++) {
                const type = types[i];
                if (!Object.keys(messageTypes).includes(type)) {
                    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Message type not exist' });
                }
                const message = messages[type];
                for (let j = 0; j < message.length; j++) {
                    const content = message[j];
                    const result_add_message = await this.messageService.addMessage(society_id, region_id, language_code, content_type, type, content);
                    const response_add_message = result_add_message.response;
                    if (!response_add_message.status) {
                        return res.status(response_add_message.code).send(response_add_message);
                    }
                }
            }

            const authorization = req.headers.authorization.split(' ');
            const user_id = jwt.verify(authorization[1], config.jwt.secret).sub;
            const result_create_audit = await this.auditService.createAuditLog('CREATE', { society_id, user_id, language_code, content_type });
            const response_create_audit = result_create_audit.response;
            if (!response_create_audit.status) {
                return res.status(response_create_audit.code).send(response_create_audit);
            }
            
            return res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: 'Content added successfully', status: true, data: {} });
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    updateContent = async (req, res) => {
        try {
            const result = await this.contentService.updateContentById(req.body, req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    deleteContent = async (req, res) => {
        try {
            const result_get_content = await this.contentService.getContentById(req.body.uuid);
            const response_get_content = result_get_content.response
            if (!response_get_content.status) {
                return res.status(response_get_content.code).send(response_get_content);
            }

            const response_data = response_get_content.data;

            const society_id = response_data.society_id;
            const region_id = response_data.region_id;
            const content_type = response_data.content_type;
            const language_code = response_data.language_code;

            const result_delete_messages = await this.messageService.deleteAllMessage(society_id, region_id, content_type, language_code);
            const response_delete_messages = result_delete_messages.response;
            if (!response_delete_messages.status) {
                return res.status(response_delete_messages.code).send(response_delete_messages);
            }
            const result_delete_content = await this.contentService.deleteContentById(req.body.uuid);
            const response_delete_content = result_delete_content.response;
            if (!response_delete_content.status) {
                return res.status(response_delete_content.code).send(response_delete_content);
            }

            const authorization = req.headers.authorization.split(' ');
            const user_id = jwt.verify(authorization[1], config.jwt.secret).sub;
            const result_create_audit = await this.auditService.createAuditLog('DELETE', { society_id, user_id, language_code, content_type });
            const response_create_audit = result_create_audit.response;
            if (!response_create_audit.status) {
                return res.status(response_create_audit.code).send(response_create_audit);
            }
            
            return res.status(httpStatus.OK).send({ code: httpStatus.OK, message: 'Content deleted successfully', status: true, data: {} });
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    getContentType = async (req, res) => {
        try {
            const society_id = req.body.society_id;
            const language_code = req.body.language_code;
            const region_id = req.body.region_id;
            const result = await this.contentService.getContentType(society_id, language_code, region_id);

            res.status(result.statusCode).send(result.response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    getContentById = async (req, res) => {
        try {
            const result = await this.contentService.getContentById(req.body.uuid);

            res.status(result.statusCode).send(result.response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    initContent = async (req, res) => {
        try {
            const { society_id, language_code, region_id } = req.body;
            for (let i = 0; i < Object.keys(contentTypes).length; i++) {
                const content_type = Object.keys(contentTypes)[i];
                const result = await this.contentService.initContent(society_id, language_code, region_id, content_type);
                const response = result.response;
                if (!response.status) {
                    return res.status(response.code).send(response);
                }
            }
            res.status(httpStatus.CREATED).send({ code: httpStatus.CREATED, message: 'Content initialized successfully', status: true, data: {}});
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    getContentIds = async (req, res) => {
        try {
            const result = await this.contentService.getContentIds(req.body.society_id, req.body.language_code, req.body.region_id);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    iSContentInit = async (req, res) => {
        try {
            const result = await this.contentService.isContentInit(req.body.society_id, req.body.language_code, req.body.region_id);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    getRegionContent = async (req, res) => {
        try {
            const result = await this.contentService.getRegionContent(req.body.society_id, req.body.region_id, req.body.language_code);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }
}

module.exports = ContentController;