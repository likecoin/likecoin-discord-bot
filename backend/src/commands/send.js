import { ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder } from 'discord.js';
import { WALLET_CONFIG, ENDPOINT } from '../config.js';

import { User } from '../db.js';
import { getBalance, validateAddress, send } from '../utils/index.js';

const COMMAND_NAME = 'send';
const OPTION_RECEIVER = 'receiver';
const OPTION_ADDRESS = 'address';
const OPTION_AMOUNT = 'amount';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Send LIKE to others')
    .addSubcommand((sendUser) => sendUser
      .setName('user')
      .setDescription('sent LIKE to user who registered address')
      .addUserOption((user) => user.setName(OPTION_RECEIVER)
        .setDescription('Receiver')
        .setRequired(true))
      .addIntegerOption((amount) => amount.setName(OPTION_AMOUNT)
        .setDescription('amount (LIKE)')
        .setRequired(true)))
    .addSubcommand((sendAddr) => sendAddr
      .setName('address')
      .setDescription('send LIKE to address directly')
      .addStringOption((address) => address.setName(OPTION_ADDRESS)
        .setDescription('Address')
        .setRequired(true))
      .addIntegerOption((amount) => amount.setName(OPTION_AMOUNT)
        .setDescription('amount (LIKE)')
        .setRequired(true))),

  async execute(interaction) {
    const { id: discordId } = interaction.user;
    let receiveAddr = interaction.options.getString(OPTION_ADDRESS);
    const receiverUser = interaction.options.getUser(OPTION_RECEIVER);
    const amount = interaction.options.getInteger(OPTION_AMOUNT);
    const nanoAmount = (10 ** WALLET_CONFIG.coinDecimals) * amount;
    await interaction.deferReply({
      ephemeral: true,
    });
    try {
      const user = await User.findOne({ where: { discordId } });
      if (!user) { throw new Error('Please deposit first.'); }

      if (interaction.options.getSubcommand() === 'user') {
        const receiver = await User.findOne(
          { where: { discordId: receiverUser.id } },
        );
        if (!receiver) {
          throw new Error(
            `${receiverUser} doesn't have receiving address, they need to \`/register\` first.`,
          );
        }
        receiveAddr = receiver.receiveAddress;
      }
      if (!validateAddress(receiveAddr)) { throw new Error(`Invalid address: \`${receiveAddr}\``); }
      await interaction.editReply({
        content: `Sending ${amount} LIKE to ${receiverUser || receiveAddr}...`,
        ephemeral: true,
      });

      const { amount: balanceAmount } = await getBalance(user);

      if (balanceAmount < nanoAmount) { throw new Error('Balance not enough'); }

      const txHash = await send(user, receiveAddr, nanoAmount);

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Check Tx')
            .setStyle('Link')
            .setURL(`${ENDPOINT}/cosmos/tx/v1beta1/txs/${txHash}`),
        );

      await interaction.followUp({
        content: `<@${discordId}> sent ${amount} LIKE to ${receiverUser || receiveAddr}\ntx: ${txHash}`,
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
