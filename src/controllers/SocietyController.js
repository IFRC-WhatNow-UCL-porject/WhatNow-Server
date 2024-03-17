const httpStatus = require('http-status');
const logger = require('../config/logger');
const { messageTypes } = require('../config/constant');


const SocietyService = require('../service/SocietyService');
const UserSocietyService = require('../service/UserSocietyService');

class SocietyController {
    constructor () {
        this.societyService = new SocietyService();
        this.userSocietyService = new UserSocietyService();
    }

    getUserSocieties = async (req, res) => {
        try {
            const result_society = await this.societyService.getAllSocieties();
            const response_society = result_society.response;
            if (!response_society.status) {
                res.status(response_society.code).send(response_society);            
            }

            const result_user_society = await this.userSocietyService.getUserSocietyByUserId(req.body.uuid);
            const response_user_society = result_user_society.response;
            if (!response_user_society.status) {
                res.status(response_user_society.code).send(response_user_society);
            }

            const status = true;
            const code = httpStatus.OK;
            const message = 'get societies of ' + req.body.uuid + ' success';

            const data_society = response_society.data;
            const data_user_society = response_user_society.data;

            const data = []

            for (let i = 0; i < data_society.length; i++) {
                for (let j = 0; j < data_user_society.length; j++) {
                    if (data_society[i].uuid === data_user_society[j].society_id) {
                        data.push(data_society[i]);
                        break;
                    }
                }
            }

            res.status(httpStatus.OK).send({ status, code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getAllSocieties = async (req, res) => {
        try {
            const result = await this.societyService.getAllSocieties();
            const response = result.response;
            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getSocietyAndRegionName = async (req, res) => {
        try {
            const result = await this.societyService.getSocietyAndRegionName(req.body.society_id, req.body.region_id);
            const response = result.response;
            res.status(response.code).send(response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    addSociety = async (req, res) => {
        try {
            const society = await this.societyService.createSociety(req.body);

            // const country_code = req.body.country_code;
            // const url = req.body.url;
            // const image_url = req.body.image_url;

            res.status(httpStatus.OK).json(society);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateSociety = async (req, res) => {
        try {
            const society = await this.societyService.updateSocietyById(req.body, req.body.uuid);

            res.status(httpStatus.OK).json(society);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    deleteSociety = async (req, res) => {
        try {
            const society = await this.societyService.deleteSocietyById(req.body.uuid);
            res.status(httpStatus.OK).json(society);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };        

}

module.exports = SocietyController;