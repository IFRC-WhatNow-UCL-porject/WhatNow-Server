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

describe('/api/profile', () => {
    let token;
    let uuid;
    let GB_society_id;
    let language_code = "EN";
    let regionId;
    let message_id;
    let new_password = "newSecurePassword123";

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
            description: "English",
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
        await languageDao.deleteByWhere({ language_code });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
    });

    describe("POST /change_password", () => {
        test('changes password successfully', async () => {
            const response = await request(app)
              .post('/api/profile/change_password')
              .set('Authorization', `Bearer ${token}`)
              .send({
                new_password: new_password,
                uuid: uuid,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Password updated Successfully!");
        });
        
        test('returns 400 when user is not found', async () => {
            const response = await request(app)
              .post('/api/profile/change_password')
              .set('Authorization', `Bearer ${token}`)
              .send({
                new_password: new_password,
                uuid: "nonExistentUserUUID",
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("User Not found!");
        });

        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/profile/change_password')
              .send({
                new_password: new_password,
                uuid: uuid,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /get_profile", () => {
        test('fetches user profile successfully', async () => {
            const response = await request(app)
              .post('/api/profile/get_profile')
              .set('Authorization', `Bearer ${token}`) // Assuming a valid token is set here
              .send({
                uuid: uuid, // Use a valid UUID of a user
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("User Profile");
            expect(response.body.data.uuid).toBe(uuid);
        });
        
        test('returns 400 when user is not found', async () => {
            const response = await request(app)
              .post('/api/profile/get_profile')
              .set('Authorization', `Bearer ${token}`)
              .send({
                uuid: "nonExistentUserUUID",
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("User Not found!");
        });

        test('returns 401 for unauthorized profile retrieval attempt', async () => {
            const response = await request(app)
              // No token set here
              .post('/api/profile/get_profile')
              .send({
                uuid: uuid,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /update_profile", () => {
        test('updates user profile successfully', async () => {
            const response = await request(app)
              .post('/api/profile/update_profile')
              .set('Authorization', `Bearer ${token}`) 
              .send({
                uuid: uuid, 
                first_name: "Test update",
                last_name: "Super",
                user_role: 5,
                society: [GB_society_id],
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Profile updated Successfully!");
        });

        test('returns 400 for bad request when profile update fails', async () => {
            const response = await request(app)
              .post('/api/profile/update_profile')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // Assume this UUID does not exist or invalid data is provided
                uuid: "invalid-uuid",
                first_name: "Test update",
                last_name: "Super",
                user_role: 5,
                society: [GB_society_id],
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Profile Update Failed!");
        });
        
        test('returns 401 for unauthorized profile update attempt', async () => {
            const response = await request(app)
              .post('/api/profile/update_profile')
              // Not setting Authorization header
              .send({
                uuid: uuid, 
                first_name: "Test update",
                last_name: "Super",
                user_role: 5,
                society: [GB_society_id],
              }); 
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });          
    });

    describe("POST /get_user_societies", () => {
        test('retrieves societies associated with the user successfully', async () => {
            const response = await request(app)
              .post('/api/profile/get_user_societies')
              .set('Authorization', `Bearer ${token}`) 
              .send({
                uuid: uuid,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toContain("get societies of " + uuid + " success");
            expect(Array.isArray(response.body.data)).toBe(true);
            // Optionally check for specific society details if known
            const society = response.body.data.find(s => s.uuid === GB_society_id);
            expect(society).toBeDefined();
        });
        
        test('returns 400 for bad request without uuid', async () => {
            const response = await request(app)
              .post('/api/profile/get_user_societies')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing uuid
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("\"uuid\" is required");
        });
        
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/profile/get_user_societies')
              // Authorization header is not set
              .send({
                uuid: uuid,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });  
    });

    describe("POST /get_user_role", () => {
        test('retrieves the role of a user successfully', async () => {
            const response = await request(app)
              .post('/api/profile/get_user_role')
              .set('Authorization', `Bearer ${token}`) // Assuming a valid token is set here
              .send({
                user_id: uuid,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("user role checked");
            expect(response.body.data.role_id).toBe(5);
        });  

        test('returns 400 for invalid request due to incorrect user ID', async () => {
            const response = await request(app)
              .post('/api/profile/get_user_role')
              .set('Authorization', `Bearer ${token}`)
              .send({
                user_id: "invalid-uuid",
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("Invalid User Role!");
        });
        
        test('returns 401 for unauthorized role retrieval attempt', async () => {
            const response = await request(app)
              .post('/api/profile/get_user_role')
              // Not setting Authorization header
              .send({
                user_id: uuid,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
          });
          
    });
});