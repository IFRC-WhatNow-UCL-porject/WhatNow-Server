const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const ContentDao = require('../dao/ContentDao');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');

const SocietyDao = require('../dao/SocietyDao');
const RegionDao = require('../dao/RegionDao');
const { language_code, contentTypes } = require('../config/constant');

class ContentService {
    constructor() {
        this.contentDao = new ContentDao();
        this.societyDao = new SocietyDao();
        this.regionDao = new RegionDao();
    }

    async getContentBySocietyId(society_id) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (checkSociety.length === 0) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            }
            const content = await this.contentDao.getContentBySocietyId(society_id);
            return responseHandler.returnSuccess(httpStatus.OK, 'fetch content by society successfully', content);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'fetch content error');
        }
    }

    async createContent(content) {
        try {
            const society_id = content.society_id;
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            }
            const content_language_code = content.language_code;
            console.log(content_language_code);
            if (!Object.keys(language_code).includes(content_language_code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not exist');
            }
            const region_id = content.region_id;
            const checkRegion = await this.regionDao.getRegionById(region_id);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not exist');
            }
            const content_type = content.content_type;
            if (!Object.keys(contentTypes).includes(content_type)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Content type not exist');
            }
            const checkContent = await this.contentDao.getContentByMultipulIds(society_id, content_language_code, region_id, content_type);
            if (checkContent) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Content already exist');
            }
            const uuid = uuidv4();
            content.uuid = uuid;
            const contentData = await this.contentDao.createContent(content);
            return responseHandler.returnSuccess(httpStatus.OK, 'create content successfully', contentData);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'create content error');
        }
    }

    async updateContentById(content, uuid) {
        try {
            const checkContent = await this.contentDao.getContentById(uuid);
            if (!checkContent) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Content not exist');
            }
            const contentData = await this.contentDao.updateContentById(content, uuid);
            return responseHandler.returnSuccess(httpStatus.OK, 'update content successfully', contentData);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'update content error');
        }
    }

    async deleteContentById(uuid) {
        try {
            const contentData = await this.contentDao.deleteContentById(uuid);
            return responseHandler.returnSuccess(httpStatus.OK, 'delete content successfully', contentData);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'delete content error');
        }
    }

    async getContentById(uuid) {
        try {
            const contentData = await this.contentDao.getContentById(uuid);
            return responseHandler.returnSuccess(httpStatus.OK, 'fetch content by id successfully', contentData);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'fetch content error');
        }
    }

    async getContentType(society_id, _language_code, region_id) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            }
            const checkRegion = await this.regionDao.getRegionById(region_id);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not exist');
            }
            if (!Object.keys(language_code).includes(_language_code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not exist');
            }

            const contentData = await this.contentDao.getContentBySocietyId(society_id);
            const contentTypeData = []
            for (let i = 0; i < contentData.length; i++) {
                const content = contentData[i];
                if (content.language_code === _language_code && content.region_id === region_id) {
                    contentTypeData.push(content.content_type);
                }
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'fetch content type successfully', contentTypeData);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'fetch content type error');
        }
    }

    async initContent(society_id, _language_code, region_id, content_type) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            }
            const checkRegion = await this.regionDao.getRegionById(region_id);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not exist');
            }
            if (!Object.keys(language_code).includes(_language_code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not exist');
            }
            const checkContent = await this.contentDao.getContentByMultipulIds(society_id, _language_code, region_id, content_type);
            if (checkContent) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Content already exist');
            }
            const uuid = uuidv4();
            const content = {
                society_id: society_id,
                language_code: _language_code,
                region_id: region_id,
                content_type: content_type,
                uuid: uuid
            }
            console.log(content);
            const contentData = await this.contentDao.createContent(content);
            return responseHandler.returnSuccess(httpStatus.OK, 'init content successfully', contentData);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'init content error');
        }
    }

    async getContentIds(society_id, _language_code, region_id) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            }
            const checkRegion = await this.regionDao.getRegionById(region_id);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not exist');
            }
            if (!Object.keys(language_code).includes(_language_code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not exist');
            }
            const contentData = await this.contentDao.getContentBySocietyId(society_id);
            const contentIds = []
            for (let i = 0; i < contentData.length; i++) {
                const content = contentData[i];
                if (content.language_code === _language_code && content.region_id === region_id) {
                    contentIds.push(content.uuid);
                }
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'fetch content ids successfully', contentIds);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'fetch content ids error');
        }
    }

    async isContentInit(society_id, _language_code, region_id) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            }
            const checkRegion = await this.regionDao.getRegionById(region_id);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not exist');
            }
            if (!Object.keys(language_code).includes(_language_code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not exist');
            }
            const contentData = await this.contentDao.getContentBySocietyId(society_id);
            var is_init = true;
            for (let i = 0; i < contentData.length; i++) {
                const content = contentData[i];
                if (content.language_code === _language_code && content.region_id === region_id) {
                    if (content.title !== null || content.description !== null || content.url !== null) {
                        is_init = false;
                    }
                }
            }
            return responseHandler.returnSuccess(httpStatus.OK, 'fetch content status success', is_init);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'fetch content status error');
        }
    }

    async getRegionContent(society_id, region_id, _language_code) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(society_id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not found');
            }
            if (!Object.keys(language_code).includes(_language_code)) {
                console.log(_language_code);
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language code not found');
            }
            const checkRegion = await this.regionDao.getRegionById(region_id);
            if (!checkRegion) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Region not found');
            }
            const region = await this.contentDao.getRegionContent(society_id, _language_code, region_id);
            return responseHandler.returnSuccess(httpStatus.OK, 'Region content fetched successfully', region);
        } catch (error) {
            logger.error(error);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get region content error');
        }
    }
}

module.exports = ContentService;