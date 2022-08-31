import { SlashCommandBuilder } from '@discordjs/builders';
import { newDeposit, replyInDM } from '../utils/index.js';

const COMMAND_NAME = 'deposit';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Deposit fund'),
  async execute(interaction) {
    const res = await newDeposit(
      interaction.user.id,
      'Please open the link in the browser to continue',
    );
    await replyInDM(interaction, res);
  },
};
