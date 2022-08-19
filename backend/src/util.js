import { bech32 } from 'bech32';
import { User } from './db.js';

import { PREFIX_PAIRS } from './config.js';

const prefixMap = new Map();
PREFIX_PAIRS.forEach(([first, second]) => {
  prefixMap.set(first, second);
  prefixMap.set(second, first);
});

export function changeAddressPrefix(address) {
  const { prefix, words } = bech32.decode(address);
  if (!prefixMap.has(prefix)) throw new Error('PREFIX_NOT_INCLUDED');
  const newPrefix = prefixMap.get(prefix);
  return bech32.encode(newPrefix, words);
}

export async function getBalance(discordId) {
  const user = await User.findOne({
    where: { discordId },
  });
  if (!user) {
    throw new Error('User not found');
  }
  console.log(user.toJSON());
  return 0;
}

export default changeAddressPrefix;
