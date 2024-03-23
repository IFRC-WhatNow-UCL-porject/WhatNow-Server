const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const responseHandler = require('../utils/responseHandler');
const logger = require('../config/logger');
const SocietyDao = require('../dao/SocietyDao');
const RegionDao = require('../dao/RegionDao');
const AuditDao = require('../dao/AuditDao');
const ContentDao = require('../dao/ContentDao');
const LanguageDao = require('../dao/LanguageDao');
const MessageDao = require('../dao/MessageDao');
const UserSocietyDao = require('../dao/UserSocietyDao');

class SocietyService {
    constructor() {
        this.societyDao = new SocietyDao();
        this.regionDao = new RegionDao();
        this.auditDao = new AuditDao();
        this.contentDao = new ContentDao();
        this.languageDao = new LanguageDao();
        this.messageDao = new MessageDao();
        this.UserSocietyDao = new UserSocietyDao();
    }


    getAllSocieties = async () => {
        try {
            const societies = await this.societyDao.findAll();
            return responseHandler.returnSuccess(httpStatus.OK, 'get all societies successfully', societies.map(society => society.toJSON()));
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get all societies error');
        }
    }


    getSocietyById = async (id) => {
        try {
            const society = await this.societyDao.getSocietyById(id);
            return responseHandler.returnSuccess(httpStatus.OK, 'get society successfully', society);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get society error');
        }
    }

    getSocietyAndRegionName = async (society_id, region_id) => {
        try {
            const society = await this.societyDao.getSocietyById(society_id);
            const region = await this.regionDao.getRegionById(region_id);
            return responseHandler.returnSuccess(httpStatus.OK, 'get society and region name successfully', {
                society_name: society.society_name,
                region_name: region.region_name
            
            });
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get society and region name error');
        }
    }

    
    async createSociety(society) {
        try {
            society.uuid = uuidv4();
            const society_name = society.society_name;
            const country_code = society.country_code;
            const checkSociety_name = await this.societyDao.getSocietyByName(society_name);
            if (checkSociety_name) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society already exist');
            }
            const checkCountry_code = await this.societyDao.getSocietyByCode(country_code);
            if (checkCountry_code) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Country code already exist');
            }
            const societyData = await this.societyDao.createSociety(society);

            return responseHandler.returnSuccess(httpStatus.OK, 'Society Created', societyData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    }

    async updateSocietyById(society, id) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            }
            const societyData = await this.societyDao.updateSocietyById(society, id);

            await this.auditDao.deleteAuditLog(id);
            await this.contentDao.deleteContentBySocietyId(id);
            await this.languageDao.deleteLanguageBySocietyId(id);
            await this.messageDao.deleteBySocietyId(id);
            await this.regionDao.deleteRegionBySocietyId(id);
            await this.UserSocietyDao.setNullSocietyBySocietyId(id);
            
            return responseHandler.returnSuccess(httpStatus.OK, 'Society Updated', societyData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    }

    async deleteSocietyById(id) {
        try {
            const checkSociety = await this.societyDao.getSocietyById(id);
            if (!checkSociety) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            }
            const societyData = await this.societyDao.deleteSociety(id);
            return responseHandler.returnSuccess(httpStatus.OK, 'Society Deleted', societyData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'Something Went Wrong!!');
        }
    }

    async getSocietyByCountryCode(country_code) {
        try {
            const society = await this.societyDao.findOneByWhere({ country_code });
            if (!society) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Society not exist');
            };
            return responseHandler.returnSuccess(httpStatus.OK, 'get society by country code successfully', society.toJSON());
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, 'get society by country code error');
        }
    }
}

module.exports = SocietyService;