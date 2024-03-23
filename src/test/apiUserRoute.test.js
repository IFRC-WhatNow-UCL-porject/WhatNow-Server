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


describe('/api/apiUsers', () => {
    let token;
    let uuid;
    let GB_society_id;
    let apiUserId;
    
    beforeAll(async () => {
        uuid = uuidv4();
        const GB_society = await societyDao.findByWhere({country_code: 'GB'});
        console.log('GB_society', GB_society);
        GB_society_id = GB_society[0].dataValues.uuid;
        const user = await userDao.create({
            uuid, 
            first_name: 'Test',
            last_name: 'Super User',
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
        await tokenDao.deleteByWhere({ token });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
    });

    describe('POST /add_api_user', () => {
        test('registers a new API user successfully', async () => {
            const newUser = {
                email: 'newuser@example.com',
                password: 'password123456789',
                first_name: 'John',
                last_name: 'Doe',
                society_id: GB_society_id,
                location: 'Some Location',
                organization: 'Some Organization',
                industry_type: 'Some Industry'
            };
          
            const response = await request(app)
                .post('/api/apiUsers/add_api_user')
                .set('Authorization', `Bearer ${token}`)
                .send(newUser);
            console.log('response', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe(true);
            expect(response.body.code).toBe(201);
            expect(response.body.message).toContain("Successfully Registered the account! Please Verify your email.");
              
            apiUserId = response.body.data.uuid;
        });
        
        test('returns a 400 error when required fields are missing', async () => {
            const incompleteUser = {
                first_name: 'John',
                last_name: 'Doe'
            };
            
            const response = await request(app)
                .post('/api/apiUsers/add_api_user')
                .set('Authorization', `Bearer ${token}`)
                .send(incompleteUser);
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message', expect.stringContaining("required"));
        });
          
        test('returns a 401 error for unauthorized access', async () => {
            const newUser = {
                email: 'newuser@example.com',
                password: 'password123456789',
                first_name: 'John',
                last_name: 'Doe',
                society_id: GB_society_id,
                location: 'Some Location',
                organization: 'Some Organization',
                industry_type: 'Some Industry'
            };
            
            const response = await request(app)
                .post('/api/apiUsers/add_api_user')
                .send(newUser); // Missing Authorization header
            
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });

    describe('POST /get_api_users', () => {
        test('fetches all API users successfully', async () => {
            const response = await request(app)
                .post('/api/apiUsers/get_api_users')
                .set('Authorization', `Bearer ${token}`); 

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("API Users found!");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
            expect(response.body.data[0]).toHaveProperty('id');
            expect(response.body.data[0]).toHaveProperty('uuid');
            expect(response.body.data[0]).toHaveProperty('email');
        });

        test('returns a 401 error for unauthorized access', async () => {
            const response = await request(app)
                .post('/api/apiUsers/get_api_users'); 
      
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('code', 401);
            expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });
      
    describe('POST /get_api_user_by_id', () => {
        test('fetches an API user by ID successfully', async () => {
            const response = await request(app)
                .post('/api/apiUsers/get_api_user_by_id')
                .send({ uuid: apiUserId }) // Use an existing user ID for testing
                .set('Authorization', `Bearer ${token}`);
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('code', 200);
            expect(response.body).toHaveProperty('message', 'API User found!');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('uuid');
            expect(response.body.data).toHaveProperty('email');
        });

        test('returns a 400 error when the user ID is missing or invalid', async () => {
            const response = await request(app)
                .post('/api/apiUsers/get_api_user_by_id')
                .send({})
                .set('Authorization', `Bearer ${token}`);
          
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('code', 400);
            expect(response.body).toHaveProperty('message', '\"uuid\" is required'); 
        });
        test('returns a 401 error for unauthorized access', async () => {
          const response = await request(app)
            .post('/api/apiUsers/get_api_user_by_id')
            .send({ uuid: apiUserId }); // Not setting the Authorization header
        
          expect(response.statusCode).toBe(401);
          expect(response.body).toHaveProperty('code', 401);
          expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });

    describe('POST /update_api_user', () => {
        test('updates an API user successfully', async () => {
            const userToUpdate = {
                email: "example@domain.com",
                password: "newpassword123456789",
                first_name: "Jane",
                last_name: "Doe",
                society_id: GB_society_id,
                location: "New Location",
                organization: "New Org",
                industry_type: "New Industry",
                uuid: apiUserId
          };
      
          const response = await request(app)
              .post('/api/apiUsers/update_api_user')
              .send(userToUpdate)
              .set('Authorization', `Bearer ${token}`);
      
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('code', 200);
          expect(response.body).toHaveProperty('message', 'API User updated Successfully!');
        });

        test('returns a 400 error when required fields are missing', async () => {
            const incompleteData = {
                uuid: apiUserId,
                password: "newpassword123456789",
                first_name: "Jane",
                last_name: "Doe",
                society_id: GB_society_id,
                location: "New Location",
                organization: "New Org",
                industry_type: "New Industry",
            };
          
            const response = await request(app)
                .post('/api/apiUsers/update_api_user')
                .send(incompleteData)
                .set('Authorization', `Bearer ${token}`);
          
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('code', 400);
            expect(response.body.message).toContain('\"email\" is required');
        });
        
        test('returns a 401 error for unauthorized access', async () => {
            const validUpdateData = {
                email: "example@domain.com",
                password: "newpassword123456789",
                first_name: "Jane",
                last_name: "Doe",
                society_id: GB_society_id,
                location: "New Location",
                organization: "New Org",
                industry_type: "New Industry",
                uuid: apiUserId
            };
        
            const response = await request(app)
                .post('/api/apiUsers/update_api_user')
                .send(validUpdateData); // Not setting the Authorization header
          
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('code', 401);
            expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });

    describe('POST /delete_api_user', () => {
        test('deletes an API user successfully', async () => {
            const userToDelete = {
              uuid: apiUserId
            };
      
            const response = await request(app)
                .post('/api/apiUsers/delete_api_user')
                .send(userToDelete)
                .set('Authorization', `Bearer ${token}`);
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'API User deleted Successfully!');
        });

        test('returns a 400 error when required fields are missing', async () => {
            const missingData = {
              // Omitting required 'uuid' field
            };
        
            const response = await request(app)
                .post('/api/apiUsers/delete_api_user')
                .send(missingData)
                .set('Authorization', `Bearer ${token}`);
          
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('code', 400);
            expect(response.body.message).toContain('\"uuid\" is required');
        });
        
        test('returns a 401 error for unauthorized access', async () => {
            const validData = {
                uuid: apiUserId
            };
          
            const response = await request(app)
                .post('/api/apiUsers/delete_api_user')
                .send(validData); // Not setting the Authorization header
          
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('code', 401);
            expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });
});