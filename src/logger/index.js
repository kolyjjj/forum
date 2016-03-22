'use strict';

import winston from 'winston';

const logger = new (winston.Logger)({
  level: 'debug',
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'app.log' })
  ]}
  );

export default logger;
