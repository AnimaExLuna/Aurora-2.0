const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('log')
		.setDescription('Logs a message to the console.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	execute(interaction) {

		const message = interaction.options.getString('message');
		console.log(`[${interaction.user.tag}] ${message}`);
		interaction.reply('Message logged to the console!');
	},

};