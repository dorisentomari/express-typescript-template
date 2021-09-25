import debug from 'debug';

const logger = {
  error: debug('log:error'),

  watch: debug('log:watch'),

  normal: debug('log:normal'),

  email: debug('log:email'),

  db: debug('log:db'),

  axios: debug('log:axios'),
};

export default logger;
