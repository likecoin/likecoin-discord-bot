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
  const amount = Number(nanoAmount) / (10 ** WALLET_CONFIG.coinDecimals);
  return `${amount} ${WALLET_CONFIG.coinDenom}`;
}

export function changeAddressPrefix(address) {
  const { prefix, words } = bech32.decode(address);
  if (!prefixMap.has(prefix)) throw new Error('PREFIX_NOT_INCLUDED');
  const newPrefix = prefixMap.get(prefix);
  return bech32.encode(newPrefix, words);
}
