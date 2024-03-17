const httpStatus = require('http-status');
const logger = require('../config/logger');

const RegionService = require('../service/RegionService');
const ContentService = require('../service/ContentService');

class RegionController {
    constructor() {
        this.regionService = new RegionService();
        this.contentService = new ContentService();
    }

    getRegion = async (req, res) => {
        try {
            const result = await this.regionService.getRegionByMultipleIds(req.body.society_id, req.body.language_code);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    addRegion = async (req, res) => {
        try {
            const result = await this.regionService.createRegion(req.body);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    updateRegion = async (req, res) => {
        try {
            const result = await this.regionService.updateRegionById(req.body, req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    deleteRegion = async (req, res) => {
        try {
            const result = await this.regionService.deleteRegionById(req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    checkRegion = async (req, res) => {
        try {
            const result = await this.regionService.checkRegion(req.body);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    publish = async (req, res) => {
        try {
            const result = await this.regionService.publish(req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    stopPublish = async (req, res) => {
        try {
            const result = await this.regionService.stopPublish(req.body.uuid);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }

    getPublishedRegion = async (req, res) => {
        try {
            const result = await this.regionService.getPublishedRegion(req.body.society_id, req.body.language_code);
            const response = result.response;

            res.status(response.code).send(response);
        } catch (error) {
            logger.error(error);
            return res.status(httpStatus.BAD_GATEWAY).send(error);
        }
    }
}

module.exports = RegionController;
