const express = require('express');
const AppController = require('../controllers/AppController'); 

const router = express.Router();
const appController = new AppController();

// api routes

router.get('/org/:country_code/whatnow', async (req, res) => {
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