const winston = require('winston');
const { combine } = winston.format;
require('winston-mongodb');
require('dotenv').config();

const _logger = winston.createLogger({
    level: 'info',
    format: combine(
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
      winston.format.metadata()
    ),
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.MongoDB({
        levels: ['info', 'error', 'warn'],
        //mongo database connection link
        db : process.env.MONGODB_URI.replace('password', encodeURIComponent(process.env.MONGODB_PASSWORD)),
        options: {
            useUnifiedTopology: true
        },
        // A collection to save json formatted logs
        collection: 'logs'
      })
    ],
  });
   
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    _logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
}

const createLog = (level, message, req) => {
  let method, ip, browser, url, user, requestId;
  if(req){
    method = req.method;
    ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    browser = req.headers['user-agent'];
    url = req.originalUrl;
    user = !req.user? undefined : req.user.email;
    requestId = req.id === undefined ? undefined : req.id;
  }
  _logger.log({level, ip, browser, method, url, user, message, requestId})
}

module.exports = {createLog}