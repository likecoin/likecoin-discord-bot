import { User } from '../db.js';
import { validateAddress } from './utils.js';
import { getUser } from '../client.js';

export async function registerAddress(discordId, address) {
  const { username } = getUser(discordId);
  if (!validateAddress(address)) { throw new Error('Invalid address'); }
  const [user] = await User.findOrBuild({
    where: { discordId },
  });
  user.set({
    username,
    receiveAddress: address,
  });
  return user.save();
}
