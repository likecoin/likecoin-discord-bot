import { Sequelize, Model, DataTypes } from 'sequelize';
import { DB_NAME, DB_USER, DB_PASS } from './config.js';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  dialect: 'postgres',
});

export class User extends Model {}

User.init({
  username: {
    type: DataTypes.STRING,
  },
  discordId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  sendAddress: {
    type: DataTypes.STRING,
  },
  receiveAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
});

export class Session extends Model {}

Session.init({
  token: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  discordId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Session',
});

export async function initDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (err) {
    console.error(err);
  }
}
