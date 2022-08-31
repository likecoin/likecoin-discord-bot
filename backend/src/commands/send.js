import { ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder } from 'discord.js';
import { LIKECOIN_CHAIN_ENDPOINT } from '../config.js';

import { User } from '../db.js';
import {
  getBalance, validateAddress, send, newDeposit, toNanoAmount,
} from '../utils/index.js';

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
    const { user, channel } = interaction;
    let receiveAddr = interaction.options.getString(OPTION_ADDRESS);
    const receiverUser = interaction.options.getUser(OPTION_RECEIVER);
    const amount = interaction.options.getInteger(OPTION_AMOUNT);
    await interaction.deferReply({
      ephemeral: true,
    });
    try {
      if (interaction.options.getSubcommand() === 'user') {
        receiveAddr = (await this.getReceiver(interaction, receiverUser)).receiveAddress;
      }
      if (!validateAddress(receiveAddr)) { throw new Error(`Invalid address: \`${receiveAddr}\``); }
      await interaction.editReply({
        content: `Sending ${amount} LIKE to ${receiverUser || receiveAddr}...`,
        ephemeral: true,
      });
      await this.send(interaction, receiveAddr, amount);
      if (interaction.inGuild()) {
        await channel.send({
          content: `${user} sent ${amount} LIKE to ${receiverUser || receiveAddr}`,
        });
      }
    } catch (err) {
      interaction.editReply({
        content: `${err}`,
      });
    }
  },

  async getReceiver(interaction, receiverUser) {
    const { user, channel } = interaction;
    if (receiverUser.id === user.id) { throw new Error('You cannot send LIKE to yourself.'); }
    const receiver = await User.findOne({ where: { discordId: receiverUser.id } });
    if (!receiver) {
      await channel.send({
        content: `${user} want to send LIKE to ${receiverUser} but they doesn't have receiving address, please \`/register\` first to receive LIKE.`,
      });
      throw new Error('Canceled');
    }
    return receiver;
  },

  async send(interaction, receiveAddr, amount) {
    const { user: { id: discordId } } = interaction;
    const nanoAmount = toNanoAmount(amount);
    console.log(nanoAmount);
    const user = await User.findOne({ where: { discordId } });
    if (!user) {
      return interaction.editReply(
        await newDeposit(discordId, 'You don\'t have any balance left. Please /deposit and try again'),
      );
    }

    const { amount: balanceAmount } = await getBalance(user);

    if (balanceAmount < nanoAmount) { throw new Error('Balance not enough. Please /deposit and try again'); }

    const txHash = await send(user, receiveAddr, nanoAmount.toString());

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Check Tx')
          .setStyle('Link')
          .setURL(`${LIKECOIN_CHAIN_ENDPOINT}/cosmos/tx/v1beta1/txs/${txHash}`),
      );

    return interaction.editReply({
      content: `Done\ntx: ${txHash}`,
      components: [row],
    });
  },
};
