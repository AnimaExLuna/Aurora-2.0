const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips the current song and plays the next one in the queue.'),
	async execute(interaction, audio) {
		if (!audio.isConnected()) {
			return interaction.reply('I\'m not currently playing anything.');
		}

		const connection = audio.connection;
		const player = connection?.subscription?.audioPlayer;

		if (!player) {
			return interaction.reply('There is no song playing to skip.');
		}

		try {
			player.stop();
			interaction.reply('Skipped the current song!');
		}
		catch (error) {
			console.error('Error skipping audio:', error);
			interaction.reply('Something went wrong while skipping the song. Please try again later.');
		}
	},
};
