import { SlashCommandBuilder } from '@discordjs/builders';
import { WALLET_CONFIG } from '../config.js';

import { User } from '../db.js';
import { getBalance } from '../utils/index.js';
import { send } from '../utils/wallet.js';

const COMMAND_NAME = 'send';
const COMMAND_OPTION_NAME = 'receiver';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Send LIKE to others')
    .addStringOption((address) => address.setName(COMMAND_OPTION_NAME)
      .setDescription('Receiver address')
      .setRequired(true))
    .addIntegerOption((amount) => amount.setName('amount')
      .setDescription('amount (LIKE)')
      .setRequired(true)),

  async execute(interaction) {
    console.log(interaction);
    const { id: discordId } = interaction.user;
    const receiverAddr = interaction.options.getString(COMMAND_OPTION_NAME);
    const amount = interaction.options.getInteger('amount');
    console.log(amount);
    const nanoAmount = (10 ** WALLET_CONFIG.coinDecimals) * amount;
    await interaction.reply({
      content: `Sending ${amount} LIKE to ${receiverAddr}...`,
      ephemeral: true,
    });
    try {
      const user = await User.findOne({ where: { discordId } });
      if (!user) { throw new Error('User not found, please deposit first.'); }

      const { amount: balanceAmount } = await getBalance(user);

      console.log(balanceAmount, nanoAmount);
      if (balanceAmount < nanoAmount) { throw new Error('Balance not enough'); }

      const txHash = await send(user, receiverAddr, nanoAmount);
      console.log(txHash);

      await interaction.reply({
        content: `Sent LIKE to ${receiverAddr}\ntx: ${txHash}`,
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: `Error: ${err}`,
        ephemeral: true,
      });
    }
  },
};
