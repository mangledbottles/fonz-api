var winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch'),
    crypto = require('crypto');

// Give ourselves a randomized (time-based) hash to append to our stream name
// so multiple instances of the server running don't log to the same
// date-separated stream.
var startTime = new Date().toISOString();

winston.loggers.add('access-log', {
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
      level: 'info'
    }),
    new WinstonCloudWatch({
      logGroupName: 'Fonz-API-Log',
      logStreamName: function() {
        // Spread log streams across dates as the server stays up
        let date = new Date().toISOString().split('T')[0];
        return 'Fonz-API-' + date + '-' +
          crypto.createHash('md5')
          .update(startTime)
          .digest('hex');
      },
      awsRegion: 'eu-west-1',
      jsonMessage: true,
      awsOptions: {
        accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
      },
    })
  ]
});

const logg = winston.loggers.get('access-log');

module.exports = logg;
