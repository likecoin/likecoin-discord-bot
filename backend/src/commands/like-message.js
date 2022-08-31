import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord.js';

import sendCommand from './send.js';

const COMMAND_NAME = 'LIKE this message';
const DEFAULT_LIKE_AMOUNT = 5;

export default {
  data: new ContextMenuCommandBuilder()
    .setName(COMMAND_NAME)
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    const { user } = interaction;
    const msg = await interaction.channel.messages.fetch(interaction.targetId);
    const { author: receiverUser, channel } = msg;
    await interaction.deferReply({
      ephemeral: true,
    });
    try {
      const receiver = await sendCommand.getReceiver(interaction, receiverUser);
      await interaction.editReply({
        content: `Sending ${DEFAULT_LIKE_AMOUNT} LIKE to ${receiverUser}...`,
      });
      await sendCommand.send(interaction, receiver.receiveAddress, DEFAULT_LIKE_AMOUNT);
      if (interaction.inGuild()) {
        await channel.send({
          content: `${user} sent ${DEFAULT_LIKE_AMOUNT} LIKE to ${receiverUser}`,
          reply: {
            messageReference: msg.id,
          },
        });
      }
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `${err}`,
        ephemeral: true,
      });
    }
  },
};
