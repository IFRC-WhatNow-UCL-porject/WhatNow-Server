const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');
const RegionDao = require('../dao/RegionDao');
const SocietyDao = require('../dao/SocietyDao');
const { language_code } = require('../config/constant')

class RegionService {
    constructor() {
        this.regionDao = new RegionDao();
        this.societyDao = new SocietyDao();
    }

    async getRegionByMultipleIds(society_id, code) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not found');
            }
            if (!Object.keys(language_code).includes(code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not found');
            }
            const region = await this.regionDao.getRegionByMultipleIds(society_id, code);
            return responseHandler.returnSuccess(httpStatus.OK, 'Region fetched successfully', region);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get region error');
        }
    }

    async createRegion(data) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(data.society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not found');
            }
            if (!Object.keys(language_code).includes(data.language_code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not found');
            }
            const region = await this.regionDao.createRegion({
                uuid: uuidv4(),
                region_name: data.region_name,
                society_id: data.society_id,
                description: data.description,
                language_code: data.language_code,
                is_published: data.is_published
            });
            return responseHandler.returnSuccess(httpStatus.OK, 'Region created successfully', region.toJSON());
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'create region error');
        }
    }

    async updateRegionById(data, uuid) {
        try {
            const checkRegion = await this.regionDao.getRegionById(uuid);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not found');
            }
            const region = await this.regionDao.updateRegionById(data, uuid);
            return responseHandler.returnSuccess(httpStatus.OK, 'Region updated successfully', region);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'update region error');
        }
    }

    async deleteRegionById(uuid) {
        try {
            const checkRegion = await this.regionDao.getRegionById(uuid);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not found');
            }
            const region = await this.regionDao.deleteRegionById(uuid);
            return responseHandler.returnSuccess(httpStatus.OK, 'Region deleted successfully', region);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'delete region error');
        }
    }

    async checkRegion(data) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(data.society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not found');
            }
            if (!Object.keys(language_code).includes(data.language_code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not found');
            }
            if (data.action == 'add') {
                const checkRegion = await this.regionDao.getRegionByMultipleIds(data.society_id, data.language_code);
                if (checkRegion.length !== 0) {
                    for (let i = 0; i < checkRegion.length; i++) {
                        if (checkRegion[i].region_name == data.region_name) {
                            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region already exist');
                        }
                    }
                }
            } else if (data.action == 'update') {
                const checkRegion = await this.regionDao.getRegionByMultipleIds(data.society_id, data.language_code);
                console.log(checkRegion);
                if (checkRegion.length !== 0) {
                    for (let i = 0; i < checkRegion.length; i++) {
                        if (checkRegion[i].region_name == data.region_name && checkRegion[i].uuid != data.uuid) {
                            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region already exist');
                        }
                    }
                }
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'Region checked successfully', {});
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'check region error');
        }
    }

    async publish(uuid) {
        try {
            const checkRegion = await this.regionDao.getRegionById(uuid);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not found');
            }
            const region = await this.regionDao.publish(uuid);
            return responseHandler.returnSuccess(httpStatus.OK, 'Region published successfully', region);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'publish region error');
        }
    }

    async stopPublish(uuid) {
        try {
            const checkRegion = await this.regionDao.getRegionById(uuid);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not found');
            }
            const region = await this.regionDao.stopPublish(uuid);
            return responseHandler.returnSuccess(httpStatus.OK, 'Region stop published successfully', region);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'stop publish region error');
        }
    }

    async getPublishedRegion(society_id, _language_code) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not found');
            }
            if (!Object.keys(language_code).includes(_language_code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not found');
            }
            const region = await this.regionDao.getPublishedRegion(society_id, _language_code);
            return responseHandler.returnSuccess(httpStatus.OK, 'Region fetched successfully', region);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get published region error');
        }
    }
}

module.exports = RegionService;