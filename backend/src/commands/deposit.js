import { SlashCommandBuilder } from '@discordjs/builders';
import { newDeposit } from '../utils/index.js';

const COMMAND_NAME = 'deposit';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Deposit fund'),
  async execute(interaction) {
    const res = await newDeposit(interaction.user.id);
    await interaction.reply(res);
  },
};
