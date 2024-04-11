const { SlashCommandBuilder } = require('discord.js');
const audio = require('../../core/audio.js');
const console = require('../../db/console.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Puts a halt to the music.'),

	async execute(interaction) {
		console.logInfo('Attempting to stop the music playback. . .');

		if (audio.isConnected()) {
			return interaction.reply('I\'m not currently playing anything.');
		}

		try {
			audio.stopAudio(audio.connection);
			console.logInfo('Playback stopped successfully.');
			return interaction.reply('Stopped the music as requested!');
		}
		catch (error) {
			console.logError(`Error stopping audio playback: ${error}`);
			return interaction.reply('Something went wrong while stopping the music. Sorry!');
		}
	},
};