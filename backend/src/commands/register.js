import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } from '@discordjs/builders';
import { User } from '../db.js';
import { newSession } from '../utils/index.js';
import { UI_URL } from '../config.js';

const COMMAND_NAME = 'register';
const COMMAND_OPTION_NAME = 'address';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Register address for receiving funds')
    .addStringOption((address) => address.setName(COMMAND_OPTION_NAME)
      .setDescription('Cosmos address (cosmos1...) or Like address (like1...)')),
  async execute(interaction) {
    const { id, username } = interaction.user;
    const inputAddress = interaction.options.getString(COMMAND_OPTION_NAME);
    if (!inputAddress) {
      const { token } = await newSession(id);
      const url = new URL(`${UI_URL}/register`);
      url.search = new URLSearchParams({ token });
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Sign')
            .setStyle('Link')
            .setURL(url.toString()),
        );
      await interaction.reply({
        content: 'Please sign the tx in the browser to finish deposit',
        components: [row],
        ephemeral: true,
      });
      return;
    }
    const [user, created] = await User.findOrBuild({
      where: { discordId: id },
      defaults: { username },
    });
    user.set({
      receiveAddress: inputAddress,
    });
    await user.save();
    await interaction.reply({
      content: created
        ? `✅ Register ${user.username} with \`${user.receiveAddress}\``
        : `✅ Update \`${user.username}\` with ${user.receiveAddress}`,
      ephemeral: true,
    });
  },
};
