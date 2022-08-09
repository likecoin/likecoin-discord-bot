import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import depub from './commands/depub.js';
import translate from './commands/translate.js';

import {
  CLIENT_ID,
  GUILD_ID,
  TOKEN,
} from './config.js';

async function registerCommands() {
  const commands = [
    depub,
    translate,
  ];
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands.map((command) => command.data.toJSON()) },
    );
    console.log('Successfully registered application commands.');
  } catch (err) {
    console.error(err);
  }
  return commands;
}

export default registerCommands;
