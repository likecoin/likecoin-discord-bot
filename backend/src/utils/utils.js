import BigNumber from 'bignumber.js';
import { bech32 } from 'bech32';
import {
  WALLET_CONFIG, PREFIX_PAIRS,
} from '../config.js';

const prefixMap = new Map();
PREFIX_PAIRS.forEach(([first, second]) => {
  prefixMap.set(first, second);
  prefixMap.set(second, first);
});

export function formatCoin(nanoAmount) {
  const amount = BigNumber(nanoAmount).shiftedBy(-WALLET_CONFIG.coinDecimals);
  return `${amount} ${WALLET_CONFIG.coinDenom}`;
}

export function toNanoAmount(amount) {
  return BigNumber(amount).shiftedBy(WALLET_CONFIG.coinDecimals);
}

export async function replyInDM(interaction, msg) {
  if (interaction.inGuild()) {
    try {
      await interaction.user.send(msg);
      await interaction.reply({
        content: 'Please direct message me to continue',
        ephemeral: true,
      });
    } catch (err) {
      await interaction.reply({
        content: 'Please allow "Direct Messages" in this server\'s privacy settings and try again',
        ephemeral: true,
      });
    }
    return;
  }
  await interaction.reply(msg);
}

export function changeAddressPrefix(address) {
  const { prefix, words } = bech32.decode(address);
  if (!prefixMap.has(prefix)) throw new Error('PREFIX_NOT_INCLUDED');
  const newPrefix = prefixMap.get(prefix);
  return bech32.encode(newPrefix, words);
}

export function validateAddress(addr) {
  try {
    const { prefix } = bech32.decode(addr);
    if (!prefixMap.has(prefix)) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export function sleep(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}
