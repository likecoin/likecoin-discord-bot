import { ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { URL, URLSearchParams } from 'url';
import bcrypt from 'bcrypt';

import { ActionRowBuilder } from 'discord.js';
import { UI_URL } from '../config.js';
import { newSession } from '../utils/index.js';

const COMMAND_NAME = 'deposit';
const saltRounds = 10;

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Deposit fund')
    .setDMPermission(true),
  async execute(interaction) {
    const { id } = interaction.user;
    const hash = await bcrypt.hash(String(id), saltRounds);
    const { token } = await newSession(id);
    const depositURL = new URL(`${UI_URL}/deposit`);
    depositURL.search = new URLSearchParams({
      token,
      hash,
    });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Sign')
          .setStyle('Link')
          .setURL(depositURL.toString()),
      );
    await interaction.reply({
      content: 'Please sign the tx in the browser to finish deposit',
      components: [row],
      ephemeral: true,
    });
  },
};
