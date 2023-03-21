const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { addCollector } = require('../core/buttonCollector.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('button')
    .setDescription('The Test Button.'),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('testButton')
          .setLabel('🤍')
          .setStyle(ButtonStyle.Primary),
      );

    await interaction.reply({
      content: 'Is this working?',
      components: [row],
    });

    const collector = addCollector(interaction, 'testButton', async (button) => {
      await button.reply('Yay, it worked!');
    });

  },
};
