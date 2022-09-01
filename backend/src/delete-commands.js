import { Client, GatewayIntentBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import {
  CLIENT_ID,
  TOKEN,
} from './config.js';

const rest = new REST({ version: '10' }).setToken(TOKEN);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', () => {
  rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] })
    .then(() => {
      console.log('Successfully deleted all application commands.');
    })
    .catch(console.error)
    .finally(() => process.exit(0));
});

client.login(TOKEN);
