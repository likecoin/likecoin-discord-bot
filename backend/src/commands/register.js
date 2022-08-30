import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';
import { newSession, registerAddress } from '../utils/index.js';
import { UI_URL } from '../config.js';

const COMMAND_NAME = 'register';
const COMMAND_OPTION_NAME = 'address';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Register address for receiving funds')
    .addStringOption((address) => address.setName(COMMAND_OPTION_NAME)
      .setDescription('Like address (like1...)')),
  async execute(interaction) {
    const { id } = interaction.user;
    const inputAddress = interaction.options.getString(COMMAND_OPTION_NAME);
    if (!inputAddress) {
      const { token } = await newSession(id);
      const url = new URL(`${UI_URL}/register`);
      url.search = new URLSearchParams({ token });
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Open')
            .setStyle('Link')
            .setURL(url.toString()),
        );
      await interaction.reply({
        content: 'Please link your wallet in the browser to finish register',
        components: [row],
        ephemeral: true,
      });
      return;
    }
    try {
      const user = await registerAddress(id, inputAddress);
      await interaction.reply({
        content: `✅ Register ${user.username} with \`${user.receiveAddress}\``,
        ephemeral: true,
      });
    } catch (err) {
      await interaction.reply({
        content: `${err}`,
        ephemeral: true,
      });
    }
  },
};
