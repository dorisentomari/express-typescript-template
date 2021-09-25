import * as redis from 'redis';
import { parseToNumber } from 'easybus';

import { RESPONSE_CODE } from '~src/config/response-code.config';

const redisClient = redis.createClient(parseToNumber(process.env.REDIS_PORT), process.env.REDIS_HOST, {
  db: parseToNumber(process.env.REDIS_DATABASE),
});

redisClient.on('error', error => {
  console.log(RESPONSE_CODE.REDIS_ERROR.phraseCn);
  console.log(error);
});

const redisService = {
  client: redisClient,
  set(key, value) {
    return redisClient.set(key, value);
  },
  async get(key) {
    return new Promise((resolve, reject) => {
      redisClient.get(key, (error, result) => {
        if (error) {
          return reject(error);
        }
        try {
          result = JSON.parse(result);
          return resolve(result);
        } catch (error) {
          return resolve(result);
        }
      });
    });
  },
};

export default redisService;
