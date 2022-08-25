import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import {
  depub, translate, send, register, deposit, balance, likeMessage,
} from './commands/index.js';

import {
  CLIENT_ID,
  TOKEN,
} from './config.js';

export const commands = [
  depub,
  translate,
  deposit,
  send,
  register,
  balance,
  likeMessage,
];

export async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    const commandsMap = commands.map((command) => command.data.toJSON());
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commandsMap },
    );
    console.log('Successfully registered commands.');
  } catch (err) {
    console.error(err);
  }
}
