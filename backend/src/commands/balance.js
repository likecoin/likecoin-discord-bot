import { SlashCommandBuilder } from '@discordjs/builders';
import { getBalance } from '../utils/index.js';

const COMMAND_NAME = 'balance';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Get balance'),
  async execute(interaction) {
    const { id: discordId } = interaction.user;
    const balance = await getBalance(discordId);
    await interaction.reply({
      content: `Balance: ${balance}`,
      ephemeral: true,
    });
  },
};
