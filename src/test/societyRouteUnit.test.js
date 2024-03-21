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

describe('/api/society', () => {
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
            user_id: user.uuid,
            role_id: 5,
        });
        
        const society = await userSocietyDao.create({
            user_id: user.uuid,
            society_id: GB_society_id,
        });
    });

    afterAll(async () => {
        await tokenDao.deleteByWhere({ token });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
    });

    describe('POST /get_user_societies', () => {
        test('retrieves societies associated with the user successfully', async () => {
            const response = await request(app)
              .post('/api/society/get_user_societies')
              .set('Authorization', `Bearer ${token}`)
              .send({
                uuid: uuid, 
              });
          
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
        
        test('returns 400 for bad request', async () => {
            const response = await request(app)
              .post('/api/society/get_user_societies')
              .set('Authorization', `Bearer ${token}`)
              .send({}); // Missing `uuid`
          
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("\"uuid\" is required");
        });
        
        test('returns 401 for unauthorized access', async () => {
            const response = await request(app)
              .post('/api/region/get_region')
              // Missing Authorization header
              .send({
                uuid: uuid, 
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe('POST /get_all_societies', () => {
        test('Successfully retrieves all societies', async () => {
            const response = await request(app)
              .post('/api/society/get_all_societies')
              .set('Authorization', `Bearer ${token}`);
        
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("get all societies successfully");
            expect(response.body.data).toBeInstanceOf(Array);
          });
        
          test('Returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/society/get_all_societies'); // No Authorization header
        
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
          });
        
    });
});