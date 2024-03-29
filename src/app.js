const express = require('express');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const routes = require('./route');
const { jwtStrategy } = require('./config/passport');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const swaggerDefinition = require('./config/swaggerDef');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const seeder = require('./seeder');

process.env.PWD = process.cwd();

const app = express();

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.static(`${process.env.PWD}/public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

const options = {
    swaggerDefinition,
    apis: ['src/route/*.js'],
  };

// init swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// console.log(JSON.stringify(swaggerSpec, null, 2));

app.get('/', async (req, res) => {
    res.status(200).send('Congratulations! API is working!');
});
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

const db = require('./models');

db.sequelize.sync()
    .then(() => {
        console.log('Database connected');
        seeder();
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = app;
