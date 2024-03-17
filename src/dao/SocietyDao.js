const SuperDao = require('./SuperDao');
const models = require('../models');

const Society = models.society;

class SocietyDao extends SuperDao {
    constructor() {
        super(Society);
    }

    async getSocietyById(society_id) {
        try {
            const society = await this.Model.findOne({
                where: {
                    uuid: society_id,
                },
            });
            return society;
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const societies = await this.Model.findAll();
            return societies;
        } catch (error) {
            throw error;
        }
    }

    async getSocietyByName(society_name) {
        try {
            const society = await this.Model.findOne({
                where: {
                    society_name,
                },
            });
            return society;
        } catch (error) {
            throw error;
        }
    }

    async getSocietyByCode(country_code) {
        try {
            const society = await this.Model.findOne({
                where: {
                    country_code,
                },
            });
            return society;
        } catch (error) {
            throw error;
        }
    }

    async deleteSociety(uuid) {
        try {
            const society = await this.Model.destroy({
                where: {
                    uuid,
                },
            });
            return society;
        } catch (error) {
            throw error;
        }
    }

    async updateSocietyById(society, uuid) {
        try {
            const societyData = await this.Model.update(society, {
                where: {
                    uuid,
                },
            });
            return societyData;
        } catch (error) {
            throw error;
        }
    }

    async createSociety(society) {
        try {
            const societyData = await this.Model.create(society);
            return societyData;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = SocietyDao;