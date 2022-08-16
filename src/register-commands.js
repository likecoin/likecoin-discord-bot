import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import depub from './commands/depub.js';
import translate from './commands/translate.js';

import {
  CLIENT_ID,
  TOKEN,
} from './config.js';

export const commands = [
  depub,
  translate,
];

export async function registerCommands(guild) {
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, guild.id),
      { body: commands.map((command) => command.data.toJSON()) },
    );
    console.log(`Successfully registered commands to ${guild.name}.`);
  } catch (err) {
    console.error(err);
  }
}
