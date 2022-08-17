import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('Send LIKE')
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    console.log(interaction);
    await interaction.reply({
      content: `Send LIKE to ${interaction.targetUser.username}`,
      ephemeral: true,
    });
  },
};
