// Require the necessary discord.js classes
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { registerCommands, commands } from './register-commands.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();

commands.forEach(
  (command) => client.commands.set(command.data.name, command),
);

client.once('ready', async () => {
  await registerCommands();
  console.log('Ready');
});

client.on('interactionCreate', async (interaction) => {
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: 'Something went wrong', ephemeral: true });
  }
});

client.on('guildCreate', async (guild) => {
  console.log(`Joined ${guild.name}: ${guild.id}`);
  await registerCommands(guild);
});

export function getUser(id) {
  return client.users.cache.get(id);
}

export default client;
