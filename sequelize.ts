// sequelize.ts

import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'database',
  port: 5432,
  username: <string>process.env.DATABASE_USER_NAME,
  password: <string>process.env.DATABASE_USER_PASSWORD,
  database: <string>process.env.DATABASE_NAME,
  models: [__dirname + '/models'],
});
