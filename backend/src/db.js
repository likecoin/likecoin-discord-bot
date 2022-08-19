import { Sequelize, Model, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/db.sqlite',
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
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.BIGINT.UNSIGNED,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'User',
});

export async function initDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (err) {
    console.error(err);
  }
}
