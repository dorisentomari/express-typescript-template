import '~src/helper/initEnv';

import path from 'path';
import express from 'express';
import 'express-async-errors';
import { parseToNumber } from 'easybus';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { Severity } from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import { App } from '~src/app';
import { killPort } from '~src/helper/utils';
import GLOBAL_CONFIG from '~src/config/global.config';
import connectMongoDB from '~src/mongodb';

import logger from '~src/helper/logger';
import UserController from '~src/modules/user/user.controller';
import errorHandlerMiddleware from '~src/middlewares/error-handler.middleware';
import loggerMiddleware from '~src/middlewares/logger.middleware';
import notFoundMiddleware from '~src/middlewares/not-found.middleware';
import paths from '~src/helper/paths';

async function bootstrap() {
  const port = parseToNumber(process.env.PORT || GLOBAL_CONFIG.PORT);

  await killPort(port);

  logger.watch(`had kill port ${port}`);

  await connectMongoDB();

  const server = new App([new UserController()]);

  const app = server.app;

  app.use(loggerMiddleware.normalLogger);

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE');
    if (req.method === 'OPTIONS') {
      return res.end();
    }
    next();
  });

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
    tracesSampleRate: 1.0,
  });

  Sentry.configureScope(scope => {
    scope.setLevel(Severity.Warning);
  });

  app.use(morgan(GLOBAL_CONFIG.MORGAN_FORMAT));

  app.use(express.static(paths.appPublic));

  app.use(express.static(paths.appAssets));

  app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: 'none' }));

  app.use(helmet.hidePoweredBy());

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(Sentry.Handlers.requestHandler());

  app.use(Sentry.Handlers.tracingHandler());

  server.initControllers();

  app.use(notFoundMiddleware);

  app.use(Sentry.Handlers.errorHandler());

  app.use(errorHandlerMiddleware);

  app.use(loggerMiddleware.errorLogger);

  await server.listen();
}

bootstrap();

process.on('unhandledRejection', error => {
  console.log('unhandledRejection');
  console.log(error);
  bootstrap();
});

process.on('uncaughtException', async error => {
  console.log('uncaughtException');
  console.log(error);
  bootstrap();
});
