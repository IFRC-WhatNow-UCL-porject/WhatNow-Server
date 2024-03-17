const cron = require('node-cron');
const TokenService = require('./service/TokenService');
// schedule tasks to be run on the server
cron.schedule('* * * * *', () => {
    console.log('Server is still running...');

    // remove expired tokens
    const tokenService = new TokenService();
    tokenService.cleanExpiredTokens();
});
