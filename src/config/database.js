const config = require('./config');

module.exports = {
    development: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
        // ssl: true,
        // dialectOptions: { ssl: { require: true } }
    },
    test: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
        // ssl: true,
        // dialectOptions: { ssl: { require: true } }
    },
    production: {
        username: config.productionDbHost,
        password: config.productionDbPass,
        database: config.productionDbName,
        host: config.productionDbHost,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
        // ssl: true,
        // dialectOptions: { ssl: { require: true } }
    },
};
