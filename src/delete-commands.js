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
  Promise.all(
    client.guilds.cache.map(
      (guild) => rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild.id), { body: [] })
        .then(() => console.log(`Successfully deleted all application commands for ${guild.name}.`))
        .catch(console.error),
    ),
  )
    .then(() => {
      console.log('Deleted all commands from all servers');
      process.exit(0);
    });
});

client.login(TOKEN);
