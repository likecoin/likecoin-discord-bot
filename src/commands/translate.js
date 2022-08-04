import { SlashCommandBuilder } from '@discordjs/builders';
import { COMMAND_NAME, COMMAND_OPTION_NAME, TARGET_CHANNEL_ID } from '../config.js';
import { changeAddressPrefix } from '../util.js';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Translate between Cosmos address and Like address')
    .addStringOption((address) => address.setName(COMMAND_OPTION_NAME)
      .setDescription('Cosmos address (cosmos1...) or Like address (like1...)')
      .setRequired(true)),
  async execute(interaction) {
    if (interaction.channel.id !== TARGET_CHANNEL_ID) {
      await interaction.reply(`❎ Please use this command in the dedicated channel: <#${TARGET_CHANNEL_ID}>`);
      return;
    }
    const inputAddress = interaction.options.getString(COMMAND_OPTION_NAME);
    try {
      const outputAddress = changeAddressPrefix(inputAddress);
      await interaction.reply(`✅ Translate \`${inputAddress}\` to \`${outputAddress}\``);
    } catch (error) {
      await interaction.reply(`⚠ Invalid address \`${inputAddress}\`. Please try again.`);
    }
  },
};
