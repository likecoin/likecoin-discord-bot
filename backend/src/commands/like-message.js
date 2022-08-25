import { ButtonBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ApplicationCommandType } from 'discord.js';
import { WALLET_CONFIG, ENDPOINT } from '../config.js';

import { User } from '../db.js';
import { getBalance, send, newDeposit } from '../utils/index.js';

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
      if (!user) {
        const res = await newDeposit(discordId);
        res.content = 'You haven\'t deposited. Please deposit and try again';
        await interaction.editReply(res);
        return;
      }

      const receiver = await User.findOne({ where: { discordId: receiverUser.id } });
      if (!receiver) { throw new Error(`${receiverUser} doesn't have receiving address, they need to \`/register\` first.`); }
      if (receiver.id === user.id) { throw new Error('You cannot send LIKE to yourself.'); }
      const { amount: balanceAmount } = await getBalance(user);

      if (balanceAmount < nanoAmount) {
        const res = await newDeposit(discordId);
        res.content = 'You don\'t have enough balance. Please deposit more and try again';
        await interaction.editReply(res);
        return;
      }

      const txHash = await send(user, receiver.receiveAddress, nanoAmount);

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Check Tx')
            .setStyle('Link')
            .setURL(`${ENDPOINT}/cosmos/tx/v1beta1/txs/${txHash}`),
        );

      await interaction.editReply({
        content: `Done\ntx: ${txHash}`,
        components: [row],
      });
      await channel.send({
        content: `<@${discordId}> sent ${amount} LIKE to ${receiverUser}`,
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `${err}`,
        ephemeral: true,
      });
    }
  },
};
