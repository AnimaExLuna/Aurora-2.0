const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clean')
    .setDescription('Clean up messages in a channel.')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of messages to clean.')
        .setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    if (amount <= 0 || amount > 100) {
      return await interaction.reply({
        content: 'You must provide a number between 1 and 100.',
        ephemeral: true,
      });
    }

    await interaction.channel.bulkDelete(amount, true);

    await interaction.reply({
      content: `Successfully deleted ${amount} messages.`,
      ephemeral: true,
    });
  },
};
