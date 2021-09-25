import { Response } from 'express';
import { formatDateTime, isString } from 'easybus';

import { IErrorResponse, INormalResponse } from '~src/types/http.types';

export function normalResponse(res: Response, result: INormalResponse | any = {}, status = 200) {
  if (!result.pages) {
    result.pages = {};
  }

  if (!result.data) {
    result.data = null;
  }

  return res.status(status).json(result);
}

export function errorResponse(res: Response, errorResponse: IErrorResponse | string, status = 400) {
  let path = res.req.path;

  let result: IErrorResponse = {};

  if (isString(errorResponse)) {
    result.error = errorResponse as string;
    result.path = path;
    result.status = status;
    result.time = formatDateTime(new Date());
    return res.json(status).json(result);
  }

  if (!result.path) {
    result.path = path;
  }

  if (!result.error) {
    result.error = 'Request Error';
  }

  if (!result.time) {
    result.time = formatDateTime(new Date());
  }

  if (!result.status) {
    result.status = status;
  }

  return res.json(status).json(result);
}
