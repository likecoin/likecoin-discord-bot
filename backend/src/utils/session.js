import { v4 } from 'uuid';
import { Session } from '../db.js';

export async function newSession(discordId) {
  await Session.destroy({ where: { discordId } });
  return Session.create({
    token: v4(),
    discordId,
  });
}
