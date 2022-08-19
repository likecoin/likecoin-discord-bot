import { SlashCommandBuilder } from '@discordjs/builders';
import { getBalance } from '../utils/index.js';
import { WALLET_CONFIG } from '../config.js';
import { User } from '../db.js';

const COMMAND_NAME = 'balance';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Get balance'),

  async execute(interaction) {
    const { id: discordId } = interaction.user;
    try {
      const user = await User.findOne({ where: { discordId } });
      if (!user) { throw new Error('User not found'); }
      const { expiration, denom, amount: nanoAmount } = await getBalance(user);
      if (denom !== WALLET_CONFIG.coinMinimalDenom) { throw new Error(`Wrong denom: ${denom}`); }
      const amount = Number(nanoAmount) / (10 ** WALLET_CONFIG.coinDecimals);
      await interaction.reply({
        content: `Balance: ${amount} ${WALLET_CONFIG.coinDenom}\nExpiration: ${expiration}`,
        ephemeral: true,
      });
    } catch (err) {
      await interaction.reply({
        content: `${err}`,
        ephemeral: true,
      });
    }
  },
};
