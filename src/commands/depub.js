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
    const msgUrl = `https://discordapp.com/channels/${msg.guildId}/${msg.channelId}/${msg.id}`;
    const msgContent = msg.content.substring(0, 2048);
    const iscnUrl = new URL('/in/widget/iscn', WIDGET_ENDPOINT);
    iscnUrl.search = new URLSearchParams({
      title: `depub.space-${(new Date()).toISOString()}`,
      url: msgUrl,
      fingerprint: 'https://depub.blog',
      type: 'Record',
      tags: `Discord,${interaction.member.guild.name}`,
      publisher: 'depub.space',
      description: `${msgUrl}\n${msgContent}`,
    });

    await interaction.reply({
      content: `Click this link to continue: ${iscnUrl.toString()}`,
      ephemeral: true,
    });
  },
};
