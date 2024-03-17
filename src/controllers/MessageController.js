const httpStatus = require('http-status');
const logger = require('../config/logger');
const MessageService = require('../service/MessageService');
const AuditService = require('../service/AuditService');
const jwt = require('jsonwebtoken');

const { messageTypes } = require('../config/constant');
const config = require('../config/config');

class MessageController {
    constructor() {
        this.messageService = new MessageService();
        this.auditService = new AuditService();
    }

    getContentMessage = async (req, res) => {
        try {
            const society_id = req.body.society_id;
            const region_id = req.body.region_id;
            const language_code = req.body.language_code;
            const content_type = req.body.content_type;
            const result = await this.messageService.getMessageByMultipleIds(society_id, region_id, language_code, content_type);

            res.status(result.statusCode).send(result.response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    updateContentMessage = async (req, res) => {
        try {
            const messages = req.body.messages;
            const types = Object.keys(messages);
            const society_id = req.body.society_id;
            const region_id = req.body.region_id;
            const content_type = req.body.content_type;
            const language_code = req.body.language_code;
            const result_delete_messages = await this.messageService.deleteAllMessage(society_id, region_id, content_type, language_code);
            const response_delete_messages = result_delete_messages.response;
            if (!response_delete_messages.status) {
                return res.status(response_delete_messages.code).send(response_delete_messages);
            }

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
            const result_create_audit = await this.auditService.createAuditLog('UPDATE', { society_id, user_id, language_code, content_type });
            const response_create_audit = result_create_audit.response;
            if (!response_create_audit.status) {
                return res.status(response_create_audit.code).send(response_create_audit);
            }
            
            res.status(httpStatus.OK).send({ 
                code: httpStatus.OK,
                message: 'Update content message successful',
                status: true,
                data: {}
             });
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

}

module.exports = MessageController;