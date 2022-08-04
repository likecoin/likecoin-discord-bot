import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import {
  CLIENT_ID,
  GUILD_ID,
  TOKEN,
} from './config.js';

async function registerCommands() {
  const commandPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandPath).filter((file) => file.endsWith('.js'));

  const commands = await Promise.all(commandFiles.map(async (file) => {
    const filePath = path.join(commandPath, file);
    const command = (await import(filePath)).default
    console.log(command.data.name);
    return command;
  }));


  const rest = new REST({ version: '9' }).setToken(TOKEN);

  rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands.map((command) => command.data.toJSON()) },
  )
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
  return commands;
}

export default registerCommands;
