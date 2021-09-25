import { formatDateTime, paddingEnd } from 'easybus';
import chalk from 'chalk';

import { ControllerInterface } from '~src/types/global.types';
import { ILayer, IRouteSet } from '~src/types/express.types';
import { parseExpressLayerRoute } from '~src/helper/utils';
import paths from '~src/helper/paths';

const pkg = require(paths.appPackageJson);

class SystemService {
  collectionControllers(controllers: Array<ControllerInterface>): Array<IRouteSet> {
    let routes: Array<IRouteSet> = [];
    controllers.forEach(controller => {
      routes = routes.concat(this.collectionControllerRoutes(controller.router.stack));
    });
    return routes;
  }

  collectionControllerRoutes(layers: Array<ILayer>): Array<IRouteSet> {
    return layers.reduce((prev, curr) => {
      prev = prev.concat(parseExpressLayerRoute(curr.route));
      return prev;
    }, []);
  }

  printControllerRoutes(controllers: Array<ControllerInterface>) {
    const routes = this.collectionControllers(controllers);
    routes.forEach(route => {
      const name = chalk.green(`[${pkg.name}]`);
      const time = formatDateTime();
      let method = route.method.toUpperCase();
      method = chalk.green(paddingEnd(method, 6, ' '));
      const path = chalk.green(`{ ${route.path} }`);
      const type = chalk.yellow('[ROUTE]');
      console.log(`${name} - ${time}  ${type}  ${method} ${path}`);
    });
  }
}

const systemService = new SystemService();

export default systemService;
