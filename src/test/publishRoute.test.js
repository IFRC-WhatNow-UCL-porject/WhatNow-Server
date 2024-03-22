const request = require('supertest');
const app = require('../app');
const UserDao = require('../dao/UserDao');
const TokenService = require('../service/TokenService');
const UserRoleDao = require('../dao/UserRoleDao');
const UserSocietyDao = require('../dao/UserSocietyDao');
const TokenDao = require('../dao/TokenDao');
const SocietyDao = require('../dao/SocietyDao');
const RegionDao = require('../dao/RegionDao');
const tokenService = new TokenService();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const regionDao = new RegionDao();
const { v4: uuidv4 } = require('uuid');

describe('/api/publish', () => {
    let token;
    let uuid;
    let GB_society_id;
    let regionId;

    beforeAll(async () => {
        uuid = uuidv4();
        const GB_society = await societyDao.findByWhere({country_code: 'GB'});
        console.log('GB_society', GB_society);
        GB_society_id = GB_society[0].dataValues.uuid;
        const user = await userDao.create({
            uuid, 
            first_name: 'Super',
            last_name: 'User',
            email: 'superuser@example.com',
            password: '123456789101112', 
            status: 1, 
            email_verified: 1, 
            last_active: new Date(),
            terms_version: "v1.0",
        });
        
        token = (await tokenService.generateAuthTokens(user, 'access')).token;
        console.log('token', token);
        
        const role = await userRoleDao.create({
            user_id: user.uuid,
            role_id: 5,
        });
        
        const society = await userSocietyDao.create({
            user_id: user.uuid,
            society_id: GB_society_id,
        });

        regionId = uuidv4();
        const region = await regionDao.create({ 
            uuid: regionId,
            region_name: 'Test Region',
            society_id: GB_society_id,
            description: 'A test region description',
            language_code: 'EN',
            is_published: 0,
        });
    });

    afterAll(async () => {
        await regionDao.deleteByWhere({ uuid: regionId });
        await tokenDao.deleteByWhere({ token });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
    });

    describe("POST /publish", () => {
        test('publishes a region successfully', async () => {
            const response = await request(app)
              .post('/api/publish/publish')
              .set('Authorization', `Bearer ${token}`) 
              .send({
                uuid: regionId,
              });
            console.log('response', response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region published successfully");
            expect(response.body.data[0]).toBeGreaterThan(0);
        });
        
        test('returns 400 when user is not found', async () => {
            const response = await request(app)
              .post('/api/publish/publish')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // Missing uuid
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("\"uuid\" is required");
        });

        test('returns 401 for unauthorized publish attempt', async () => {
            const response = await request(app)
              .post('/api/publish/publish')
              // Not setting Authorization header
              .send({
                uuid: regionId,
              });
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });          
    });

    describe ("POST /publish/stop_publish", () => {
        test('stops region publication successfully', async () => {
            const response = await request(app)
              .post('/api/publish/stop_publish')
              .set('Authorization', `Bearer ${token}`) 
              .send({
                uuid: regionId,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region stop published successfully");
            expect(response.body.data[0]).toBeGreaterThan(0);
        });

        test('returns 400 for invalid request when region not found', async () => {
            const response = await request(app)
              .post('/api/publish/stop_publish')
              .set('Authorization', `Bearer ${token}`)
              .send({
                uuid: "nonexistent-uuid", 
              });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Region not found");
        });
        
        test('returns 401 for unauthorized stop publish attempt', async () => {
            const response = await request(app)
              .post('/api/publish/stop_publish')
              // Not setting Authorization header
              .send({
                uuid: regionId,
              });
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });
});
