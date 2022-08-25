import { User } from '../db.js';

export async function registerAddress(discordId, address) {
  const [user] = await User.findOrBuild({
    where: { discordId },
  });
  user.receiveAddress = address;
  return user.save();
}
