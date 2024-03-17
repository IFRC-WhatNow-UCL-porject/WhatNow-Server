const SuperDao = require('./SuperDao');
const models = require('../models');

const ApiUser = models.api_user;

class ApiUserDao extends SuperDao {
    constructor() {
        super(ApiUser);
    }

    createApiUser = async (data) => {
        try {
            const result = await this.Model.create(data);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email) {
        return ApiUser.findOne({ where: { email } });
    }

    async isEmailExists(email) {
        return ApiUser.count({ where: { email } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async getUserById(uuid) {
        return ApiUser.findOne({ where: { uuid } });
    }
}

module.exports = ApiUserDao;