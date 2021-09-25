import express, { Application } from 'express';
import { parseToNumber } from 'easybus';

import { ControllerInterface } from '~src/types/global.types';
import { getIPAddress } from '~src/helper/utils';
import logger from '~src/helper/logger';
import systemService from '~src/service/system.service';
import GLOBAL_CONFIG from '~src/config/global.config';

export class App {
  public readonly app: Application;

  private controllers: Array<ControllerInterface>;

  constructor(controllers: Array<ControllerInterface>) {
    this.app = express();

    this.controllers = controllers;

    this.initSystemTask(controllers);
  }

  public async listen() {
    const { PORT } = GLOBAL_CONFIG;
    this.app.listen(parseToNumber(process.env.PORT || PORT), () => {
      logger.normal(`server is running at http://localhost:${PORT}`);
      logger.normal(`server is running at http://${getIPAddress()}:${PORT}`);
    });
  }

  public initControllers() {
    this.controllers.forEach(controller => this.app.use('/', controller.router));
  }

  public initSystemTask(controllers: Array<ControllerInterface>) {
    systemService.printControllerRoutes(controllers);
  }
}
