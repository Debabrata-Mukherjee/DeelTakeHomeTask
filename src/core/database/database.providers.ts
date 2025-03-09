/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST } from '../constants';
import { databaseConfig } from './database.config';
import { Profile } from 'src/entities/profile.entity';
import { Job } from 'src/entities/job.entity';
import { Contract } from 'src/entities/contract.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'database.sqlite',
        logging: true, // Enable query logging
      });
      sequelize.addModels([Profile, Contract, Job]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
