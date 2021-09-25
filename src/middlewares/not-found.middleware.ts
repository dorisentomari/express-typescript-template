import { Request, Response } from 'express';
import { formatDateTime } from 'easybus';

import { RESPONSE_CODE } from '~src/config/response-code.config';
import { IErrorResponse } from '~src/types/http.types';

export default function notFoundMiddleware(req: Request, res: Response) {
  const { method, path, hostname, query, body } = req;

  const response: IErrorResponse = {
    method,
    hostname,
    path,
    status: RESPONSE_CODE.NOT_FOUND.status,
    time: formatDateTime(),
    error: RESPONSE_CODE.NOT_FOUND.phraseCn,
    query,
    body,
  };

  res.status(response.status).json(response);
}
