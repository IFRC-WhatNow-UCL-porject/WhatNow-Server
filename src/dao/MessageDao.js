const SuperDao = require('./SuperDao');
const models = require('../models');

const Message = models.message;

class MessageDao extends SuperDao {
    constructor() {
        super(Message);
    }

    findAll = async () => {
        try {
            return await Message.findAll();
        } catch (error) {
            throw error;
        }
    }

    findByWhere = async (where) => {
        try {
            return await Message.findAll({ where: where });
        } catch (error) {
            throw error;
        }
    }

    create = async (data) => {
        try {
            return await Message.create(data);
        } catch (error) {
            throw error;
        }
    }

    updateById = async (data, uuid) => {
        try {
            return await Message.update(data, { where: { uuid: uuid } });
        } catch (error) {
            throw error;
        }
    }

    deleteById = async (uuid) => {
        try {
            return await Message.destroy({ where: { uuid: uuid } });
        } catch (error) {
            throw error;
        }
    }

    deleteByMultipleIds = async ({society_id, region_id, content_type, language_code}) => {
        try {
            return await Message.destroy({ where: { society_id: society_id, region_id: region_id, content_type: content_type, language_code: language_code } });
        } catch (error) {
            throw error;
        }
    }

    getMessageById = async (uuid) => {
        try {
            return await Message.findOne({ where: { uuid: uuid } });
        } catch (error) {
            throw error;
        }
    }

    deleteBySocietyId = async (society_id) => {
        return await Message.destroy({ where: { society_id: society_id } });
    }

}

module.exports = MessageDao;