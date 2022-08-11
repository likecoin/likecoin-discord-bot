import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import {
  CLIENT_ID,
  GUILD_ID,
  TOKEN,
} from './config.js';

const rest = new REST({ version: '10' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
  .then(() => console.log('Successfully deleted all application commands.'))
  .catch(console.error);
