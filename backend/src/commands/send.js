import { ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder } from 'discord.js';
import { WALLET_CONFIG, ENDPOINT } from '../config.js';

import { User } from '../db.js';
import { getBalance } from '../utils/index.js';
import { send } from '../utils/wallet.js';

const COMMAND_NAME = 'send';
const OPTION_RECEIVER = 'receiver';
const OPTION_AMOUNT = 'amount';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Send LIKE to others')
    .addUserOption((user) => user.setName(OPTION_RECEIVER)
      .setDescription('Receiver')
      .setRequired(true))
    .addIntegerOption((amount) => amount.setName(OPTION_AMOUNT)
      .setDescription('amount (LIKE)')
      .setRequired(true)),

  async execute(interaction) {
    const { id: discordId } = interaction.user;
    const receiverUser = interaction.options.getUser(OPTION_RECEIVER);
    console.log(receiverUser);
    const amount = interaction.options.getInteger(OPTION_AMOUNT);
    const nanoAmount = (10 ** WALLET_CONFIG.coinDecimals) * amount;
    await interaction.reply({
      content: `Sending ${amount} LIKE to ${receiverUser}...`,
      ephemeral: true,
    });
    try {
      const user = await User.findOne({ where: { discordId } });
      if (!user) { throw new Error('User not found, please deposit first.'); }

      const receiver = await User.findOne({ where: { discordId: receiverUser.id } });
      if (!receiver) { throw new Error('Receiver not found, please /register first.'); }
      const { amount: balanceAmount } = await getBalance(user);

      if (balanceAmount < nanoAmount) { throw new Error('Balance not enough'); }

      const txHash = await send(user, receiver, nanoAmount);
      console.log(txHash);

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Check Tx')
            .setStyle('Link')
            .setURL(`${ENDPOINT}/cosmos/tx/v1beta1/txs/${txHash}`),
        );

      await interaction.followUp({
        content: `<@${discordId}> sent ${amount} LIKE to ${receiverUser}\ntx: ${txHash}`,
        components: [row],
        ephemeral: false,
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
