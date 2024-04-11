const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const response = require('../../db/response.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clean')
		.setDescription('Clean up messages in a channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The amount of messages to clean.')
				.setRequired(true)),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');

		if (amount <= 0 || amount > 100) {
			await interaction.reply({
				content: 'You must provide a number between 1 and 100.',
				ephemeral: true,
			});
			await wait(5_000);
			return await interaction.deleteReply();
		}

		await interaction.channel.bulkDelete(amount, true);

		await interaction.reply({
			content: await response.getResponse('clean'),
			ephemeral: true,
		});
		await wait(5_000);
		await interaction.deleteReply();
	},
};
