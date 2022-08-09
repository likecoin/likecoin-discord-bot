import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { URL, URLSearchParams } from 'url';
import { WIDGET_ENDPOINT } from '../config.js';

export default {
  data: new ContextMenuCommandBuilder()
    .setName('depub')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    const msg = await interaction.channel.messages.fetch(interaction.targetId);
    const msgUrl = `https://discord.com/channels/${msg.guildId}/${msg.channelId}/${msg.id}`;
    const msgContent = msg.content.substring(0, 200);
    const iscnUrl = new URL('/in/widget/iscn', WIDGET_ENDPOINT);
    const guildName = interaction.member.guild.name
    iscnUrl.search = new URLSearchParams({
      title: `depub.space-${(new Date()).toISOString()}`,
      url: msgUrl,
      type: 'message',
      tags: `Discord,${guildName}`,
      publisher: 'depub',
      description: `${msgUrl}\n${msg.author.username}: ${msgContent}\n#Discord #${guildName}`,
      record_notes: 'A Message posted on depub.space',
    });

    await interaction.reply({
      content: `${iscnUrl.toString()}`,
      ephemeral: true,
    });
  },
};
