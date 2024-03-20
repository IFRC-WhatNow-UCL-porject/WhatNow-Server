const request = require('supertest');
const app = require('../app');
const UserDao = require('../dao/UserDao');
const TokenService = require('../service/TokenService');
const UserRoleDao = require('../dao/UserRoleDao');
const UserSocietyDao = require('../dao/UserSocietyDao');
const AuditDao = require('../dao/AuditDao');
const TokenDao = require('../dao/TokenDao');
const SocietyDao = require('../dao/SocietyDao');
const tokenService = new TokenService();
const auditDao = new AuditDao();
const userDao = new UserDao();
const userRoleDao = new UserRoleDao();
const userSocietyDao = new UserSocietyDao();
const tokenDao = new TokenDao();
const societyDao = new SocietyDao();
const { v4: uuidv4 } = require('uuid');

describe('POST /get_audit_log', () => {
  test('should return audit logs successfully', async () => {

    const uuid = uuidv4();
    const GB_society = await societyDao.findByWhere({country_code: 'GB'});
    console.log('GB_society', GB_society);
    const GB_society_id = GB_society[0].dataValues.uuid;
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

    const token = (await tokenService.generateAuthTokens(user, 'access')).token;
    console.log('token', token);

    const role = await userRoleDao.create({
        user_id: user.uuid,
        role_id: 5,
    });

    const society = await userSocietyDao.create({
        user_id: user.uuid,
        society_id: GB_society_id,
    });

    const audit = await auditDao.create({
        uuid: uuidv4(),
        society_id: GB_society_id,
        language_code: 'EN', 
        user_id: user.uuid,
        content_type: 'test',
        action: 'create',
        time: new Date(),
    });

    const response = await request(app)
      .post('/api/auditLog/get_audit_log')
      .set('Authorization', `Bearer ${token}`) 
      .send({ society_ids: [GB_society_id] });
    console.log('response', response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("fetch audit-logs successfully!");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    await auditDao.deleteByWhere({user_id: uuid, society_id: GB_society_id, language_code: 'EN' });

    await userSocietyDao.deleteByWhere({ user_id: uuid, society_id: GB_society_id });

    await userRoleDao.deleteByWhere({ user_id: uuid});

    await userDao.deleteByWhere({uuid: uuid });

    await tokenDao.deleteByWhere({ user_uuid: uuid });

  });
  
});
