// Require the necessary discord.js classes
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { TOKEN, BACKEND_PORT } from './config.js';
import router from './router.js';
import { registerCommands, commands } from './register-commands.js';
import { initDB } from './db.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.commands = new Collection();

commands.forEach(
  (command) => client.commands.set(command.data.name, command),
);

client.once('ready', () => {
  Promise.all(
    client.guilds.cache.map(registerCommands),
  )
    .then(() => console.log('Ready'));
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

initDB();
client.login(TOKEN);
router.listen(BACKEND_PORT);
