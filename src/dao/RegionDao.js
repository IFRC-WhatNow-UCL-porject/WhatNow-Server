const SuperDao = require('./SuperDao');
const models = require('../models');

const Region = models.region;

class RegionDao extends SuperDao {
    constructor() {
        super(Region);
    }

    async getRegionById(id) {
        try {
            const region = await this.Model.findOne({
                where: {
                    uuid: id,
                },
            });
            return region;
        } catch (error) {
            throw error;
        }
    }

    async getRegionByMultipleIds(society_id, code) {
        try {
            const region = await this.Model.findAll({
                where: {
                    society_id: society_id,
                    language_code: code,
                },
            });
            return region;
        } catch (error) {
            throw error;
        }
    }

    async createRegion(data) {
        try {
            const region = await this.Model.create(data);
            return region;
        } catch (error) {
            throw error;
        }
    }

    async updateRegionById(data, uuid) {
        try {
            const region = await this.Model.update(data, {
                where: {
                    uuid: uuid,
                },
            });
            return region;
        } catch (error) {
            throw error;
        }
    }

    async deleteRegionById(id) {
        try {
            const region = await this.Model.destroy({
                where: {
                    uuid: id,
                },
            });
            return region;
        } catch (error) {
            throw error;
        }
    }

    async publish(id) {
        try {
            const region = await this.Model.update({
                is_published: true,
            }, {
                where: {
                    uuid: id,
                },
            });
            return region;
        } catch (error) {
            throw error;
        }
    }

    async stopPublish(id) {
        try {
            const region = await this.Model.update({
                is_published: false,
            }, {
                where: {
                    uuid: id,
                },
            });
            return region;
        } catch (error) {
            throw error;
        }
    }

    async getPublishedRegion(society_id, language_code) {
        try {
            const region = await this.Model.findAll({
                where: {
                    society_id: society_id,
                    language_code: language_code,
                    is_published: true,
                },
            });
            return region;
        } catch (error) {
            throw error;
        }
    }

    
    async deleteRegionBySocietyId(society_id) {
        try {
            const region = await this.Model.destroy({
                where: {
                    society_id: society_id,
                },
            });
            return region;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = RegionDao;