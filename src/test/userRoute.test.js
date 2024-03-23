const request = require('supertest');
const app = require('../app');
const UserDao = require('../dao/UserDao');
const TokenService = require('../service/TokenService');
const UserRoleDao = require('../dao/UserRoleDao');
const UserSocietyDao = require('../dao/UserSocietyDao');
const TokenDao = require('../dao/TokenDao');
const SocietyDao = require('../dao/SocietyDao');
const AuthController = require('../controllers/AuthController');
const tokenService = new TokenService();
const userDao = new UserDao(); 
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const sendActivationEmail = new AuthController().sendActivationEmail;
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Mock the mailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation((mailOptions) => {
            return Promise.resolve({
                messageId: 'mockMessageId'
            });
        })
    })
}));

describe('/api/users', () => {
    let token;
    let uuid;
    let GB_society_id;
    let user_id;
    
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
        const user = await userDao.findByWhere({email: "user@devtest.com"});
        user_id = user[0].dataValues.uuid;
        await tokenDao.deleteByWhere({ token });
        await tokenDao.deleteByWhere({ user_uuid: uuid });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userSocietyDao.deleteByWhere({ user_id: user_id, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userRoleDao.deleteByWhere({ user_id: user_id});
        await userDao.deleteByWhere({uuid: uuid });
        await userDao.deleteByWhere({uuid: user_id });
    });

    describe('POST /get_users', () => {
        test('should retrieve all users excluding API users, with a 200 status code', async () => {
          const response = await request(app)
            .post('/api/users/get_users')
            .set('Authorization', `Bearer ${token}`); 
            
          expect(response.statusCode).toBe(200);
          expect(response.body.message).toBe('All Users');
          expect(Array.isArray(response.body.data)).toBeTruthy();
          expect(response.body.data.length).toBeGreaterThan(0);
          response.body.data.forEach(user => {
            expect(user).toHaveProperty('uuid');
            expect(user).toHaveProperty('first_name');
            expect(user).toHaveProperty('last_name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('status');
            expect(user).toHaveProperty('email_verified');
            expect(user).toHaveProperty('last_active');
            expect(user).toHaveProperty('terms_version');
          });
        });
      
        test('should return 401 Unauthorized when no token is provided', async () => {
          const response = await request(app).post('/api/users/get_users');
          expect(response.statusCode).toBe(401);
          expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
      
    });

    describe('POST /get_user_role', () => {
        test('should fetch all user roles successfully with a 200 status code', async () => {
      
          const response = await request(app)
            .post('/api/users/get_user_role')
            .set('Authorization', `Bearer ${token}`); 
      
          expect(response.statusCode).toBe(200);
          expect(response.body.message).toBe('User Role');
          expect(response.body.data.length).toBeGreaterThan(0);
          expect(Array.isArray(response.body.data)).toBeTruthy();
          response.body.data.forEach(role => {
            expect(role).toHaveProperty('user_id');
            expect(role).toHaveProperty('role_id');
          });
        });
      
        test('should return 401 Unauthorized when no token is provided', async () => {
          const response = await request(app).post('/api/users/get_user_role');
          expect(response.statusCode).toBe(401);
          expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });

    describe('POST /get_user_society', () => {
        test('should fetch all user-society associations successfully with a 200 status code', async () => {
      
          const response = await request(app)
            .post('/api/users/get_user_society')
            .set('Authorization', `Bearer ${token}`); 
      
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('code', 200);
          expect(response.body).toHaveProperty('message', 'User Society');
          expect(Array.isArray(response.body.data)).toBeTruthy();
          response.body.data.forEach(association => {
            expect(association).toHaveProperty('user_id');
            expect(association).toHaveProperty('society_id');
          });
        });
      
        test('should return 401 Unauthorized when no token is provided', async () => {
          const response = await request(app).post('/api/users/get_user_society');
          expect(response.statusCode).toBe(401);
          expect(response.body).toHaveProperty('code', 401);
          expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });


    describe('POST /sendActivationEmail', () => {
        test('should send an activation email with a token', async () => {
          
          const req = {
            body: { email: 'superuser@example.com' }
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
          };
      
          await sendActivationEmail(req, res);
      
          expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
          
          const mailOptions = nodemailer.createTransport().sendMail.mock.calls[0][0];
          console.log('Mail options in mocked sendMail call:', mailOptions);
          const tokenPattern = /tokenAct=([^&]+)/;
          const tokenMatch = tokenPattern.exec(mailOptions.text);
          const testToken = tokenMatch ? tokenMatch[1] : null;
          expect(testToken).not.toBeNull();
          jest.clearAllMocks();
        });
    });

    describe('POST /change_status', () => {
        test('should update user status successfully', async () => {
          const response = await request(app)
            .post('/api/users/change_status')
            .send({
              uuid: uuid,
              status: 0
            })
            .set('Authorization', `Bearer ${token}`); 

          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('message', 'User status updated Successfully!');
          expect(response.body).toHaveProperty('status', true);
        });
      
        test('should return 400 Bad Request when user cannot be found or the status update fails', async () => {
        
          const response = await request(app)
            .post('/api/users/change_status')
            .send({
                // missing uuid
                status: 0
            })
            .set('Authorization', `Bearer ${token}`); 
      
          expect(response.statusCode).toBe(400);
          expect(response.body).toHaveProperty('message', '"uuid" is required');
        });
      
        test('should return 401 Unauthorized when no token is provided', async () => {
          const response = await request(app)
          .post('/api/users/change_status')
          .send({
            uuid: uuid,
            status: 0
          });
      
          expect(response.statusCode).toBe(401);
          expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });

    describe('POST /create_profile', () => {
        test('should create a user profile successfully', async () => {
          const response = await request(app)
            .post('/api/users/create_profile')
            .set('Authorization', `Bearer ${token}`) 
            .send({
              email: "user@devtest.com",
              first_name: "John",
              last_name: "Doe",
              user_role: 2,
              society: [GB_society_id]
            });
      
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('message', "Profile Creation Success!");
        });
      
        it('should return a 400 error for invalid input', async () => {
          const response = await request(app)
            .post('/api/users/create_profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
              // missing required fields
              first_name: "John",
              last_name: "Doe",
              user_role: 2,
              society: [GB_society_id]
            });
      
          expect(response.statusCode).toBe(400);
          expect(response.body).toHaveProperty('message', "\"email\" is required");
        });
      
        test('should return a 401 error for unauthorized access', async () => {
          const response = await request(app)
            .post('/api/users/create_profile')
            .send({
                email: "user@devtest.com",
                first_name: "John",
                last_name: "Doe",
                user_role: 2,
                society: [GB_society_id]
            });
      
          expect(response.statusCode).toBe(401);
          expect(response.body).toHaveProperty('message', 'Please authenticate');
        });
    });

});