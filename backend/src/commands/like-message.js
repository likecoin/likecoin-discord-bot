import { ButtonBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ApplicationCommandType } from 'discord.js';
import { WALLET_CONFIG, ENDPOINT } from '../config.js';

import { User } from '../db.js';
import { getBalance } from '../utils/index.js';
import { send } from '../utils/wallet.js';

const COMMAND_NAME = 'LIKE this message';
const amount = 5;

export default {
  data: new ContextMenuCommandBuilder()
    .setName(COMMAND_NAME)
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    const { id: discordId } = interaction.user;
    const msg = await interaction.channel.messages.fetch(interaction.targetId);
    const { author: receiverUser, channel } = msg;
    const nanoAmount = (10 ** WALLET_CONFIG.coinDecimals) * amount;
    await interaction.deferReply({
      content: `Sending ${amount} LIKE to ${receiverUser}...`,
      ephemeral: true,
    });
    try {
      const user = await User.findOne({ where: { discordId } });
      if (!user) { throw new Error('Please deposit first.'); }

      const receiver = await User.findOne({ where: { discordId: receiverUser.id } });
      if (!receiver) { throw new Error(`${receiverUser} doesn't have receiving address, they need to \`/register\` first.`); }
      if (receiver.id === user.id) { throw new Error('You cannot send LIKE to yourself.'); }
      const { amount: balanceAmount } = await getBalance(user);

      if (balanceAmount < nanoAmount) { throw new Error('Balance not enough'); }

      const txHash = await send(user, receiver.receiveAddress, nanoAmount);

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Check Tx')
            .setStyle('Link')
            .setURL(`${ENDPOINT}/cosmos/tx/v1beta1/txs/${txHash}`),
        );

      await channel.send({
        content: `<@${discordId}> sent ${amount} LIKE to ${receiverUser}\ntx: ${txHash}`,
        reply: {
          messageReference: msg,
        },
        components: [row],
      });
      await interaction.editReply('Done');
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `${err}`,
        ephemeral: true,
      });
    }
  },
};
