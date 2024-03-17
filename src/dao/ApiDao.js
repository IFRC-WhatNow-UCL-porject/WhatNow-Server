const SuperDao = require('./SuperDao');
const models = require('../models');

const Api = models.api;

class ApiDao extends SuperDao {
    constructor() {
        super(Api);
    }
}

module.exports = ApiDao;