export enum RES_CODE {
  OK = 'OK',
  ERROR = 'ERROR',
}

export enum HTTP_METHOD {
  OPTIONS = 'OPTIONS',
  HEAD = 'head',
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export interface IHttpResponse {
  code: RES_CODE;
  data?: any;
  status: number;
}

enum IResponseCode {
  SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  REDIS_ERROR,
}

export type IResponseCodeProps<T> = { [key in keyof typeof IResponseCode]: T };

export interface INormalResponse {
  data?: any;
  pages?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

export interface IErrorResponse {
  method?: string;
  hostname?: string;
  path?: string;
  status?: number;
  time?: string;
  error?: any;
  query?: object;
  body?: object;
}
