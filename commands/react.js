const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('react')
		.setDescription('Test reaction command (for feel good points).'),
	async execute(interaction) {
		const message = await interaction.reply({ content: 'Time for a reaction test!', fetchReply: true});
        message.react('😏');
	},
};