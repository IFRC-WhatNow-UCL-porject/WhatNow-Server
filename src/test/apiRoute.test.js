const request = require('supertest');
const app = require('../app');
const UserDao = require('../dao/UserDao');
const TokenService = require('../service/TokenService');
const UserRoleDao = require('../dao/UserRoleDao');
const UserSocietyDao = require('../dao/UserSocietyDao');
const TokenDao = require('../dao/TokenDao');
const SocietyDao = require('../dao/SocietyDao');
const ApiUserDao = require('../dao/ApiUserDao');
const tokenService = new TokenService();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const apiUserDao = new ApiUserDao();
const { v4: uuidv4 } = require('uuid');
const exp = require('constants');

describe('/api/apps', () => {
    let token;
    let uuid;
    let GB_society_id;
    let apiId;
    
    beforeAll(async () => {
        uuid = uuidv4();
        const GB_society = await societyDao.findByWhere({country_code: 'GB'});
        console.log('GB_society', GB_society);
        GB_society_id = GB_society[0].dataValues.uuid;
        const user = await userDao.create({
            uuid, 
            first_name: 'API',
            last_name: 'User',
            email: 'apiuser@example.com',
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
            role_id: 3,
        });
            
        const society = await userSocietyDao.create({
            user_id: uuid,
            society_id: GB_society_id,
        });

        const apiUser = await apiUserDao.create({
            uuid: uuid,
            location: "London",
            organization: "Test Organization",
            industry_type: "Test Industry",
            usage: "Test Usage",
        });
    });

    afterAll(async () => {
        await apiUserDao.deleteByWhere({ uuid: uuid });
        await tokenDao.deleteByWhere({ token });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
    });

    describe('POST /add_api', () => {
        test('should add a new API successfully', async () => {
          const newApi = {
            user_id: uuid, 
            name: "Example API",
            description: "This is a test API",
            reach: "100",
          };
      
          const response = await request(app)
            .post('/api/apps/add_api')
            .set('Authorization', `Bearer ${token}`)
            .send(newApi);
      
          expect(response.statusCode).toBe(201);
          expect(response.body.code).toBe(201);
          expect(response.body.message).toBe('api created successfully');
          expect(response.body.data).toHaveProperty('uuid');
          expect(response.body.data.name).toBe(newApi.name);

          apiId = response.body.data.uuid;
        });

        test('should return 400 bad request when required fields are missing', async () => {
            const response = await request(app)
              .post('/api/apps/add_api')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing user_id
                name: "Example API",
                description: "This is a test API",
                reach: "100",
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("\"user_id\" is required");
        });
          
        test('should return unauthorized error without a valid token', async () => {
            const response = await request(app)
              .post('/api/apps/add_api')
              .send({
                user_id: uuid, 
                name: "Example API",
                description: "This is a test API",
                reach: "100",
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message', 'Please authenticate');
          });
          
      });

    describe('POST /get_apis', () => {
        test('should return all APIs successfully', async () => {
          const response = await request(app)
            .post('/api/apps/get_apis')
            .set('Authorization', `Bearer ${token}`);
      
          expect(response.statusCode).toBe(200);
          expect(Array.isArray(response.body.data)).toBe(true);
          if (response.body.length > 0) {
            expect(response.body.data[0]).toHaveProperty('id');
            expect(response.body.data[0]).toHaveProperty('uuid');
            expect(response.body.data[0]).toHaveProperty('name');
          }
        });
        
        test('should return unauthorized error without a valid token', async () => {
            const response = await request(app)
              .post('/api/apps/get_apis'); // No token provided
          
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message', 'Please authenticate');
        });  
    });

    describe('POST /get_api_by_id', () => {
        test('should retrieve API details successfully with valid UUID', async () => {
          const response = await request(app)
            .post('/api/apps/get_api_by_id')
            .set('Authorization', `Bearer ${token}`)
            .send({ uuid: apiId }); 
      
          expect(response.statusCode).toBe(200);
          expect(response.body.code).toBe(200);
          expect(response.body.message).toBe('fetch api successfully');
          expect(response.body.data).toHaveProperty('uuid');
          expect(response.body.data).toHaveProperty('name');
        });

        test('should return a 400 error for bad request', async () => {
            const response = await request(app)
              .post('/api/apps/get_api_by_id')
              .set('Authorization', `Bearer ${token}`)
              .send({}); // Sending an empty payload to trigger a bad request
          
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', "\"uuid\" is required");
        });

        test('should return a 401 error for unauthorized access', async () => {
            const response = await request(app)
              .post('/api/apps/get_api_by_id')
              .send({ uuid: apiId }); // Not setting the Authorization header
          
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message', 'Please authenticate');
          });
    });
    
    describe('POST /update_api', () => {
        test('updates an API successfully with valid data', async () => {
          const response = await request(app)
            .post('/api/apps/update_api')
            .set('Authorization', `Bearer ${token}`)
            .send({
              uuid: apiId,
              user_id: uuid,
              name: 'Updated API Name',
              description: 'Updated description',
              reach: '100',
            });
      
          expect(response.statusCode).toBe(200);
          expect(response.body.message).toEqual('api updated successfully');
          expect(Array.isArray(response.body.data)).toBe(true);
          expect(response.body.data[0]).toEqual(expect.any(Number));
        });
    
        test('returns a 400 error for missing required fields', async () => {
            const response = await request(app)
            .post('/api/apps/update_api')
            .set('Authorization', `Bearer ${token}`)
            .send({
                // Missing the 'uuid' field
                user_id: uuid,
                name: 'Updated API Name',
                description: 'Updated description',
                reach: '100',
            }); 
        
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', "\"uuid\" is required");
        });

        test('returns a 401 error for unauthorized access', async () => {
            const response = await request(app)
            .post('/api/apps/update_api')
            .send({
                user_id: uuid,
                name: 'Updated API Name',
                description: 'Updated description',
                reach: '100',
            });
        
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });

    describe('POST /delete_api', () => {
        it('deletes an API successfully with a valid UUID', async () => {
          const response = await request(app)
            .post('/api/apps/delete_api')
            .set('Authorization', `Bearer ${token}`)
            .send({
              uuid: apiId,
            });
      
          expect(response.statusCode).toBe(200);
          expect(response.body.message).toEqual('api deleted successfully');
          expect(response.body.data).toEqual(expect.any(Number));
        });
    

        test('returns a 400 error for missing UUID', async () => {
            const response = await request(app)
            .post('/api/apps/delete_api')
            .set('Authorization', `Bearer ${token}`)
            .send({}); // Missing UUID
        
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', '\"uuid\" is required');
        });
        
        test('returns a 401 error for unauthorized access', async () => {
            const response = await request(app)
            .post('/api/apps/delete_api')
            .send({
                uuid: 'valid_api_uuid',
            }); // Missing Authorization header
        
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });
});