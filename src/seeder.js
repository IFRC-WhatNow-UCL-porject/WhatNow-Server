const db = require('./models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { userConstant, language_code, userRoles } = require('./config/constant');
const societyCode = require('./config/societyCode');

const super_admin_uuid = uuidv4();
const gdpc_admin_uuid = uuidv4();
const ns_admin_uuid = uuidv4();
const ns_editor_uuid = uuidv4();
const api_user_uuid = uuidv4();
const reviewer_uuid = uuidv4();

const society_uuid_list = [];

function generateSocietyUUID() {
    for (let i = 0; i < societyCode.length; i++) {
        society_uuid_list.push({
            uuid: uuidv4(),
            society_name: societyCode[i][1],
            country_code: societyCode[i][0],
        });
    }
}

async function seedSociety() {
    try {
        generateSocietyUUID();
        for (let i = 0; i < society_uuid_list.length; i++) {
            const society = await db.society.findOne({ where: { society_name: society_uuid_list[i].society_name } });
            if (society) {
                console.log('society already exists');
                return;
            } else {
                await db.society.create({
                    uuid: society_uuid_list[i].uuid,
                    society_name: society_uuid_list[i].society_name,
                    country_code: society_uuid_list[i].country_code
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function seedUser() {
    try {
        const super_user = await db.user.findOne({ where: { email: 'super_admin@dev.com' } });
        if (super_user) {
            console.log('super user already exists');
            return;
        } else {
            const hashedPassword = await bcrypt.hash('1234567890987654321', 10);
            await db.user.create({
                uuid: super_admin_uuid,
                email: 'super_admin@dev.com',
                password: hashedPassword,
                first_name: 'Super',
                last_name: 'Admin',
                status: userConstant.STATUS_ACTIVE,
                email_verified: userConstant.EMAIL_VERIFIED_TRUE,
            })
        }
        const gdpc_admin = await db.user.findOne({ where: { email: 'gdpc_admin@dev.com' } });
        if (gdpc_admin) {
            console.log('test admin already exists');
            return;
        } else {
            const hashedPassword = await bcrypt.hash('1234567890987654321', 10);
            await db.user.create({
                uuid: gdpc_admin_uuid,
                email: 'gdpc_admin@dev.com',
                password: hashedPassword,
                first_name: 'Test',
                last_name: 'Admin',
                status: userConstant.STATUS_ACTIVE,
                email_verified: userConstant.EMAIL_VERIFIED_TRUE,
            })
        }
        const ns_admin = await db.user.findOne({ where: { email: 'ns_admin@dev.com' } });
        if (ns_admin) {
            console.log('test admin already exists');
            return;
        } else {
            const hashedPassword = await bcrypt.hash('1234567890987654321', 10);
            await db.user.create({
                uuid: ns_admin_uuid,
                email: 'ns_admin@dev.com',
                password: hashedPassword,
                first_name: 'NS',
                last_name: 'Admin',
                status: userConstant.STATUS_ACTIVE,
                email_verified: userConstant.EMAIL_VERIFIED_TRUE,
            })
        }
        const ns_editor = await db.user.findOne({ where: { email: 'ns_editor@dev.com' } });
        if (ns_editor) {
            console.log('test admin already exists');
            return;
        } else {
            const hashedPassword = await bcrypt.hash('1234567890987654321', 10);
            await db.user.create({
                uuid: ns_editor_uuid,
                email: 'ns_editor@dev.com',
                password: hashedPassword,
                first_name: 'NS',
                last_name: 'Editor',
                status: userConstant.STATUS_ACTIVE,
                email_verified: userConstant.EMAIL_VERIFIED_TRUE,
            })
        }
        const api_user = await db.user.findOne({ where: { email: 'api_user@dev.com' } });
        if (api_user) {
            console.log('test admin already exists');
            return;
        } else {
            const hashedPassword = await bcrypt.hash('1234567890987654321', 10);
            await db.user.create({
                uuid: api_user_uuid,
                email: 'api_user@dev.com',
                password: hashedPassword,
                first_name: 'API',
                last_name: 'User',
                status: userConstant.STATUS_ACTIVE,
                email_verified: userConstant.EMAIL_VERIFIED_TRUE,
            })
        }
        const reviewer = await db.user.findOne({ where: { email: 'reviewer@dev.com' } });
        if (reviewer) {
            console.log('test admin already exists');
            return;
        } else {
            const hashedPassword = await bcrypt.hash('1234567890987654321', 10);
            await db.user.create({
                uuid: reviewer_uuid,
                email: 'reviewer@dev.com',
                password: hashedPassword,
                first_name: 'Reviewer',
                last_name: 'User',
                status: userConstant.STATUS_ACTIVE,
                email_verified: userConstant.EMAIL_VERIFIED_TRUE,
            })
        }
    } catch (error) {
        console.log(error);
    }
}

async function seedUserRoles() {
    try {
        const super_admin_role = await db.user_role.findOne({ where: { user_id: super_admin_uuid } });
        if (super_admin_role) {
            console.log('super admin role already exists');
            return;
        } else {
            await db.user_role.create({
                user_id: super_admin_uuid,
                role_id: userRoles.SUPER_ADMIN
            })
        }
        const gdpc_admin_role = await db.user_role.findOne({ where: { user_id: gdpc_admin_uuid } });
        if (gdpc_admin_role) {
            console.log('test admin role already exists');
            return;
        } else {
            await db.user_role.create({
                user_id: gdpc_admin_uuid,
                role_id: userRoles.GDPC_ADMIN
            })
        }
        const ns_admin_role = await db.user_role.findOne({ where: { user_id: ns_admin_uuid } });
        if (ns_admin_role) {
            console.log('test admin role already exists');
            return;
        } else {
            await db.user_role.create({
                user_id: ns_admin_uuid,
                role_id: userRoles.NS_ADMIN
            })
        }
        const ns_editor_role = await db.user_role.findOne({ where: { user_id: ns_editor_uuid } });
        if (ns_editor_role) {
            console.log('test admin role already exists');
            return;
        } else {
            await db.user_role.create({
                user_id: ns_editor_uuid,
                role_id: userRoles.NS_EDITOR
            })
        }
        const api_user_role = await db.user_role.findOne({ where: { user_id: api_user_uuid } });
        if (api_user_role) {
            console.log('test admin role already exists');
            return;
        } else {
            await db.user_role.create({
                user_id: api_user_uuid,
                role_id: userRoles.API_USER
            })
        }
        const reviewer_role = await db.user_role.findOne({ where: { user_id: reviewer_uuid } });
        if (reviewer_role) {
            console.log('test admin role already exists');
            return;
        } else {
            await db.user_role.create({
                user_id: reviewer_uuid,
                role_id: userRoles.REVIEWER
            })
        }
    } catch (error) {
        console.log(error);
    }
}

async function seedSocietyUser() {
    try {
        const society_user2 = await db.user_society.findOne({ where: { user_id: gdpc_admin_uuid } });
        if (society_user2) {
            console.log('society user already exists');
            return;
        } else {
            for (let i = 0; i < society_uuid_list.length; i++) {
                await db.user_society.create({
                    user_id: gdpc_admin_uuid,
                    society_id: society_uuid_list[i].uuid
                })
            }
        }
        const society_user3 = await db.user_society.findOne({ where: { user_id: ns_admin_uuid } });
        if (society_user3) {
            console.log('society user already exists');
            return;
        } else {
            await db.user_society.create({
                user_id: ns_admin_uuid,
                society_id: society_uuid_list[0].uuid
            })
        }
        const society_user4 = await db.user_society.findOne({ where: { user_id: ns_editor_uuid } });
        if (society_user4) {
            console.log('society user already exists');
            return;
        } else {
            await db.user_society.create({
                user_id: ns_editor_uuid,
                society_id: society_uuid_list[0].uuid
            })
        }
        const society_user5 = await db.user_society.findOne({ where: { user_id: api_user_uuid } });
        if (society_user5) {
            console.log('society user already exists');
            return;
        } else {
            await db.user_society.create({
                user_id: api_user_uuid,
                society_id: society_uuid_list[0].uuid
            })
        }
        const society_user6 = await db.user_society.findOne({ where: { user_id: reviewer_uuid } });
        if (society_user6) {
            console.log('society user already exists');
            return;
        } else {
            await db.user_society.create({
                user_id: reviewer_uuid,
                society_id: society_uuid_list[0].uuid
            })
        }
    } catch (error) {
        console.log(error);
    }
}

async function seed() {
    await seedSociety();
    await seedUser();
    await seedUserRoles();
    await seedSocietyUser();
}

module.exports = seed;