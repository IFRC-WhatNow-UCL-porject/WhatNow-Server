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
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

describe('/api/term', () => {
    let token;
    let uuid;
    let GB_society_id;
    let version_content;
    
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

        version_content = fs.readFileSync("src/config/terms/version.txt", 'utf8');
    });

    afterAll(async () => {
        try{
            fs.unlinkSync("src/config/terms/2.0.txt");
            fs.writeFileSync("src/config/terms/version.txt", version_content);
        }
        catch(e){
            console.log('Error deleting file', e);
        }
        await tokenDao.deleteByWhere({ token });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
    });
    
    describe('POST /get_all_versions', () => {
        test('should retrieve all versions of the terms and conditions', async () => {
          const response = await request(app)
            .post('/api/term/get_all_versions')
            .set('Authorization', `Bearer ${token}`);
      
          expect(response.statusCode).toBe(200);
          expect(response.body.status).toBe(true);
          expect(response.body.message).toBe('All versions fetched successfully');
          expect(Array.isArray(response.body.data)).toBe(true);
        });
      
        test('should return 401 if token is not provided', async () => {
          const response = await request(app)
            .post('/api/term/get_all_versions');
      
          expect(response.statusCode).toBe(401);
          expect(response.body.message).toBe('Please authenticate');
        });
    });
    
    describe('POST /term/get_term_by_version', () => {
        test('should fetch terms and conditions for the specified version', async () => {
          const response = await request(app)
            .post('/api/term/get_term_by_version')
            .set('Authorization', `Bearer ${token}`)
            .send({ version: "1.0" });
      
          expect(response.statusCode).toBe(200);
          expect(response.body.status).toBe(true);
          expect(response.body.message).toBe("Term fetched successfully");
          expect(typeof response.body.data).toBe("string");
        });
        
        it('should return 400 for a non-existent version', async () => {
            const response = await request(app)
              .post('/api/term/get_term_by_version')
              .set('Authorization', `Bearer ${token}`)
              .send({ version: "99.9" }); // Assuming this version does not exist
          
            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe(false);
            expect(response.body.message).toBe("Version not found");
        });

        test('should return 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/term/get_term_by_version')
              .send({ version: "1.0" }); // No Authorization header
          
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });
    
    describe('POST /term/publish_term', () => {
        it('should publish a new version of the terms and conditions successfully', async () => {
          const response = await request(app)
            .post('/api/term/publish_term')
            .set('Authorization', `Bearer ${token}`)
            .send({
              version: "2.0",
              term: "Terms and Conditions text test"
            });
      
          expect(response.statusCode).toBe(200);
          expect(response.body.status).toBe(true);
          expect(response.body.message).toBe("Term published successfully");
        });
        
        test('should return 400 for missing required fields', async () => {
            const response = await request(app)
              .post('/api/term/publish_term')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // Missing the 'term' field
                version: "2.0"
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("\"term\" is required");
          });
          

        test('should return 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/term/publish_term')
              .send({ // Missing the Authorization header
                version: "2.0",
                term: "Terms and Conditions text test"
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe('POST /get_latest_term', () => {
        it('should fetch the latest version of the terms and conditions successfully', async () => {
          const response = await request(app)
            .post('/api/term/get_latest_term')
      
          expect(response.statusCode).toBe(200);
          expect(response.body.status).toBe(true);
          expect(response.body.message).toBe("Latest term fetched successfully");
          expect(typeof response.body.data).toBe("string");
        });
    });
      
});