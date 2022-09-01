import { v4 } from 'uuid';
import { Op } from 'sequelize';
import { SESSION_EXPIRATION } from '../config.js';
import { Session } from '../db.js';

export async function newSession(discordId) {
  await Session.destroy({ where: { discordId } });
  return Session.create({
    token: v4(),
    discordId,
  });
}

export async function getSession(token) {
  const expire = new Date();
  expire.setMinutes(expire.getMinutes() - SESSION_EXPIRATION);
  await Session.destroy({
    where: {
      createdAt: {
        [Op.lte]: expire,
      },
    },
  });
  return Session.findOne({ where: { token } });
}
