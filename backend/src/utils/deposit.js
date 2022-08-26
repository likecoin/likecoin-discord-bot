import { ButtonBuilder } from '@discordjs/builders';
import { URL, URLSearchParams } from 'url';
import bcrypt from 'bcrypt';

import { ActionRowBuilder } from 'discord.js';
import { UI_URL } from '../config.js';
import { newSession } from './session.js';

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
