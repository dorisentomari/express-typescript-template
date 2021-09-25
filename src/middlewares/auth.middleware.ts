import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '~src/helper/logger';
import { errorResponse } from '~src/helper/unify-response';
import { verifyJwtToken } from '~src/helper/utils';
import { RESPONSE_CODE } from '~src/config/response-code.config';
import { IJwtSign } from '~src/modules/user/user.types';

const { UNAUTHORIZED } = StatusCodes;

const WHITE_AUTH_LIST = ['/api/v1/USER/register', '/api/v1/USER/login', '/api/v1/USER/validate-token'];

export default function authJwtMiddleware(req: Request, res: Response, next: NextFunction) {
  if (WHITE_AUTH_LIST.includes(req.path)) {
    return next();
  }

  const authorization = req.headers['authorization'];

  if (!authorization) {
    logger.error('no authorization');
    return errorResponse(res, RESPONSE_CODE.UNAUTHORIZED.phraseCn, UNAUTHORIZED);
  }

  const token: IJwtSign = verifyJwtToken(authorization, process.env.JWT_SECRET);

  if (!token) {
    logger.error('token parse failed');
    return errorResponse(res, RESPONSE_CODE.UNAUTHORIZED.phraseCn, UNAUTHORIZED);
  }

  // @ts-ignore
  if (!req.$server) {
    // @ts-ignore
    req.$server = {};
  }

  // @ts-ignore
  req.$server.user = token.user;

  next();
}
