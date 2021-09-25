import { Request, Response, Router } from 'express';
import { HTTP_METHOD } from '~src/types/http.types';

export interface IResponseCodeProperty {
  status: number;
  // phrase means server exception simple info, general is English Language.
  phrase: string;
  // phraseCn is same as phrase, the difference is you can use phraseCn as your country language
  // like I am from China, so I need use Cn as Chinese
  // if you are from Japan, you can edit `phraseCn` to `phraseJp`。
  phraseCn: string;
}

export abstract class ControllerInterface {
  path: string;

  router: Router;

  initRoutes: () => void;
}

export interface IRoute {
  method: HTTP_METHOD;
  path: string;
  middlewares?: Array<any>;
  controller: (req: Request, res: Response) => any;
  // remark is anything you can record, if you like.
  remark?: any;
}

// send email
export interface ISendInfo {
  from?: string;
  to: string;
  subject: string;
  html?: string;
}
