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
const tokenService = new TokenService();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const regionDao = new RegionDao();
const { v4: uuidv4 } = require('uuid');

describe('/api/bulkUpload', () => {
  let token;
  let uuid;
  let regionId;
  let GB_society_id;
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
  });

  afterAll(async () => {
      await tokenDao.deleteByWhere({ token });
      await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });
      await userRoleDao.deleteByWhere({ user_id: uuid});
      await userDao.deleteByWhere({uuid: uuid });
      await regionDao.deleteByWhere({ uuid: regionId });
  });
  describe('POST /is_content_init', () => {
    test('should check content initialization status successfully', async () => {
      const response = await request(app)
        .post('/api/bulkUpload/is_content_init')
        .set('Authorization', `Bearer ${token}`)
        .send({
          society_id: GB_society_id,
          language_code: 'EN',
          region_id: regionId,
        });
      console.log('response', response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe("fetch content status success");
      expect(response.body.data).toBe(true);
    });

    test('should return 400 if society does not exist', async () => {
      const requestBody = {
        society_id: "nonexistent-society-id",
        language_code: "EN",
        region_id: regionId,
      };
    
      const response = await request(app)
        .post('/api/bulkUpload/is_content_init')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);
    
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Society not exist");
    });

    test('should return 400 if region does not exist', async () => {
      const requestBody = {
        society_id: GB_society_id,
        language_code: "EN",
        region_id: "nonexistent-region-id"
      };
    
      const response = await request(app)
        .post('/api/bulkUpload/is_content_init')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);
    
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Region not exist");
    });

    test('should return 400 if language code does not exist', async () => {
      const requestBody = {
        society_id: GB_society_id,
        language_code: "Nonexistent Language Code",
        region_id: regionId
      };
    
      const response = await request(app)
        .post('/api/bulkUpload/is_content_init')
        .set('Authorization', `Bearer ${token}`)
        .send(requestBody);
    
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Language code not exist");
    });
    
    test('should return 401 if not authorized', async () => {
      const requestBody = {
        society_id: GB_society_id,
        language_code: "EN",
        region_id: regionId
      };
    
      const response = await request(app)
        .post('/api/bulkUpload/is_content_init')
        .send(requestBody);
    
      expect(response.statusCode).toBe(401);
      expect(response.body.code).toBe(401);
      expect(response.body.message).toMatch('Please authenticate');
    });
  });
});