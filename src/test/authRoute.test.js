const request = require('supertest');
const app = require('../app');
const UserDao = require('../dao/UserDao');
const UserRoleDao = require('../dao/UserRoleDao');
const UserServices = require('../service/UserService');
const ApiUserDao = require('../dao/ApiUserDao');
const TokenDao = require('../dao/TokenDao');
const nodemailer = require('nodemailer');
const AuthController = require('../controllers/AuthController');
const sendActivationEmail = new AuthController().sendActivationEmail;
const sendResetPasswordEmail = new AuthController().sendResetPasswordEmail;
const userService = new UserServices();
const apiUserDao = new ApiUserDao();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const tokenDao = new TokenDao();
let token = null;
let user_id = null;

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

describe('/api/auth', () => {

    afterAll(async () => {
        const user = await userDao.findByWhere({ email: 'testapiuser@example.com'});
        
        const user2 = await userDao.findByWhere({ email: 'test@example.com'});

        const user_id = user2[0].dataValues.uuid;

        const uuid = user[0].dataValues.uuid;
        
        console.log('uuid:', uuid);
        console.log('user_id:', user_id);

        await apiUserDao.deleteByWhere({ uuid: uuid });

        await userRoleDao.deleteByWhere({ user_id: uuid });

        await userRoleDao.deleteByWhere({ user_id: user_id });

        await userDao.deleteByWhere({email: 'testapiuser@example.com'
        });

        await userDao.deleteByWhere({ email: 'test@example.com' });

        await tokenDao.deleteByWhere({ user_uuid: uuid });

        await tokenDao.deleteByWhere({ user_uuid: user_id });

    });

    describe('POST /register', () => {
        test('Successfully register a user', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123456789',
                first_name: 'Test',
                last_name: 'User',
                user_role: 3,
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Successfully Registered the account! Please Verify your email.');
        });

        test('Should return an error for existing email', async () => {
            const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123456789',
                first_name: 'Unit Test',
                last_name: 'User',
                user_role: 3,
            })
            .expect(400);
    
            expect(res.body).toHaveProperty('message', 'Email already taken');
        });

        test('should return an error for missing required fields', async () => {
            const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
            })
            .expect(400);
    
            expect(res.body).toHaveProperty('message', "\"password\" is required, \"user_role\" is required");
        });
    });

    describe('POST /add_api_user', () => {
        test('Successfully register a new API user', async () => {
            const newUser = {
                email: 'testapiuser@example.com',
                password: 'password123456789',
                first_name: 'Test',
                last_name: 'Api User',
            };
    
            const response = await request(app)
                .post('/api/auth/add_api_user')
                .send(newUser);
    
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Successfully Registered the account! Please Verify your email.');
        });
    
        test('Fail to register an API user without email', async () => {
            const newUser = {
                password: 'password123456789',
                first_name: 'Test',
                last_name: 'User',
            };
    
            const response = await request(app)
                .post('/api/auth/add_api_user')
                .send(newUser);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain("\"email\" is required");
        });
    });

    describe('POST /sendActivationEmail', () => {
        test('should send an activation email with a token', async () => {
          
          const req = {
            body: { email: 'test@example.com' }
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
          token = tokenMatch ? tokenMatch[1] : null;
          console.log('Token:', token);
          expect(token).not.toBeNull();
          jest.clearAllMocks();
        });
    });

    describe('POST /check_email_token', () => {
        test('should verify token successfully', async () => {
            console.log('Token:', token);
            const response = await request(app)
                .post('/api/auth/check_email_token')
                .send({ token: token, type: 'verifyEmail' });
    
            expect(response.statusCode).toBe(200);
        });
    
        test('should return an error for invalid token', async () => {
            const response = await request(app)
                .post('/api/auth/check_email_token')
                .send({ token: 'invalid-token', type: 'verifyEmail' });
    
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('token not found');
        });
    });    

    describe('POST /login', () => {
        test('Successful login', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123456789',
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            token = response.body.tokens;
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe('Login Successful');
        });

        test('Login failure due to missing password', async () => {
            const loginData = {
                email: 'test@example.com',
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('\"password\" is required');
        });
    });

    describe('POST /check_user_role', () => {
        test('should return the role for a valid user', async () => {
            const user = await userService.getUserByEmail('test@example.com');
           user_id = user.response.data.dataValues.uuid;
            const response = await request(app)
                .post('/api/auth/check_user_role')
                .send({ user_id: user_id })
                .expect('Content-Type', /json/)
                .expect(200);
            console.log('Response:', response.body);
            expect(response.body).toHaveProperty('status', true);
            expect(response.body).toHaveProperty('message', 'user role checked');
            expect(response.body.data).toHaveProperty('role_id', 3);
        });

        test('should return a 400 error for invalid user role', async () => {
            const response = await request(app)
              .post('/api/auth/check_user_role')
              .send({ user_id: 'invalid_user_id' });
        
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('status', false);
            expect(response.body).toHaveProperty('code', 400);
            expect(response.body).toHaveProperty('message', 'Invalid User Role!');
          });
    });

    describe('POST /check_user_login_info', () => {
        test('should allow a user with correct email and password to login successfully', async () => {
            const response = await request(app)
                .post('/api/auth/check_user_login_info')
                .send({ email: 'test@example.com', password: 'password123456789' });
            console.log("response:", response.body)
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('User login info is correct!');
            expect(response.body.data).toHaveProperty('email', 'test@example.com');
            expect(response.body.data).toHaveProperty('uuid');
        });
    
        test('should reject login attempt with an invalid email address format', async () => {
            const response = await request(app)
                .post('/api/auth/check_user_login_info')
                .send({ email: 'invalid-email', password: 'securePassword123!' });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain("\"email\" must be a valid email");
        });
    
        test('should reject login with a correct email but wrong password', async () => {
            const response = await request(app)
                .post('/api/auth/check_user_login_info')
                .send({ email: 'test@example.com', password: 'wrongPassword!' });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Wrong Password!');
        });
    
        test('should reject login attempt with an unverified email address', async () => {
            const response = await request(app)
                .post('/api/auth/check_user_login_info')
                .send({ email: 'testapiuser@example.com', password: 'password123456789' });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Email is not verified!');
        });
    });

    describe('POST /check_user_status', () => {
        test('It should respond with 200 for verified token', async () => {
          const response = await request(app)
            .post('/api/auth/check_user_status')
            .set('authorization', 'Bearer ' + token.token);
          expect(response.statusCode).toBe(200);
          expect(response.body.message).toBe('token verified');
        });
      
        test('It should respond with 400 for invalid token', async () => {
          const response = await request(app)
            .post('/api/auth/check_user_status')
            .set('authorization', 'invalid_token_here');
          expect(response.statusCode).toBe(400);
        });
      
        test('It should respond with 400 for unauthorized access', async () => {
          // This scenario assumes the token is missing or not provided
          const response = await request(app)
            .post('/api/auth/check_user_status')
            .set('authorization', 'Bearer null');
          expect(response.statusCode).toBe(400);
        });
    });


    describe('/set_user_terms_version', () => {
        test('should update terms version successfully', async () => {
            const response = await request(app)
                .post('/api/auth/set_user_terms_version')
                .set('authorization', 'Bearer ' + token.token)
                .send({ uuid: user_id, terms_version: 'v1.2' });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ code: 200, status: true, message: 'Terms version updated Successfully!', data: {} });
        });

        test('should return 400 Bad Request for requests with missing fields', async () => {
            const response = await request(app)
                .post('/api/auth/set_user_terms_version')
                .set('Authorization', 'Bearer ' + token.token)
                .send({ uuid: user_id }); 
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ code: 400, message: "\"terms_version\" is required" });
        });

        test('should return 400 Bad Request for requests with invalid userid', async () => {
            const response = await request(app)
                .post('/api/auth/set_user_terms_version')
                .set('Authorization', 'Bearer ' + token.token)
                .send({ uuid: "invalid user id", terms_version: 'v1.2' }); 
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ code: 400, status: false, message: 'Terms version Update Failed!' });
        });

        test('should return 401 Unauthorized for requests without valid token', async () => {
            const response = await request(app)
                .post('/api/auth/set_user_terms_version')
                .send({ uuid: user_id, terms_version: 'v1.2' });
    
            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({ code: 401, message: 'Please authenticate' });
        });
    });

    describe('POST /oauth_check_email_exist', () => {
        test('should return email existence and verification status for verified email', async () => {
            const response = await request(app)
                .post('/api/auth/oauth_check_email_exist')
                .send({ email: 'test@example.com' });
    
            expect(response.statusCode).toBe(200);
            expect(response.body.data.exist).toBeTruthy();
            expect(response.body.message).toEqual("Email is found!");
        });
    
        test('should return 400 for unverified email', async () => {
            const response = await request(app)
                .post('/api/auth/oauth_check_email_exist')
                .send({ email: 'testapiuser@example.com' }); 
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual("Email not verified!"); 
        });
    });

    describe('POST /check_email_exist', () => {
        test('should return 200 if email is available', async () => {
            const response = await request(app)
                .post('/api/auth/check_email_exist')
                .send({ email: 'testAvailable@example.com' });
    
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBeTruthy();
            expect(response.body.message).toEqual("Email is available");
        });
    
        test('should return 400 if email is already taken', async () => {
            const response = await request(app)
                .post('/api/auth/check_email_exist')
                .send({ email: 'test@example.com' });
    
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual("Email already taken");
        });
    });

    describe('POST /send_reset_password_email', () => {
        test('should send a reset password email successfully', async () => {
            const req = {
                body: { email: 'test@example.com' }
              };
              const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn().mockReturnThis()
              };
          
              await sendResetPasswordEmail(req, res);
          
              expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
              
              const mailOptions = nodemailer.createTransport().sendMail.mock.calls[0][0];
              console.log('Mail options in mocked sendMail reset password call:', mailOptions);
              const tokenPattern = /tokenPass=([^&]+)/;
              const tokenMatch = tokenPattern.exec(mailOptions.text);
              token = tokenMatch ? tokenMatch[1] : null;
              console.log('Token:', token);
              expect(token).not.toBeNull();
                jest.clearAllMocks();   
            });
    });

    describe('POST /reset_password', () => {
        test('should successfully update the password', async () => {
            const response = await request(app)
                .post('/api/auth/reset_password')
                .send({ token: token, password: 'newPassword123456789' });
    
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual("Password updated Successfully!");
            expect(response.body.data).toEqual({});
        });
    
        test('should return 400 if confirm password not matched', async () => {
            const response = await request(app)
                .post('/api/auth/reset_password')
                .send({ token: 'invalidtoken', password: 'newPassword123456789' });
    
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual("Invalid Token!");
        });
    });

    describe('POST /auth/logout', () => {
        test('should logout the user and invalidate the token', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .send({ access_token: token })
            .expect(200);

        expect(response.body.message).toContain('logout successfully');
        expect(response.body.data).toHaveProperty('token');
        });
    });


});