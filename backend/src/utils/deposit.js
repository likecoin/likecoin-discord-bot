import { ButtonBuilder } from '@discordjs/builders';
import { URL, URLSearchParams } from 'url';
import bcrypt from 'bcrypt';

import { ActionRowBuilder } from 'discord.js';
import { UI_URL } from '../config.js';
import { newSession } from './session.js';
import { Session, User } from '../db.js';
import { getBalance, verifyUser } from './verify.js';
import api from './api.js';
import { getUser } from '../client.js';

const saltRounds = 10;

export async function newDeposit(discordId, msg) {
  const hash = await bcrypt.hash(String(discordId), saltRounds);
  const { token } = await newSession(discordId);
  const depositURL = new URL(`${UI_URL}/deposit`);
  depositURL.search = new URLSearchParams({
    token,
    hash,
  });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel('Deposit')
        .setStyle('Link')
        .setURL(depositURL.toString()),
    );
  return {
    content: msg,
    components: [row],
    ephemeral: true,
  };
}

export async function depositUser(token, txHash) {
  const session = await Session.findOne({ where: { token } });
  if (!session) { throw new Error('SESSION_NOT_FOUND'); }
  const { data } = await api.get(`/cosmos/tx/v1beta1/txs/${txHash}`);
  const { messages: [{ granter: sendAddress }] } = data.tx.body;
  const { username } = await getUser(session.discordId);
  const [user, created] = await User.findOrBuild({
    where: { discordId: session.discordId },
    defaults: {
      receiveAddress: sendAddress,
    },
  });
  user.set({ username, sendAddress });
  await verifyUser(user);
  const { amount } = await getBalance(user);
  await user.save();
  await session.destroy();
  return { user, created, amount };
}
