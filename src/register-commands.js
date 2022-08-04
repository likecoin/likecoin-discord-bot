import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import {
  CLIENT_ID,
  GUILD_ID,
  TOKEN,
  COMMAND_NAME,
  COMMAND_OPTION_NAME,
} from './config.js';

const commands = [
  new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Translate between Cosmos address and Like address')
    .addStringOption((address) => address.setName(COMMAND_OPTION_NAME)
      .setDescription('Cosmos address (cosmos1...) or Like address (like1...)')
      .setRequired(true)),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
