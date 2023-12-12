const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modal')
    .setDescription('Displays a modal dialog.'),
  async execute(interaction, client) {

    const modal = new ModalBuilder()
      .setCustomId('colors')
      .setTitle('Favorite Color?');

    const colorInput = new TextInputBuilder()
      .setCustomId('favoriteColorInput')
      .setLabel("What's your favorite color?")
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(colorInput);

    modal.addComponents(firstActionRow);

    console.log('Opening Modal');
    await interaction.showModal(modal);
    console.log('Modal Opened');

    const filter = i => {
      return i.user.id === interaction.user.id;
    };

    interaction.awaitModalSubmit({ time: 60_000, filter })
      .then(async interaction => {
        try {
          const color = interaction.fields.getTextInputValue('favoriteColorInput');
          console.log(`Color: ${color}.`);
          await interaction.reply({ content: `You picked the color ${color}!`, ephemeral: true });
        } catch (error) {
          console.error(error);
        }
      })
      .catch(err => console.log('No modal submit interaction was collected'));


  }

};
