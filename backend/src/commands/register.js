import { SlashCommandBuilder } from '@discordjs/builders';
import { User } from '../db.js';

const COMMAND_NAME = 'register';
const COMMAND_OPTION_NAME = 'address';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Register address for receiving funds')
    .addStringOption((address) => address.setName(COMMAND_OPTION_NAME)
      .setDescription('Cosmos address (cosmos1...) or Like address (like1...)')
      .setRequired(true)),
  async execute(interaction) {
    const inputAddress = interaction.options.getString(COMMAND_OPTION_NAME);
    console.log(interaction);
    const { id, username } = interaction.user;
    const [user, created] = await User.findOrBuild({
      where: { discordId: id },
      defaults: { username },
    });
    user.set({
      receiveAddress: inputAddress,
    });
    await user.save();
    console.log(user.toJSON());
    console.log('user.discordId === id:', user.discordId === id);
    await interaction.reply({
      content: created
        ? `✅ Register ${user.username} with \`${user.receiveAddress}\``
        : `✅ Update \`${user.username}\` with ${user.receiveAddress}`,
      ephemeral: true,
    });
  },
};
