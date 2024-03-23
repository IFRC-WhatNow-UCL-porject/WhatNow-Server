const request = require('supertest');
const app = require('../app');
const UserDao = require('../dao/UserDao');
const TokenService = require('../service/TokenService');
const UserRoleDao = require('../dao/UserRoleDao');
const UserSocietyDao = require('../dao/UserSocietyDao');
const TokenDao = require('../dao/TokenDao');
const SocietyDao = require('../dao/SocietyDao');
const LanguageDao = require('../dao/LanguageDao');
const RegionDao = require('../dao/RegionDao');
const MessageDao = require('../dao/MessageDao');
const tokenService = new TokenService();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const languageDao = new LanguageDao();
const regionDao = new RegionDao();
const messageDao = new MessageDao();
const { v4: uuidv4 } = require('uuid');
const { messageTypes } = require('../config/constant');

describe("/api/messages", () => {

    let token;
    let uuid;
    let GB_society_id;
    let language_code = "EN";
    let regionId;
    let message_id;

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
            user_id: uuid,
            role_id: 5,
        });
        
        const society = await userSocietyDao.create({
            user_id: uuid,
            society_id: GB_society_id,
        });

        const language = await languageDao.create({
            society_id: GB_society_id,
            language_code: language_code,
            url: "https://www.google.com",
            description: "TEST LANGUAGE",
            message: "English" 
        });

        regionId = uuidv4();
        const region = await regionDao.create({ 
            uuid: regionId,
            region_name: 'Test Region',
            society_id: GB_society_id,
            description: 'A test region description',
            language_code: 'EN',
            is_published: 1,
        });

        message_id = uuidv4();
        const message = await messageDao.create({
            uuid: message_id,
            society_id: GB_society_id,                
            region_id: regionId,
            language_code: language_code,
            content_type: "WIND",
            type: messageTypes.IMMEDIATE,
            content: 'test message',
        });
    });
    
    afterAll(async () => {
        await tokenDao.deleteByWhere({ token });
        await regionDao.deleteByWhere({ uuid: regionId });
        await messageDao.deleteByWhere({ uuid: message_id });
        await languageDao.deleteByWhere({ description: "TEST LANGUAGE" });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
    });

    describe("POST /get_all_societies", () => {
        test('retrieves all societies successfully', async () => {
            const response = await request(app)
              .post('/api/messages/get_all_societies')
              .set('Authorization', `Bearer ${token}`)
          
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual("get all societies successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data[0]).toHaveProperty('uuid');
            expect(response.body.data[0]).toHaveProperty('society_name');
            expect(response.body.data[0]).toHaveProperty('country_code');
        });

        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              // missing token
              .post('/api/messages/get_all_societies')
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /get_language", () => {
        test('retrieves language successfully by society id', async () => {
            const response = await request(app)
              .post('/api/messages/get_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("fetch language by society successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
            const language = response.body.data.find(lang => lang.language_code === "EN");
            expect(language).toBeDefined();
        });

        test('returns 400 for missing society_id', async () => {
            const response = await request(app)
              .post('/api/messages/get_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
        });

        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/messages/get_language')
              .send({
                society_id: GB_society_id,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });  
    });

    describe("POST /get_published_region", () => {
        test('retrieves published regions successfully', async () => {
            const response = await request(app)
              .post('/api/messages/get_published_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: language_code,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region fetched successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        
        test('returns 400 for invalid parameters', async () => {
            const response = await request(app)
              .post('/api/messages/get_published_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: "nonExistingSociety",
                language_code: language_code,
              });
          
            expect(response.statusCode).toBe(400);
            // The exact error message might vary depending on your validation logic
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("Society not found");
        });
        
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/messages/get_published_region')
              .send({
                society_id: GB_society_id,
                language_code: language_code,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });          
    });

    describe("POST /get_region_content", () => {
        test('fetches region content successfully', async () => {
            const response = await request(app)
              .post('/api/messages/get_region_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                region_id: regionId,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region content fetched successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        
        test('returns 400 for missing society_id', async () => {
            const response = await request(app)
              .post('/api/messages/get_region_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // society_id is missing
                language_code: language_code,
                region_id: regionId,
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
        });

        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/messages/get_region_content')
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                region_id: regionId,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /get_content_message", () => {
        test('fetches content messages successfully', async () => {
            const response = await request(app)
              .post('/api/messages/get_content_message')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                region_id: regionId,
                content_type: "WIND",
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("fetch messages successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
        
        test('returns 400 for incomplete request data', async () => {
            const response = await request(app)
              .post('/api/messages/get_content_message')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                region_id: regionId,
                // missing content_type
              });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"content_type\" is required");
        });
        
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/messages/get_content_message')
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                region_id: regionId,
                content_type: "WIND",
              });
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });          
    });

    describe("POST /get_society_and_region_name", () => {
        test('fetches society and region names successfully', async () => {
            const response = await request(app)
              .post('/api/messages/get_society_and_region_name')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                region_id: regionId,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("get society and region name successfully");
            expect(response.body.data).toHaveProperty('society_name');
            expect(response.body.data).toHaveProperty('region_name');
        });
        
        test('returns 400 for missing input parameters', async () => {
            const response = await request(app)
              .post('/api/messages/get_society_and_region_name')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
                language_code: language_code,
                region_id: regionId,
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("\"society_id\" is required");
        });

        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/messages/get_society_and_region_name')
              // Authorization header is not set
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                region_id: regionId,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });            
    });
});