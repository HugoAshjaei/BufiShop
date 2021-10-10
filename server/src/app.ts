import 'reflect-metadata';
import express from 'express';
import config from './config';
import logger from "./utils/logger";


async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  app
    .listen(config.port, () => {
      console.log(
        `Server is running on port: ${config.port}`
      );
      logger.info(`${new Date()} - Server is running on port: ${config.port}`);
    })
    .on('error', () => {
      logger.error(`${new Date()} - Server error on startings`);
      process.exit(1);
    });
}

startServer().then();