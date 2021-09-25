import path from 'path';
import mongoose from 'mongoose';
import glob from 'glob';
import bluebird from 'bluebird';

import logger from '~src/helper/logger';

const initSchemas = () => {
  glob.sync(path.resolve(__dirname, './schemas/', '**/*.schema.ts')).forEach(schema => import(schema));
};

const connectMongoDB = async () => {
  mongoose.Promise = bluebird.Promise;

  initSchemas();

  const options = {
    poolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.set('debug', (process.env.DEBUG as unknown) as boolean);

  const HOST = process.env.MONGODB_HOST;
  const PORT = process.env.MONGODB_PORT;
  const DATABASE = process.env.MONGODB_DATABASE;
  const URL = `${HOST}:${PORT}/${DATABASE}`;

  try {
    await mongoose.connect(URL, options);
    logger.db('MongoDB database connect success');
  } catch (error) {
    logger.error('MongoDB database connect failed');
    console.log(error);
  }

  mongoose.connection.on('error', error => {
    logger.error('connect MongoDB database error');
    console.log(error);
  });

  mongoose.connection.on('disconnected', () => {
    logger.watch('connect MongoDB database interrupt');
  });

  mongoose.connection.once('open', () => {
    logger.watch('MongoDB database opened');
  });
};

export default connectMongoDB;
