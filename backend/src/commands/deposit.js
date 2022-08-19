import { SlashCommandBuilder } from '@discordjs/builders';
import { URL, URLSearchParams } from 'url';
import bcrypt from 'bcrypt';

import { User } from '../db.js';

const COMMAND_NAME = 'deposit';
const COMMAND_OPTION_NAME = 'address';
const saltRounds = 10;
const UI_URL = 'http://localhost:3000';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Deposit fund')
    .addStringOption((address) => address.setName(COMMAND_OPTION_NAME)
      .setDescription('Cosmos address (cosmos1...) or Like address (like1...)')
      .setRequired(true)),
  async execute(interaction) {
    const address = interaction.options.getString(COMMAND_OPTION_NAME);
    console.log(interaction);
    const { id, username } = interaction.user;
    const [user, created] = await User.findOrBuild({
      where: { discordId: id },
      defaults: { username },
    });
    user.sendAddress = address;
    if (created) user.receiveAddress = address;
    await user.save();
    console.log(id);
    const hash = await bcrypt.hash(String(id), saltRounds);
    console.log(await bcrypt.compare(String(id), hash));
    const depositURL = new URL('/deposit', UI_URL);
    depositURL.search = new URLSearchParams({
      hash,
      address,
    });
    await interaction.reply({
      content: depositURL.toString(),
      ephemeral: true,
    });
  },
};
