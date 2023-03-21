const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modal')
    .setDescription('Displays a modal dialog.'),
  async execute(interaction) {

    const modal = new ModalBuilder()
      .setCustomId('testModal')
      .setTitle('My Modal');

    const favoriteColorInput = new TextInputBuilder()
      .setCustomId('favoriteColorInput')
      .setLabel("What's your favorite color?")
      .setStyle(TextInputStyle.Short);

    const hobbiesInput = new TextInputBuilder()
      .setCustomId('hobbiesInput')
      .setLabel("What's some of your favorite hobbies?")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
    const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);

    const filter = (interaction) => interaction.customId === 'testModal';

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', (interaction) => {
      console.log(interaction);
      const colorInput = interaction.message.components[0].components.find(component => component.customId === 'favoriteColorInput');
      const hobbiesInput = interaction.message.components[1].components.find(component => component.customId === 'hobbiesInput');

      console.log(`Color: ${colorInput.value}`);
      console.log(`Hobbies: ${hobbiesInput.value}`);
    });

    collector.on('end', collected => {
      console.log(`Collected ${collected.size} items`);
    });
  }
};
