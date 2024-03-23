const request = require('supertest');
const app = require('../app');
const UserDao = require('../dao/UserDao');
const TokenService = require('../service/TokenService');
const UserRoleDao = require('../dao/UserRoleDao');
const UserSocietyDao = require('../dao/UserSocietyDao');
const TokenDao = require('../dao/TokenDao');
const SocietyDao = require('../dao/SocietyDao');
const LanguageDao = require('../dao/LanguageDao');
const tokenService = new TokenService();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const languageDao = new LanguageDao();

const { v4: uuidv4 } = require('uuid');

describe("/api/language", () => {
    let token;
    let uuid;
    let GB_society_id;
    let language_code = "EN";
    let languageId;

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

    });

    afterAll(async () => {
        await languageDao.deleteByWhere({ language_code });
        await tokenDao.deleteByWhere({ token });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
    });

    describe("POST /add_language", () => {
        test('adds language successfully', async () => {
            const response = await request(app)
              .post('/api/language/add_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                url: "https://www.google.com",
                description: "English",
                message: "English"
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("create language successfully");
        });

        test('returns 400 for missing language_code', async () => {
            const response = await request(app)
              .post('/api/language/add_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
                language_code: language_code,
                url: "https://www.google.com",
                description: "English",
                message: "English"
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
        });
        
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/language/add_language')
              // Not setting Authorization header
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                url: "https://www.google.com",
                description: "English",
                message: "English"
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });          
    });
    
    describe("POST /get_language", () => {
        test('retrieves language successfully', async () => {
            const response = await request(app)
              .post('/api/language/get_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("fetch language by society successfully");
            expect(Array.isArray(response.body.data)).toBe(true); 
        });

        test('returns 400 for invalid or incomplete request data', async () => {
            const response = await request(app)
              .post('/api/language/get_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // society_id is missing
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
        });
        
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/language/get_language')
              // Not setting Authorization header
              .send({
                society_id: GB_society_id,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /update_language", () => {
        test('updates language successfully', async () => {
            const language = await languageDao.findByWhere({ society_id: GB_society_id, description: "English" });
            languageId = language[0].dataValues.uuid
            const response = await request(app)
              .post('/api/language/update_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                uuid: languageId,
                url: "https://www.updated-example.com",
                description: "Updated Description",
                message: "Updated Message"
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("update language successfully");
            expect(response.body.data).toContain(1);
        });
        
        test('returns 400 for missing uuid', async () => {
            const response = await request(app)
              .post('/api/language/update_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // uuid is missing
                url: "https://www.updated-example.com",
                description: "Updated Description",
                message: "Updated Message"
              });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"uuid\" is required");
        });
        
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/language/update_language')
              // Not setting Authorization header
              .send({
                uuid: languageId,
                url: "https://www.updated-example.com",
                description: "Updated Description",
                message: "Updated Message"
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
          });
          
    });
});