const express = require('express');
const AppController = require('../controllers/AppController');
const ApiService = require('../service/ApiService');

const router = express.Router();
const appController = new AppController();
const apiService = new ApiService();

/**
 * @swagger
 * /app/org/{country_code}/whatnow:
 *   get:
 *     summary: Retrieves society information and translations based on country code and event types.
 *     tags: [App]
 *     description: This endpoint retrieves detailed society information, including language attributions and translations for specified event types, filtered by country code.
 *     parameters:
 *       - in: path
 *         name: country_code
 *         required: true
 *         schema:
 *           type: string
 *         description: The country code to fetch society information for.
 *       - in: query
 *         name: eventType
 *         required: true
 *         schema:
 *           type: string
 *         description: A comma-separated list of event types to filter the content and translations.
 *     responses:
 *       200:
 *         description: A JSON object containing society data, language attributions, and translations for the requested event types.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 *                   description: The UUID of the society information.
 *                 attributions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       society_id:
 *                         type: string
 *                       language_code:
 *                         type: string
 *                       regions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             uuid:
 *                               type: string
 *                             name:
 *                               type: string
 *                 translations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content_type:
 *                         type: string
 *                       message:
 *                         type: string
 *                       region_id:
 *                         type: string
 *       400:
 *         description: Bad request. 
 *         Possible reasons: missing country_code or eventType.
 *       401:
 *         description: Not Found. The requested resource could not be found.
 *       502:
 *         description: Internal Server Error. An error occurred on the server.
 */
router.get('/org/:country_code/whatnow', async (req, res) => {

    const result = await apiService.getApis();
    const apiList = result.response.data;
    const reqApi = req.headers['x-api-key'];

    if (reqApi) {
        const api = apiList.find(api => api.uuid === reqApi);
        if (!api) {
            return res.status(404).send({ message: 'API key is not found.', status: 'error' });
        } else {
            await apiService.updateApi({ hits: api.hits + 1 }, api.uuid);
        }
    } else {
        return res.status(404).send({ message: 'API key is not provided.', status: 'error' });
    }

    const countryCode = req.params.country_code;
    const eventTypes = req.query.eventType.split(',');

    var data = {}

    const society_data = await appController.getSociety(countryCode)
    var language_data = await appController.getLanguage(society_data.uuid)
    for (let i = 0; i < language_data.length; i++) {
        const regions = await appController.getRegion(language_data[i].society_id, language_data[i].language_code)
        language_data[i] = { ...language_data[i].toJSON(), regions }
    };

    data = {
        ...society_data,
        attributions: language_data
    }

    var translations = [];

    const contents = await appController.getContent(data.uuid)
    const attribution_data = data.attributions

    for (let i = 0; i < eventTypes.length; i++) {
        for (let j = 0; j < attribution_data.length; j++) {
            const regions = attribution_data[j].regions
            for (let k = 0; k < regions.length; k++) {
                const region = regions[k]
                const content = contents.filter(content => region.uuid == content.region_id && content.content_type == eventTypes[i])
                const messages = await appController.getContentMessages(data.uuid, region.uuid, attribution_data[j].language_code, eventTypes[i])
                if (content.length > 0) {
                    translations.push({
                        ...content[0].toJSON(),
                        ...messages
                    })
                }
            }
        }
    }

    data = {
        ...data,
        translations
    }

    res.send(data);
});

module.exports = router;