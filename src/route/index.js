const express = require('express');
const authRoute = require('./authRoute');
const superRoute = require('./superRoute');

const messagesRoute = require('./messagesRoute');
const auditLogRoute = require('./auditLogRoute')
const bulkUploadRoute = require('./bulkUploadRoute')
const contentMessageRoute = require('./contentMessageRoute')
const contentRoute = require('./contentRoute')
const languageRoute = require('./languageRoute')
const publishRoute = require('./publishRoute')
const regionRoute = require('./regionRoute')
const societyRoute = require('./societyRoute')
const profileRoute = require('./profileRoute');
const apiRoute = require('./apiRoute');
const apiUserRoute = require('./apiUserRoute');
const userRoute = require('./userRoute');
const termRoute = require('./termRoute');
const appRoute = require('./appRoute');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/super',
        route: superRoute,
    },
    {
        path: '/messages',
        route: messagesRoute,
    },
    {
        path: '/auditLog',
        route: auditLogRoute,
    },
    {
        path: '/bulkUpload',
        route: bulkUploadRoute,
    },
    {
        path: '/contentMessage',
        route: contentMessageRoute,
    },
    {
        path: '/content',
        route: contentRoute,
    },
    {
        path: '/language',
        route: languageRoute,
    },
    {
        path: '/publish',
        route: publishRoute,
    },
    {
        path: '/region',
        route: regionRoute,
    },
    {
        path: '/society',
        route: societyRoute,
    },
    {
        path: '/profile',
        route: profileRoute,
    },
    {
        path: '/apps',
        route: apiRoute,
    },
    {
        path: '/apiUsers',
        route: apiUserRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/term',
        route: termRoute,
    },
    {
        path: '/app',
        route: appRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
