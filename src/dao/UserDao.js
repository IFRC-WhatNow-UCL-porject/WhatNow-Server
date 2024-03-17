const SuperDao = require('./SuperDao');
const models = require('../models');

const User = models.user;

class UserDao extends SuperDao {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        try {
            const user = await User.findOne({ where: { email } });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async isEmailExists(email) {
        try {
            const count = await User.count({ where: { email } });
            return count !== 0;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(uuid) {
        try {
            const user = await User.findOne({ where: { uuid } });
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserDao;
