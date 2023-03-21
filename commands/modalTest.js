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

    const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

    const filter = (interaction) => {
      return interaction.isMessageComponent() &&
        interaction.customId === 'testModal' &&
        interaction.componentType === 'BUTTON' &&
        interaction.customId === 'submit';
    };    

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (interaction) => {
      console.log(`User ${interaction.user.id} submitted the following:`);
      console.log(`Favorite color: ${interaction.values[0]}`);

      await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
    });

    collector.on('end', (collected, reason) => {
      console.log(`Collector ended: ${reason}`);
    });
  }
};
