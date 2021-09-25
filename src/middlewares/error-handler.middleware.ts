import { NextFunction, Request, Response } from 'express';
import { formatDateTime } from 'easybus';

import { RESPONSE_CODE } from '~src/config/response-code.config';
import { IErrorResponse } from '~src/types/http.types';

const { SERVER_ERROR } = RESPONSE_CODE;

export default function errorHandlerMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
  console.log(error);
  const { method, path, hostname, query, body } = req;
  const response: IErrorResponse = {
    method,
    hostname,
    path,
    status: SERVER_ERROR.status,
    time: formatDateTime(),
    error: SERVER_ERROR.phraseCn,
    query,
    body,
  };
  res.status(response.status).json(response);
}
