const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const audio = require('../../core/audio.js');
const console = require('../../db/console.js');
const response = require('../../db/response.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Time to disconnect from the ship comms!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		console.logInfo(`Voice connection status: ${audio.connection}`);
		if (!audio.connection) {
			return interaction.reply('I\'m not currently connected to a voice channel.');
		}

		try {
			console.logInfo('Leaving the voice channel.');
			await audio.connection.destroy();
			audio.connection = null;
			console.logInfo('Successfully left voice channel.');
			await interaction.reply({
				content: await response.getResponse('leave'),
				ephemeral: true,
			});
			await wait(5_000);
			await interaction.deleteReply();
		}
		catch (error) {
			console.logError('Error leaving voice channel:', error);
			return interaction.reply('I\'m currently having trouble leaving the voice channel. Give me a moment and try again in a bit!');
		}
	},
};
