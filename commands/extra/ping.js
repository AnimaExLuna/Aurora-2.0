const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('If "Ping", therefor "Pong".'),
	async execute(interaction) {
		await interaction.reply('Pong!~');
	},
};