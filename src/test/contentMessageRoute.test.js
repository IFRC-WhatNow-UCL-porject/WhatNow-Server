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
const auditDao = new AuditDao();
const tokenService = new TokenService();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const regionDao = new RegionDao();
const messageDao = new MessageDao();
const { contentTypes, messageTypes } = require('../config/constant');
const { v4: uuidv4 } = require('uuid');

describe('/api/contentMessage', () => {
    let token, regionId, languageCode = 'EN', uuid, GB_society_id, message_id;

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
            language_code: languageCode,
            content_type: contentTypes.AIR,
            type: messageTypes.IMMEDIATE,
            content: 'test message',
        });    
    });

    afterAll(async () => {
        await auditDao.deleteByWhere({user_id: uuid});
        await messageDao.deleteByWhere({ region_id: regionId});
        await tokenDao.deleteByWhere({ token });
        await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
        await userRoleDao.deleteByWhere({ user_id: uuid});
        await userDao.deleteByWhere({uuid: uuid });
        await regionDao.deleteByWhere({ uuid: regionId });
    });

    describe('POST /get_content_message', () => {
        test('should return 200 and content messages if request is valid', async () => {
            const response = await request(app)
            .post('/api/contentMessage/get_content_message')
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
            .post('/api/contentMessage/get_content_message')
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
                .post('/api/contentMessage/get_content_message')
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
            .post('/api/contentMessage/update_content_message')
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
            .post('/api/contentMessage/update_content_message')
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
                .post('/api/contentMessage/update_content_message')
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
});