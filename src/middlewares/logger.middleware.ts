import winston from 'winston';
import path from 'path';
import expressWinston from 'express-winston';
import moment from 'moment';

import paths, { generateLogFile } from '~src/helper/paths';

const currentDay = moment(new Date()).format('YYYY-MM-DD-HH');
const normalFileName = `${currentDay}-normal.log`;
const errorFileName = `${currentDay}-error.log`;

const loggerMiddleware = {
  normalLogger: expressWinston.logger({
    transports: [

      new winston.transports.File({
        level: 'info',
        handleExceptions: true,
        maxsize: 5242880,
        filename: generateLogFile(normalFileName),
      }),

      new winston.transports.Console({
        level: 'info',
      }),
    ],
    meta: false,
    msg: 'HTTP {{ req.method }} {{ req.url }}',
    expressFormat: true,
    colorize: true,
    ignoreRoute: () => false,
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  }),

  errorLogger: expressWinston.errorLogger({

    transports: [
      new winston.transports.File({
        dirname: paths.appLog,
        filename: generateLogFile(errorFileName),
      }),

    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),

  }),
};

export default loggerMiddleware;
