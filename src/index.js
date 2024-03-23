const app = require('./app');
const config = require('./config/config');

require('./cronJobs');
// eslint-disable-next-line import/order
const http = require('http');

server.listen(config.port, () => {
    console.log(`Server is listening to port ${config.port}`);
});
