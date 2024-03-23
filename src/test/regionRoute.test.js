const request = require('supertest');
const app = require('../app');
const UserDao = require('../dao/UserDao');
const TokenService = require('../service/TokenService');
const UserRoleDao = require('../dao/UserRoleDao');
const UserSocietyDao = require('../dao/UserSocietyDao');
const TokenDao = require('../dao/TokenDao');
const SocietyDao = require('../dao/SocietyDao');
const tokenService = new TokenService();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const { v4: uuidv4 } = require('uuid');

describe('/api/region', () => {
    let token;
    let uuid;
    let GB_society_id;
    let regionId;
    let language_code = "EN";

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
            user_id:uuid,
            society_id: GB_society_id,
        });
    });

    afterAll(async () => {
        await tokenDao.deleteByWhere({ token });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
    });

    describe("POST /add_region", () => {
        test('adds a region successfully', async () => {
            const response = await request(app)
              .post('/api/region/add_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                region_name: 'Test Region',
                society_id: GB_society_id,
                description: 'A test region description',
                language_code: language_code,
                is_published: false,
              });
            
            console.log('response.body', response.body);
            regionId = response.body.data.uuid;
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region created successfully");
        });
        
        test('returns 400 for invalid input', async () => {
            const response = await request(app)
              .post('/api/region/add_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing region_name
                society_id: GB_society_id,
                description: 'A test region description',
                language_code: language_code,
                is_published: false,
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toContain("\"region_name\" is required");
        });

        test('returns 401 for unauthorized access', async () => {
            const response = await request(app)
              .post('/api/region/add_region')
              // Missing Authorization header
              .send({
                region_name: 'Test Region',
                society_id: GB_society_id,
                description: 'A test region description',
                language_code: language_code,
                is_published: false,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /get_region", () => {
        test('fetches region successfully', async () => {
            const response = await request(app)
              .post('/api/region/get_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: language_code
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region fetched successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        
        test('returns 400 for invalid request parameters', async () => {
            const response = await request(app)
              .post('/api/region/get_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: "INVALID_CODE"
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("Language code not found");
        });
        
        test('returns 401 for unauthorized access', async () => {
            const response = await request(app)
              .post('/api/region/get_region')
              // Missing Authorization header
              .send({
                society_id: GB_society_id,
                language_code: language_code
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /check_region", () => {
        test('checks a region successfully before adding', async () => {
            const response = await request(app)
              .post('/api/region/check_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                uuid: regionId,
                society_id: GB_society_id,
                language_code: language_code,
                region_name: 'Test Region',
                action: "update",
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region checked successfully");
        });

        test('returns 400 for bad request when checking a region with invalid input', async () => {
            const response = await request(app)
              .post('/api/region/check_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
                language_code: language_code,
                region_name: 'Test Region',
                action: "add",
              });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toContain("\"society_id\" is required");
        });

        test('returns 401 for unauthorized check region request', async () => {
            const response = await request(app)
              .post('/api/region/check_region')
              .send({
                society_id: GB_society_id,
                language_code: language_code,
                region_name: "Test Region",
                action: "add",
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /update_region", () => {
        test('updates a region successfully', async () => {
            const response = await request(app)
              .post('/api/region/update_region')
              .set('Authorization', `Bearer ${token}`) // Assuming a valid token is provided
              .send({
                uuid: regionId,
                region_name: "Test Updated Region Name",
                description: "Test Updated Region Description",
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region updated successfully");
        });
        
        test('returns 400 for bad request when required fields are missing', async () => {
            const response = await request(app)
              .post('/api/region/update_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing uuid
                region_name: "Test Updated Region Name",
                description: "Test Updated Region Description",
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"uuid\" is required");
          });
        
          test('returns 401 for unauthorized update attempt', async () => {
            const response = await request(app)
              .post('/api/region/update_region')
              // Not setting Authorization header
              .send({
                uuid: regionId,
                region_name: "Test Updated Region Name",
                description: "Test Updated Region Description",
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });  
    });

    describe("POST /delete_region", () => {
        test('deletes a region successfully', async () => {
            const response = await request(app)
              .post('/api/region/delete_region')
              .set('Authorization', `Bearer ${token}`) 
              .send({
                uuid: regionId,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region deleted successfully");
            expect(response.body.data).toBe(1); 
        });
        
        test('returns 400 for bad request when uuid is missing', async () => {
            const response = await request(app)
              .post('/api/region/delete_region')
              .set('Authorization', `Bearer ${token}`)
              .send({});
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("\"uuid\" is required");
        });
        
        test('returns 401 for unauthorized deletion attempt', async () => {
            const response = await request(app)
              .post('/api/region/delete_region')
              .send({
                uuid: regionId,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
          });
          
    });
});