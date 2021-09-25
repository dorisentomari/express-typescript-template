import os from 'os';
import fs from 'fs';
import crypto from 'crypto';
import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import killPort from 'kill-port';
import { addDateTime, DateTypeEnum, isPlainObject, formatDateTime } from 'easybus';
import { StatusCodes } from 'http-status-codes';
import { AxiosError } from 'axios';
import { isArray, ValidationError } from 'class-validator';

import logger from '~src/helper/logger';
import paths from '~src/helper/paths';
import { IJwtSign } from '~src/modules/user/user.types';
import { IErrorResponse } from '~src/types/http.types';
import { ILayerRoute, IRouteSet } from '~src/types/express.types';

export function getIPAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const key in interfaces) {
    const iface = interfaces[key];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1') {
        return alias.address;
      }
    }
  }
}

export function hashPassword(password: string): string {
  return crypto
    .createHash('md5')
    .update(password)
    .update(process.env.PASSWORD_SALT)
    .digest('hex');
}

export function generateJwtToken(user: any, secret: string, options?: SignOptions): IJwtSign {
  const newOptions: SignOptions = {
    algorithm: 'HS256',
    ...options,
  };
  const currentTime = new Date();
  const iat = +new Date(addDateTime(currentTime, DateTypeEnum.SECONDS, -30));
  const exp = +new Date(addDateTime(currentTime, DateTypeEnum.HOURS, 2));
  const token = jwt.sign({ user, iat, exp }, secret, newOptions);
  return { token, user, iat, exp };
}

export function verifyJwtToken(token: string, secret: string): IJwtSign | null {
  try {
    const result = jwt.verify(token, secret);
    if (result) {
      return result as IJwtSign;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function killPort(port: number) {
  return await killPort(port);
}

export function transformToPlainObject(obj: any) {
  const result: any = {};
  if (isPlainObject(obj)) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

export function forEach(obj: Record<any, any> | Array<any>, cb = (...args): void => {}) {
  if (isPlainObject(obj)) {
    Object.keys(obj).forEach((item, index) => {
      cb(item, index, obj[item]);
    });
  } else if (isArray(obj)) {
    obj.forEach((item, index) => {
      cb(item, index);
    });
  }
}

export function parseValidateErrors(res: Response, errors: Array<ValidationError>): IErrorResponse {
  const errorMessage = {};
  errors.forEach((error: ValidationError) => {
    const key = error.property;
    errorMessage[key] = Object.values(error.constraints);
  });
  const { method, path, hostname, query, body } = res.req;
  return {
    method,
    path,
    hostname,
    error: errorMessage,
    status: StatusCodes.BAD_REQUEST,
    time: formatDateTime(new Date()),
    query,
    body,
  };
}

export function cutObjectExtraProperties(source: object = {}, target: object = {}) {
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      if (!source.hasOwnProperty(key)) {
        delete target[key];
      }
    }
  }
}

export async function parseAxiosError(error: AxiosError) {
  delete error.request;
  const time = formatDateTime();
  const fileName = `${time}-axios-error.json`;
  await fs.writeFileSync(`${paths.appLog}/${fileName}`, JSON.stringify(error));
  logger.axios(`Record Axios Error Success. Written File ${fileName}`);
}

export function parseExpressLayerRoute(route: ILayerRoute): Array<IRouteSet> {
  const arr: Array<IRouteSet> = [];
  const path = route.path;
  const methods = route.methods;

  forEach(methods, method => {
    arr.push({ path, method });
  });
  return arr;
}
