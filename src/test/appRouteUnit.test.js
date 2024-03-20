const request = require('supertest');
const {contentTypes} = require('../config/constant');
const app = require('../app');
require('../route/appRoute');

describe('/api/app', () => {
    describe('GET /org/:country_code/whatnow', () => {
        test('should return society information and translations successfully', async () => {
            const response = await request(app)
                .get("/api/app/org/GB/whatnow?eventType=${contentTypes.AIR_QUALITY},${contentTypes.AIR}");

            console.log('response', response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('uuid');
            expect(response.body).toHaveProperty('attributions');
            expect(response.body).toHaveProperty('translations');
            expect(response.body).toHaveProperty('country_code', 'GB');
            expect(response.body).toHaveProperty('society_name', 'United Kiongdom Society');
        });
    });
});
