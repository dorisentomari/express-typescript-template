import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import { IResponseCodeProperty } from '~src/types/global.types';
import { IResponseCodeProps } from '~src/types/http.types';

const { INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } = StatusCodes;

export const RESPONSE_CODE: IResponseCodeProps<IResponseCodeProperty> = {
  SERVER_ERROR: {
    status: INTERNAL_SERVER_ERROR,
    phrase: getReasonPhrase(INTERNAL_SERVER_ERROR),
    phraseCn: '服务出错',
  },

  NOT_FOUND: {
    status: NOT_FOUND,
    phrase: getReasonPhrase(NOT_FOUND),
    phraseCn: '资源不存在',
  },

  UNAUTHORIZED: {
    status: UNAUTHORIZED,
    phrase: getReasonPhrase(UNAUTHORIZED),
    phraseCn: '没有权限',
  },

  REDIS_ERROR: {
    status: INTERNAL_SERVER_ERROR,
    phrase: 'redis server error',
    phraseCn: 'redis 出错',
  },
};
