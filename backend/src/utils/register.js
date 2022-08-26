import { User } from '../db.js';
import { validateAddress } from './utils.js';

export async function registerAddress(discordId, address) {
  if (!validateAddress(address)) { throw new Error('Invalid address'); }
  const [user] = await User.findOrBuild({
    where: { discordId },
  });
  user.receiveAddress = address;
  return user.save();
}
