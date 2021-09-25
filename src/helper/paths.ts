import path from 'path';
import fs from 'fs';

// 根目录
const appDirectory = fs.realpathSync(process.cwd());

// 依据根目录，找到相对文件或相对目录
export function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

// 生成日志文件名字
export function generateLogFile(fileName) {
  return path.resolve(resolveApp('logs'), fileName);
}

export default {
  // 解析 env 环境变量
  dotenv: resolveApp('.env'),

  // 项目根目录
  appPath: resolveApp('.'),

  // package.json 的路径
  appPackageJson: resolveApp('package.json'),

  // src 目录
  appSrc: resolveApp('src'),

  // tsconfig 的路径
  appTsConfig: resolveApp('tsconfig.json'),

  // node_modules 的目录路径
  appNodeModules: resolveApp('node_modules'),

  // logs 路径
  appLog: resolveApp('logs'),

  // public 路径
  appPublic: resolveApp('public'),

  // assets 路径
  appAssets: resolveApp('assets'),
};
