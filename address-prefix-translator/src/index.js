// Require the necessary discord.js classes
import { Client, Collection, Intents } from 'discord.js';

import { changeAddressPrefix } from './util.js';

import {
  TOKEN,
  TARGET_CHANNEL_ID,
  COMMAND_NAME,
  COMMAND_OPTION_NAME,
} from './config.js';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.commands = new Collection();

client.once('ready', () => console.log('Ready!'));

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === COMMAND_NAME) {
    if (interaction.channel.id !== TARGET_CHANNEL_ID) {
      await interaction.reply(`❎ Please use this command in the dedicated channel: <#${TARGET_CHANNEL_ID}>`);
      return;
    }
    const inputAddress = interaction.options.getString(COMMAND_OPTION_NAME);
    try {
      const outputAddress = changeAddressPrefix(inputAddress);
      await interaction.reply(`✅ Translate \`${inputAddress}\` to \`${outputAddress}\``);
    } catch (error) {
      await interaction.reply(`⚠️ Invalid address \`${inputAddress}\`. Please try again.`);
    }
  }
});

client.login(TOKEN);
