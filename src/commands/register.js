import { SlashCommandBuilder } from '@discordjs/builders';

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
    await interaction.reply({
      content: `✅ Register \`${inputAddress}\``,
      ephemeral: true,
    });
  },
};
