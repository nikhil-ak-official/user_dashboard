const bunyan = require('bunyan')


const log = bunyan.createLogger({
    name: 'userLogger',
    streams: [
        {
            level: 'info',
            path: './logs/infoLogs.json'
        },
        {
            level: 'debug',
            path: './logs/debugLogs.json'
        },
        {
            level: 'error',
            path: './logs/errorLogs.json'
        }
    ]
});

module.exports = log