const SuperDao = require('./SuperDao');
const models = require('../models');

const UserRole = models.user_role;

class UserRoleDao extends SuperDao {
    constructor() {
        super(UserRole);
    }

    async checkUserRole(user_id) {
        try {
            const userRole = await UserRole.findOne({
                where: {
                    user_id,
                },
            });
            return userRole;
        } catch (error) {
            throw error;
        }
    }

    async createAuth(user_id, role_id) {
        try {
            const userRole = await UserRole.create({
                user_id,
                role_id,
            });
            return userRole;
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const userRoles = await UserRole.findAll();
            return userRoles;
        } catch (error) {
            throw error;
        }
    }

    async updateByWhere(where, data) {
        try {
            const userRole = await UserRole.update(data, {
                where,
            });
            return userRole;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = UserRoleDao;