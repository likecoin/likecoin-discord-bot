import { SlashCommandBuilder } from '@discordjs/builders';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const COMMAND_NAME = 'help';

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Commands usage introduction'),

  async execute(interaction) {
    const p = path.join(__dirname, '..', '..', '..', 'docs', 'commands.md')
    const data = await fs.readFile(p);
    await interaction.reply({
      content: String(data),
      ephemeral: true,
    });
  },
};
