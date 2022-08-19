import { SlashCommandBuilder } from '@discordjs/builders';
import { URL, URLSearchParams } from 'url';
import bcrypt from 'bcrypt';

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
    const { id } = interaction.user;
    const hash = await bcrypt.hash(id, saltRounds);
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
