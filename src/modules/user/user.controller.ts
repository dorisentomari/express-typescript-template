import express, { Request, Response } from 'express';

import { ControllerInterface, IRoute } from '~src/types/global.types';
import validateBody from '~src/middlewares/validate-body.middleware';
import { errorResponse, normalResponse } from '~src/helper/unify-response';
import GLOBAL_CONFIG from '~src/config/global.config';
import { HTTP_METHOD, INormalResponse } from '~src/types/http.types';
import { IUserMember } from '~src/mongodb/schemas/user-member.schema';
import { userMemberOrmService } from '~src/service/base.orm.service';
import logger from '~src/helper/logger';
import { generateJwtToken, hashPassword, verifyJwtToken } from '~src/helper/utils';

import { MODULE_NAME, USER_RESPONSE_CODE } from './user.config';
import { UserLoginDto, UserRegisterDto } from './user.dto';
import userService from './user.service';
import { IJwtSign } from './user.types';

export default class UserController implements ControllerInterface {
  public path: string;

  public router = express.Router();

  constructor() {
    this.path = `/${GLOBAL_CONFIG.API_V1}/${MODULE_NAME}`;
    this.initRoutes();
  }

  public initRoutes() {
    /*
     * **rule**
     *
     * user business action, use `user` as route prefix, like user info, user nickname...
     * user account action, use `auth` as route prefix, like user auth, user role...
     * */

    const routes: Array<IRoute> = [
      {
        method: HTTP_METHOD.GET,
        path: `${this.path}/test`,
        controller: this.userTest,
        remark: '用户测试',
      },
      {
        method: HTTP_METHOD.POST,
        path: `${this.path}/auth/register`,
        middlewares: [validateBody(UserRegisterDto)],
        controller: this.register,
        remark: '用户注册',
      },
      {
        method: HTTP_METHOD.POST,
        path: `${this.path}/auth/login`,
        middlewares: [validateBody(UserLoginDto)],
        controller: this.login,
        remark: '用户登录',
      },
      {
        method: HTTP_METHOD.POST,
        path: `${this.path}/auth/validate-token`,
        middlewares: [],
        controller: this.validateJwtToken,
        remark: '校验 token 是否有效',
      },
      {
        method: HTTP_METHOD.POST,
        path: `${this.path}/auth/refresh-token`,
        middlewares: [],
        controller: this.refreshJwtToken,
        remark: '刷新 token',
      },
    ];
    routes.forEach(route => {
      this.router[route.method](route.path, route.middlewares || [], route.controller);
    });
  }

  public userTest(req: Request, res: Response) {
    res.json({ name: 'test' });
  }

  public async register(req: Request, res: Response) {
    const body: UserRegisterDto = req.body;
    const checkUser = await userMemberOrmService.findOne({ email: body.email });
    if (checkUser) {
      return errorResponse(res, USER_RESPONSE_CODE.EMAIL_EXIST.phraseCn);
    }
    let user = await userMemberOrmService.create<IUserMember>({
      email: body.email,
      password: hashPassword(body.password),
    });
    user = user.toObject() as IUserMember;
    normalResponse(res, user);
    logger.normal(`user ${body.email} register success`);
  }

  public async login(req: Request, res: Response) {
    const body: UserLoginDto = req.body;
    let user = await userMemberOrmService.findOne<IUserMember>({
      email: body.email,
    });
    if (!user || !userService.comparePassword(user.password, body.password)) {
      return errorResponse(res, USER_RESPONSE_CODE.WRONG_PASSWORD.phraseCn);
    }
    user = user.toObject() as IUserMember;
    const sign: IJwtSign = generateJwtToken(user, process.env.JWT_SECRET);
    delete sign.iat;
    delete sign.user;
    const response = {
      sign: sign,
      user,
    };
    normalResponse(res, response);
    logger.normal(`user ${body.email} login success`);
  }

  public async validateJwtToken(req: Request, res: Response) {
    const authorization = req.headers['authorization'];
    const checkToken = verifyJwtToken(authorization, process.env.JWT_SECRET);
    const response: INormalResponse = { data: { validate: false } };
    if (checkToken) {
      const sign: IJwtSign = generateJwtToken(checkToken.user, process.env.JWT_SECRET);
      const user = sign.user;
      delete sign.iat;
      delete sign.user;
      response.data = { validate: true, sign, user };
    }
    normalResponse(res, response);
    if (response.data.validate) {
      logger.normal('user token valid');
    } else {
      logger.normal('user token invalid');
    }
  }

  public async refreshJwtToken(req: Request, res: Response) {
    const user = req.$server.user;
    const sign: IJwtSign = generateJwtToken(user, process.env.JWT_SECRET);
    delete sign.iat;
    delete sign.user;
    const response: INormalResponse = { data: { sign, user } };
    normalResponse(res, response);
    logger.normal(`refreshJwtToken success`);
  }
}
