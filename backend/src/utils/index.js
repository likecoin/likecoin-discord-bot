import { bech32 } from 'bech32';
import axios from 'axios';
import qs from 'qs';
import bcrypt from 'bcrypt';

import {
  PREFIX_PAIRS, API_WALLET_ADDRESS, ENDPOINT,
} from '../config.js';

const prefixMap = new Map();
PREFIX_PAIRS.forEach(([first, second]) => {
  prefixMap.set(first, second);
  prefixMap.set(second, first);
});

const MSG_TYPE_URL = '/cosmos.bank.v1beta1.MsgSend';

export const api = axios.create({
  baseURL: ENDPOINT,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export function changeAddressPrefix(address) {
  const { prefix, words } = bech32.decode(address);
  if (!prefixMap.has(prefix)) throw new Error('PREFIX_NOT_INCLUDED');
  const newPrefix = prefixMap.get(prefix);
  return bech32.encode(newPrefix, words);
}

function verifyMemo(user, memo) {
  return bcrypt.compare(String(user.discordId), memo);
}

async function verifyUser(user) {
  const res = await api.get('/cosmos/tx/v1beta1/txs', {
    params: {
      events: [
        `cosmos.authz.v1beta1.EventGrant.grantee='"${API_WALLET_ADDRESS}"'`,
        `cosmos.authz.v1beta1.EventGrant.granter='"${user.sendAddress}"'`,
        `cosmos.authz.v1beta1.EventGrant.msg_type_url='"${MSG_TYPE_URL}"'`,
      ],
      'pagination.limit': 1,
      order_by: 'desc',
    },
  });
  console.log(res);
  if (res.data.txs.length === 0) { throw new Error('No tx'); }
  const { memo } = res.data.txs[0].body;
  if (!(await verifyMemo(user, memo))) { throw new Error('User not verifyed'); }
}

async function queryBalance(user) {
  const res = await api.get('/cosmos/authz/v1beta1/grants', {
    params: {
      granter: user.sendAddress,
      grantee: API_WALLET_ADDRESS,
      msg_type_url: MSG_TYPE_URL,
    },
  });
  const {
    expiration, authorization: {
      spend_limit: [{
        denom, amount,
      }],
    },
  } = res.data.grants[0];
  return {
    expiration, amount, denom,
  };
}

export async function getBalance(user) {
  try {
    await verifyUser(user);
    return await queryBalance(user);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
