const SuperDao = require('./SuperDao');
const models = require('../models');

const Language = models.language;

class LanguageDao extends SuperDao {
    constructor() {
        super(Language);
    }

    async getLanguage(society_id) {
        try {
            const language = await Language.findAll({
                where: {
                    society_id,
                },
            });
            return language;
        } catch (error) {
            throw error;
        }
    }

    async addLanguage(language) {
        try {
            const languageData = await Language.create(language);
            return languageData;
        } catch (error) {
            throw error;
        }
    }

    async updateLanguageById(language, uuid) {
        try {
            const languageData = await Language.update(language, {
                where: {
                    uuid,
                },
            });
            return languageData;
        } catch (error) {
            throw error;
        }
    }

    async deleteLanguageById(uuid) {
        try {
            const languageData = await Language.destroy({
                where: {
                    uuid,
                },
            });
            return languageData;
        } catch (error) {
            throw error;
        }
    }

    async getLanguageById(uuid) {
        try {
            const languageData = await Language.findOne({
                where: {
                    uuid,
                },
            });
            return languageData;
        } catch (error) {
            throw error;
        }
    }

    async getLanguageByMultipulIds(society_id, language_code) {
        try {
            const languageData = await Language.findOne({
                where: {
                    society_id,
                    language_code,
                },
            });
            return languageData;
        } catch (error) {
            throw error;
        }
    }

    async deleteLanguageBySocietyId(society_id) { 
        try {
            const languageData = await Language.destroy({
                where: {
                    society_id,
                },
            });
            return languageData;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = LanguageDao;