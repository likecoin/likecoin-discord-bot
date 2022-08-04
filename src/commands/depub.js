import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder()
    .setName('depub')
    .setDescription('Tweet the selected message to depub.space'),
  async execute(interaction) {
    console.log(interaction);
    await interaction.reply('Got it');
  },
};
