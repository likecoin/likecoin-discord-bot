// Require the necessary discord.js classes
import pkg from 'discord.js';
const { Client, Collection, GatewayIntentBits } = pkg;

import { TOKEN } from './config.js';
import registerCommands from './register-commands.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();
registerCommands()
  .then((commands) => commands.forEach(
    (command) => client.commands.set(command.data.name, command),
  ));

client.once('ready', () => console.log('Ready!'));

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

client.login(TOKEN);
