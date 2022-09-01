import { SlashCommandBuilder } from '@discordjs/builders';
import fs from 'node:fs';
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const COMMAND_NAME = 'help';

const helpPath = path.join(__dirname, '..', '..', '..', 'docs', 'commands.md')
const HELP_CONTENT = String(fs.readFileSync(helpPath, { encoding: 'utf-8' }))

export default {
  data: new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('Commands usage introduction'),

  async execute(interaction) {
    await interaction.reply({
      content: HELP_CONTENT,
      ephemeral: true,
    });
  },
};
