import { SlashCommandBuilder } from '@discordjs/builders';
import { changeAddressPrefix } from '../utils/index.js';

const COMMAND_NAME = 'translate';
const COMMAND_OPTION_NAME = 'address';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Translate between Cosmos address and Like address')
    .addStringOption((address) => address.setName(COMMAND_OPTION_NAME)
      .setDescription('Cosmos address (cosmos1...) or Like address (like1...)')
      .setRequired(true)),
  async execute(interaction) {
    const inputAddress = interaction.options.getString(COMMAND_OPTION_NAME);
    try {
      const outputAddress = changeAddressPrefix(inputAddress);
      await interaction.reply({
        content: `✅ Translate \`${inputAddress}\` to \`${outputAddress}\``,
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: `⚠ Invalid address \`${inputAddress}\`. Please try again.`,
        ephemeral: true,
      });
    }
  },
};
