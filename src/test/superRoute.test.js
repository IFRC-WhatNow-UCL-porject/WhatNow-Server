const request = require('supertest');
const app = require('../app');
const UserDao = require('../dao/UserDao');
const TokenService = require('../service/TokenService');
const UserRoleDao = require('../dao/UserRoleDao');
const UserSocietyDao = require('../dao/UserSocietyDao');
const AuditDao = require('../dao/AuditDao');
const TokenDao = require('../dao/TokenDao');
const SocietyDao = require('../dao/SocietyDao');
const RegionDao = require('../dao/RegionDao');
const MessageDao = require('../dao/MessageDao');
const ContentDao = require('../dao/ContentDao');
const LanguageDao = require('../dao/LanguageDao');
const auditDao = new AuditDao();
const tokenService = new TokenService();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const regionDao = new RegionDao();
const messageDao = new MessageDao();
const contentDao = new ContentDao();
const languageDao = new LanguageDao();
const { contentTypes, messageTypes } = require('../config/constant');
const { v4: uuidv4 } = require('uuid');

describe('/api/super', () => {
    let token, regionId, contentId, auditId, apiUserId, languageId,  languageCode = 'EN', uuid, GB_society_id, message_id, society_id;
    
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

        apiUserId = uuidv4();
        const apiUser = await userDao.create({
            uuid: apiUserId, 
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
            role_id: 4,
        });

        const society = await userSocietyDao.create({
            user_id: uuid,
            society_id: GB_society_id,
        });

        const apiSociety = await userSocietyDao.create({
            user_id: apiUserId,
            society_id: GB_society_id,
        });

        regionId = uuidv4();
        const region = await regionDao.create({ 
            uuid: regionId,
            region_name: 'Test Region',
            society_id: GB_society_id,
            description: 'A test region description',
            language_code: languageCode,
            is_published: 1,
        });

        message_id = uuidv4();
        const message = await messageDao.create({
            uuid: message_id,
            society_id: GB_society_id,
            region_id: regionId,
            language_code: languageCode,
            content_type: contentTypes.AIR,
            type: messageTypes.IMMEDIATE,
            content: 'test message',
        });

        auditId = uuidv4();
        const audit = await auditDao.create({
            uuid: auditId,
            society_id: GB_society_id,
            language_code: 'EN', 
            user_id: user.uuid,
            content_type: 'test',
            action: 'create',
            time: new Date(),
      });
    });

    afterAll(async () => {
        await regionDao.deleteByWhere({ region_name: "Test Region" });
        await languageDao.deleteByWhere({ uuid:languageId });
        await contentDao.deleteByWhere({region_id: regionId});
        await auditDao.deleteByWhere({user_id: uuid});
        await messageDao.deleteByWhere({ region_id: regionId});
        await tokenDao.deleteByWhere({ token });
        await tokenDao.deleteByWhere({ user_uuid: uuid });
        await tokenDao.deleteByWhere({ user_uuid: apiUserId });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userSocietyDao.deleteByWhere({ user_id: apiUserId, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userRoleDao.deleteByWhere({ user_id: apiUserId});
        await userDao.deleteByWhere({uuid: uuid });
        await userDao.deleteByWhere({uuid: apiUserId });
    });

    describe('POST /super/set_auth', () => {
        test('successfully sets authorization with valid data', async () => {
            const response = await request(app)
                .post('/api/super/set_auth')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_id: apiUserId,
                    role_id: 2
                });
            console.log('response', response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('code', 200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe('auth set');
        });
    
        test('returns 400 Bad Request when required data is missing', async () => {
            const response = await request(app)
                .post('/api/super/set_auth')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    // Missing required fields
                });
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('code', 400);
            expect(response.body.message).toEqual(expect.stringContaining("required"));
        });
    
        test('returns 401 Unauthorized when no token is provided', async () => {
            const response = await request(app)
                .post('/api/super/set_auth')
                .send({
                    user_id: apiUserId,
                    role_id: 4
                });
    
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe('Please authenticate');
        });
    });

    describe('POST /add_content', () => {
        test('adds content successfully', async () => {
            const response = await request(app)
              .post('/api/super/add_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: languageCode,
                region_id: regionId,
                content_type: "AIR_QUALITY",
                title: "AIR QUALITY test",
                description: "air quality test description",
                url: "https://example.com",
                messages: {
                  "RECOVER": ["test Msg 1", "test Msg 2"]
                }
              });
            
            console.log('response', response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body.code).toBe(201);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Content added successfully");
        });

        test('returns 400 for incomplete request data', async () => {
            const response = await request(app)
              .post('/api/super/add_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
                language_code: languageCode,
                region_id: regionId,
                content_type: "AIR_QUALITY",
                title: "AIR QUALITY test",
                description: "air quality test description",
                url: "https://example.com",
                messages: {
                  "RECOVER": ["test Msg 1", "test Msg 2"]
                }
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is require");
        });
          
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/super/add_content')
              // Not setting Authorization header
              .send({
                society_id: GB_society_id,
                language_code: languageCode,
                region_id: regionId,
                content_type: "AIR_QUALITY",
                title: "AIR QUALITY test",
                description: "air quality test description",
                url: "https://example.com",
                messages: {
                  "RECOVER": ["test Msg 1", "test Msg 2"]
                }
              });
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe('POST /get_content', () => {
        test('should successfully retrieve content with valid society_id and token', async () => {
            const response = await request(app)
              .post('/api/super/get_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("fetch content by society successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
        });
          

        test('should return 400 if society_id is missing', async () => {
            const response = await request(app)
              .post('/api/super/get_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
        });
          
        test('should return 401 if request is unauthorized', async () => {
            const response = await request(app)
              .post('/api/super/get_content')
              // Not setting Authorization header
              .send({
                society_id: GB_society_id,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe ("POST /update_content", () => {
        test('updates content successfully', async () => {
            const content = await contentDao.findByWhere({region_id: regionId});
            contentId = content[0].dataValues.uuid;
            const response = await request(app)
              .post('/api/super/update_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                uuid: contentId,
                title: "udpate title test",
                description: "udpate description test",
                url: "https://example.com/updated-content"
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("update content successfully");
            expect(response.body.data).toEqual(expect.any(Array));
            expect(response.body.data.length).toBeGreaterThan(0);
        });
        
        test('returns 400 for invalid or incomplete request data', async () => {
            const response = await request(app)
              .post('/api/super/update_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing uuid
                title: "udpate title test",
                description: "udpate description test",
                url: "https://example.com/updated-content"
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"uuid\" is required");
        });
        
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/super/update_content')
              // Not setting Authorization header
              .send({
                uuid: contentId,
                title: "udpate title test",
                description: "udpate description test",
                url: "https://example.com/updated-content"
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /delete_content", () => {
        test('deletes content successfully', async () => {
            const response = await request(app)
              .post('/api/super/delete_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                uuid: contentId,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Content deleted successfully");
            expect(response.body.data).toEqual({});
        });

        test('returns 400 for invalid or incomplete request data', async () => {
            const response = await request(app)
              .post('/api/super/delete_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // 'uuid' is missing
              });
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"uuid\" is required");
        });
        
        test('returns 401 for unauthorized delete request', async () => {
            const response = await request(app)
              .post('/api/super/delete_content')
              // missing Authorization header
              .send({
                uuid: contentId,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toMatch("Please authenticate");
        }); 
    });

    describe('POST /get_content_message', () => {
        test('should return 200 and content messages if request is valid', async () => {
            const response = await request(app)
            .post('/api/super/get_content_message')
            .set('Authorization', `Bearer ${token}`)
            .send({
                society_id: GB_society_id,
                language_code: languageCode,
                region_id: regionId,
                content_type: contentTypes.AIR,
            });
            console.log('response', response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("fetch messages successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
        
        test('should return 400 if required field is missing', async () => {
            const response = await request(app)
            .post('/api/super/get_content_message')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                    language_code: languageCode,
                    region_id: regionId,
                    content_type: contentTypes.AIR,
            });
        
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
        });

        test('should return 401 if token is missing', async () => {
            const response = await request(app)
                .post('/api/super/get_content_message')
                .send({
                    society_id: GB_society_id,
                    language_code: languageCode,
                    region_id: regionId,
                    content_type: contentTypes.AIR,
                });
        
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toMatch("Please authenticate");
        });
    });

    describe('POST /update_content_message', () => {
        test('should return 200 if request is valid', async () => {
            const updateData = {
                society_id: GB_society_id,
                language_code: languageCode,
                region_id: regionId,
                content_type: contentTypes.AIR,
                messages: {
                    'IMMEDIATE' : ['test immediate message'],
                    'RECOVER' : ['test recover message 1', 'test recover message 2'],
                }
            };
            console.log('updateData', updateData);
            const response = await request(app)
            .post('/api/super/update_content_message')
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);
            console.log('response', response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toEqual("Update content message successful");
            expect(response.body.data).toEqual({});
        });
        
        test('should return 400 if required field is missing', async () => {
            const response = await request(app)
            .post('/api/super/update_content_message')
            .set('Authorization', `Bearer ${token}`) 
            .send({
                    language_code: languageCode,
                    region_id: regionId,
                    content_type: contentTypes.AIR,
                    messages: {
                        'IMMEDIATE' : ['test immediate message'],
                        'RECOVER' : ['test recover message 1', 'test recover message 2'],
                    }
            });
        
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
        });

        test('should return 401 if token is missing', async () => {
            const response = await request(app)
                .post('/api/super/update_content_message')
                .send({
                    society_id: GB_society_id,
                    language_code: languageCode,
                    region_id: regionId,
                    content_type: contentTypes.AIR,
                    messages: {
                        'IMMEDIATE' : ['test immediate message'],
                        'RECOVER' : ['test recover message 1', 'test recover message 2'],
                    }
                });
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toMatch("Please authenticate");
        });
    });

    describe("POST /add_language", () => {
        test('adds language successfully', async () => {
            const response = await request(app)
              .post('/api/super/add_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: languageCode,
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
              .post('/api/super/add_language')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
                language_code: languageCode,
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
              .post('/api/super/add_language')
              // Not setting Authorization header
              .send({
                society_id: GB_society_id,
                language_code: languageCode,
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
              .post('/api/super/get_language')
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
              .post('/api/super/get_language')
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
              .post('/api/super/get_language')
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
              .post('/api/super/update_language')
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
              .post('/api/super/update_language')
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
              .post('/api/super/update_language')
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

    describe("POST /add_region", () => {
        test('adds a region successfully', async () => {
            const response = await request(app)
              .post('/api/super/add_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                region_name: 'Test Region',
                society_id: GB_society_id,
                description: 'A test region description',
                language_code: languageCode,
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
              .post('/api/super/add_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing region_name
                society_id: GB_society_id,
                description: 'A test region description',
                language_code: languageCode,
                is_published: false,
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toContain("\"region_name\" is required");
        });

        test('returns 401 for unauthorized access', async () => {
            const response = await request(app)
              .post('/api/super/add_region')
              // Missing Authorization header
              .send({
                region_name: 'Test Region',
                society_id: GB_society_id,
                description: 'A test region description',
                language_code: languageCode,
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
              .post('/api/super/get_region')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: languageCode
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.code).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Region fetched successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        
        test('returns 400 for invalid request parameters', async () => {
            const response = await request(app)
              .post('/api/super/get_region')
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
              .post('/api/super/get_region')
              // Missing Authorization header
              .send({
                society_id: GB_society_id,
                language_code: languageCode
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe("POST /update_region", () => {
        test('updates a region successfully', async () => {
            const response = await request(app)
              .post('/api/super/update_region')
              .set('Authorization', `Bearer ${token}`)
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
              .post('/api/super/update_region')
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
              .post('/api/super/update_region')
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
              .post('/api/super/delete_region')
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
              .post('/api/super/delete_region')
              .set('Authorization', `Bearer ${token}`)
              .send({});
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toBe("\"uuid\" is required");
        });
        
        test('returns 401 for unauthorized deletion attempt', async () => {
            const response = await request(app)
              .post('/api/super/delete_region')
              .send({
                uuid: regionId,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe('POST /add_society', () => {
        test('Successfully adds a society with valid data', async () => {
            const response = await request(app)
                .post('/api/super/add_society')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    society_name: 'New Society',
                    country_code: 'TEST',
                    url: 'https://example.com',
                    image_url: 'https://example.com/image.jpg',
                });

            console.log('response', response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body.response.message).toBe('Society Created');
            expect(response.body.response.data).toHaveProperty('society_name', 'New Society');
            society_id = response.body.response.data.uuid;
            console.log('society_id', society_id);
        });
    
        test('Returns a 400 error when society_name is missing', async () => {
            const response = await request(app)
                .post('/api/super/add_society')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('\"society_name\" is required');
        });
    
        test('Returns a 401 error when not authorized', async () => {
            const response = await request(app)
                .post('/api/super/add_society')
                .send({
                    society_name: 'New Society',
                    country_code: 'TEST',
                    url: 'https://example.com',
                    image_url: 'https://example.com/image.jpg',
                });
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Please authenticate');
        });
    });

    describe('POST /get_society', () => {
        test('Successfully retrieves all societies', async () => {
            const response = await request(app)
              .post('/api/super/get_society')
              .set('Authorization', `Bearer ${token}`);
        
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("get all societies successfully");
            expect(response.body.data).toBeInstanceOf(Array);
        });
        
        test('Returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/super/get_society'); // No Authorization header
        
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe('POST /update_society', () => {
        test('Successfully updates a society with valid data', async () => {
            const response = await request(app)
                .post('/api/super/update_society')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    uuid: society_id,
                    url: 'https://update.com',
                    image_url: 'https://example.com/image.jpg',
                });
            expect(response.statusCode).toBe(200);
            expect(response.body.response.status).toBe(true);
            expect(response.body.response.message).toBe('Society Updated');
            expect(response.body.response.data).toEqual(expect.arrayContaining([1])); 
        });
    
        test('Returns a 400 error when uuid is missing', async () => {
            const response = await request(app)
                .post('/api/super/update_society')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    society_name: 'Updated Society Name'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('\"uuid\" is required');
        });
    
        test('Returns a 401 error when not authorized', async () => {
            const response = await request(app)
                .post('/api/super/update_society')
                .send({
                    uuid: society_id,
                    society_name: 'Updated Society Name'
                });
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Please authenticate');
        });
    });

    describe('POST /delete_society', () => {
        test('Successfully deletes a society', async () => {
            const response = await request(app)
                .post('/api/super/delete_society')
                .set('Authorization', `Bearer ${token}`)
                .send({ uuid: society_id });
            expect(response.statusCode).toBe(200);
            expect(response.body.statusCode).toBe(200);
            expect(response.body.response.message).toBe('Society Deleted');
            expect(response.body.response.data).toBe(1);
        });
    
        test('Returns a 400 error when uuid is missing', async () => {
            const response = await request(app)
                .post('/api/super/delete_society')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('"uuid" is required');
        });
    
        test('Returns a 401 error when not authorized', async () => {
            const response = await request(app)
                .post('/api/super/delete_society')
                .send({ uuid: society_id });
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Please authenticate');
        });
    });

    describe('POST /get_audit_log', () => {
        test('should return audit logs successfully', async () => {
            const response = await request(app)
                .post('/api/super/get_audit_log')
                .set('Authorization', `Bearer ${token}`) 
                .send({ society_ids: [GB_society_id] });
            console.log('response', response.body);
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("fetch audit-logs successfully!");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });
});