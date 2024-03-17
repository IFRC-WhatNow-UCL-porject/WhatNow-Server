const SuperDao = require('./SuperDao');
const models = require('../models');

const Token = models.token;

class TokenDao extends SuperDao {
    constructor() {
        super(Token);
    }

    async findOne(where) {
        try {
            return await Token.findOne({ where });
        } catch (error) {
            throw error;
        }
    }

    async remove(where) {
        try {
            return await Token.destroy({ where });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TokenDao;
