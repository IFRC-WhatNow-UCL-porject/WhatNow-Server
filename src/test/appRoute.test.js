const request = require('supertest');
const app = require('../app');
const RegionDao = require('../dao/RegionDao');
const LanguageDao = require('../dao/LanguageDao');
const SocietyDao = require('../dao/SocietyDao');
const ContentDao = require('../dao/ContentDao');
const regionDao = new RegionDao();
const languageDao = new LanguageDao();
const societyDao = new SocietyDao();
const contentDao = new ContentDao();
const { v4: uuidv4 } = require('uuid');
const { contentTypes } = require('../config/constant');


describe('/api/app', () => {
    let GB_society_id, regionId, languageCode='EN', languageId, contentId;

    beforeAll(async() => {
        const GB_society = await societyDao.findByWhere({country_code: 'GB'});
        GB_society_id = GB_society[0].dataValues.uuid;
        regionId = uuidv4();
        const region = await regionDao.create({ 
            uuid: regionId,
            region_name: 'Test Region',
            society_id: GB_society_id,
            description: 'A test region description',
            language_code: languageCode,
            is_published: 1,
        });
        
        languageId =  uuidv4();
        const language = await languageDao.create({
            uuid: languageId,
            society_id: GB_society_id,
            language_code: languageCode,
            url: "https://www.google.com",
            description: "TEST LANGUAGE",
            message: "English" 
        });

        contentId = uuidv4();
        const content = await contentDao.create({
            uuid: contentId,
            society_id: GB_society_id,
            language_code: languageCode,
            region_id: regionId,
            content_type: contentTypes.AIR_QUALITY,
            title: 'Test Title',
            description: 'Test Description',
            url: 'https://www.google.com',
            is_published: 1,
        });
    });

    afterAll(async() => {
        await regionDao.deleteByWhere({ uuid: regionId });
        await languageDao.deleteByWhere({ uuid: languageId });
        await contentDao.deleteByWhere({ uuid: contentId });
    });

    describe('GET /org/:country_code/whatnow', () => {
        test('should return society information and translations successfully', async () => {
            const response = await request(app)
                .get(`/api/app/org/GB/whatnow?eventType=${contentTypes.AIR_QUALITY},${contentTypes.AIR}`);

            console.log('response', response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('uuid');
            expect(response.body).toHaveProperty('attributions');
            expect(response.body).toHaveProperty('translations');
            expect(response.body).toHaveProperty('country_code', 'GB');
            expect(response.body).toHaveProperty('society_name', 'United Kingdom Society');
        });
    });
});
