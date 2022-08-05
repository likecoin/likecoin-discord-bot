import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('depub')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    const msg = await interaction.channel.messages.fetch(interaction.targetId);
    console.log('msg:', msg);
    const msgUrl = `https://discordapp.com/channels/${msg.guildId}/${msg.channelId}/${msg.id}`;
    await interaction.reply(`${msg.content} ${msgUrl}`);
  },
};
