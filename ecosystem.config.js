const pkg = require('./package.json');

module.exports = {
  name: pkg.name,
  script: 'cross-env NODE_ENV=production ts-node --files ./src/index.ts',
  output: 'logs/output.log',
  error: 'logs/error.log',
  env: {
    NODE_ENV: 'production',
  },
};
