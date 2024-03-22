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
const { v4: uuidv4 } = require('uuid');

describe('/api/content', () => {
    let token, regionId, contentId, languageCode = 'EN', uuid, GB_society_id;

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
        
        regionId = uuidv4();
        const region = await regionDao.create({ 
            uuid: regionId,
            region_name: 'Test Region',
            society_id: GB_society_id,
            description: 'A test region description',
            language_code: 'EN',
            is_published: 1,
        });    
    });

    afterAll(async () => {
        await contentDao.deleteByWhere({region_id: regionId});
        await auditDao.deleteByWhere({user_id: uuid});
        await messageDao.deleteByWhere({ region_id: regionId});
        await tokenDao.deleteByWhere({ token });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
        await regionDao.deleteByWhere({ uuid: regionId });
    });

    describe('POST /add_content', () => {
        test('adds content successfully', async () => {
            const response = await request(app)
              .post('/api/content/add_content')
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
              .post('/api/content/add_content')
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
              .post('/api/content/add_content')
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

    describe('POST /init_content', () => {
        test('initializes content successfully', async () => {
            const response = await request(app)
              .post('/api/content/init_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: "ZH",
                region_id: regionId,
              });
          
            expect(response.statusCode).toBe(201);
            expect(response.body.code).toBe(201);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("Content initialized successfully");
          });

          test('returns 400 for incomplete request data', async () => {
            const response = await request(app)
              .post('/api/content/init_content')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
                language_code: "ZH",
                region_id: regionId,
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
          });

          test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/content/init_content')
              // Not setting Authorization header
              .send({
                society_id: GB_society_id,
                language_code: "ZH",
                region_id: regionId
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
          });
    });

    describe('POST /get_content', () => {
        test('should successfully retrieve content with valid society_id and token', async () => {
            const response = await request(app)
              .post('/api/content/get_content')
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
              .post('/api/content/get_content')
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
              .post('/api/content/get_content')
              // Not setting Authorization header
              .send({
                society_id: GB_society_id,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
          });
    });

    describe("POST /get_content_by_id", () => {
        test('fetches content by id successfully', async () => {

            const content = await contentDao.findByWhere({region_id: regionId});
            contentId = content[0].dataValues.uuid;

            const response = await request(app)
              .post('/api/content/get_content_by_id')
              .set('Authorization', `Bearer ${token}`)
              .send({
                uuid: contentId,
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("fetch content by id successfully");
            expect(response.body.data).toBeDefined();
        });

        test('returns 400 for incomplete request data', async () => {
            const response = await request(app)
              .post('/api/content/get_content_by_id')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing uuid
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"uuid\" is required");
        });

        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/content/get_content_by_id')
              // Not setting Authorization header
              .send({
                uuid: contentId,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });     
    });

    describe('POST /get_contentIds', () => {
        test('retrieves content IDs successfully', async () => {
            const response = await request(app)
              .post('/api/content/get_contentIds')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: languageCode,
                region_id: regionId
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("fetch content ids successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        test('returns 400 for invalid or incomplete request data', async () => {
            const response = await request(app)
              .post('/api/content/get_contentIds')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
                language_code: languageCode,
                region_id: regionId
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
        });
        
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/content/get_contentIds')
              // Not setting Authorization header
              .send({
                society_id: GB_society_id,
                language_code: languageCode,
                region_id: regionId
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
    });

    describe ("POST /update_content", () => {
        test('updates content successfully', async () => {
            const response = await request(app)
              .post('/api/content/update_content')
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
              .post('/api/content/update_content')
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
              .post('/api/content/update_content')
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

    describe("POST /get_existed_content_types", () => {
        test('retrieves content types successfully', async () => {
            const response = await request(app)
              .post('/api/content/get_existed_content_type')
              .set('Authorization', `Bearer ${token}`)
              .send({
                society_id: GB_society_id,
                language_code: languageCode,
                region_id: regionId
              });
          
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe(true);
            expect(response.body.message).toBe("fetch content type successfully");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toContain("AIR_QUALITY");
        });
        
        test('returns 400 for invalid or incomplete request data', async () => {
            const response = await request(app)
              .post('/api/content/get_existed_content_type')
              .set('Authorization', `Bearer ${token}`)
              .send({
                // missing society_id
                language_code: languageCode,
                region_id: regionId
              });
          
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe(400);
            expect(response.body.message).toMatch("\"society_id\" is required");
        });
        
        test('returns 401 for unauthorized requests', async () => {
            const response = await request(app)
              .post('/api/content/get_existed_content_type')
              // Not setting Authorization header
              .send({
                society_id: GB_society_id,
                language_code: languageCode,
                region_id: regionId
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toBe("Please authenticate");
        });
          
    });

    describe("POST /delete_content", () => {
        test('deletes content successfully', async () => {
            const response = await request(app)
              .post('/api/content/delete_content')
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
              .post('/api/content/delete_content')
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
              .post('/api/content/delete_content')
              // missing Authorization header
              .send({
                uuid: contentId,
              });
          
            expect(response.statusCode).toBe(401);
            expect(response.body.code).toBe(401);
            expect(response.body.message).toMatch("Please authenticate");
          });
          
    });
});