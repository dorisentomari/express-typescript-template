import { StatusCodes } from 'http-status-codes';

import { IResponseCodeProperty } from '~src/types/global.types';
import { IUserResponseCodeProps } from './user.types';

export const MODULE_NAME = 'user';

const { BAD_REQUEST } = StatusCodes;

export const USER_RESPONSE_CODE: IUserResponseCodeProps<IResponseCodeProperty> = {
  EMAIL_EXIST: {
    status: BAD_REQUEST,
    phrase: 'EMAIL_EXIST',
    phraseCn: '邮箱已被使用',
  },

  WRONG_PASSWORD: {
    status: BAD_REQUEST,
    phrase: 'WRONG_PASSWORD',
    phraseCn: '用户名或密码错误',
  },
};
