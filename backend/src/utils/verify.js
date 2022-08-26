import bcrypt from 'bcrypt';
import { API_WALLET_ADDRESS } from '../config.js';
import api from './api.js';

const MSG_TYPE_URL = '/cosmos.bank.v1beta1.MsgSend';

function verifyMemo(discordId, memo) {
  return bcrypt.compare(String(discordId), memo);
}

export async function verifyUser(user) {
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
  if (res.data.txs.length === 0) { throw new Error('No tx'); }
  const { memo } = res.data.txs[0].body;
  if (!(await verifyMemo(user.discordId, memo))) { throw new Error('User not verified'); }
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
