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

export async function registerCommands(guild) {
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    const commandsMap = commands.map((command) => command.data.toJSON());
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, guild.id),
      { body: commandsMap },
    );
    console.log(`Successfully registered commands to ${guild.name}.`);
  } catch (err) {
    console.error(err);
  }
}
