import { SlashCommandBuilder } from '@discordjs/builders';
import { getBalance, formatCoin } from '../utils/index.js';
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
      if (!nanoAmount || nanoAmount === '0') { throw new Error('Balance not found. Please /deposit and try again'); }
      if (denom !== WALLET_CONFIG.coinMinimalDenom) { throw new Error(`Wrong denom: ${denom}`); }
      await interaction.reply({
        content: `sending address: \`${user.sendAddress}\`
deposit amount: ${formatCoin(nanoAmount)}
expiration: ${expiration}
receiving address: \`${user.receiveAddress}\`
`,
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
