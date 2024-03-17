const SuperDao = require('./SuperDao');
const models = require('../models');

const Content = models.content;

class ContentDao extends SuperDao {
    constructor() {
        super(Content);
    }

    async getContentBySocietyId(society_id) {
        try {
            const content = await Content.findAll({
                where: {
                    society_id,
                },
            });
            return content;
        } catch (error) {
            throw error;
        }
    }

    async createContent(content) {
        try {
            const contentData = await Content.create(content);
            return contentData;
        } catch (error) {
            throw error;
        }
    }

    async updateContentById(content, uuid) {
        try {
            const contentData = await Content.update(content, {
                where: {
                    uuid,
                },
            });
            return contentData;
        } catch (error) {
            throw error;
        }
    }

    async deleteContentById(uuid) {
        try {
            const contentData = await Content.destroy({
                where: {
                    uuid,
                },
            });
            return contentData;
        } catch (error) {
            throw error;
        }
    }

    async getContentById(uuid) {
        try {
            const contentData = await Content.findOne({
                where: {
                    uuid,
                },
            });
            return contentData;
        } catch (error) {
            throw error;
        }
    }

    async getContentByMultipulIds(society_id, language_code, region_id, content_type) {
        try {
            const contentData = await Content.findOne({
                where: {
                    society_id,
                    language_code,
                    region_id,
                    content_type,
                },
            });
            return contentData;
        } catch (error) {
            throw error;
        }
    }

    async getRegionContent(society_id, language_code, region_id) {
        try {
            const contentData = await Content.findAll({
                where: {
                    society_id,
                    language_code,
                    region_id,
                },
            });
            return contentData;
        } catch (error) {
            throw error;
        }
    }

    async deleteContentBySocietyId(society_id) {
        try {
            const content = await Content.destroy({
                where: {
                    society_id,
                },
            });
            return content;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ContentDao;
