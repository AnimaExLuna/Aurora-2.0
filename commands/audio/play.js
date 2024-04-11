const { SlashCommandBuilder } = require('discord.js');
const audio = require('../../core/audio.js');
const console = require('../../db/console.js');

function songDB() {
	try {
		const fs = require('node:fs');
		const path = require('node:path');

		const database = JSON.parse(fs.readFileSync(path.join(__dirname, '../../db/songs.json'))).map(song => song.title);
		return database;
	}
	catch (error) {
		console.logError(`Unable to find song database: ${error}`);
		return [];
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('What do you wanna hear?')
		.addStringOption(option =>
			option
				.setName('title')
				.setDescription('Select a track!')
				.setAutocomplete(true)
				.setRequired(true),
		),

	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const choices = songDB();
		const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));
		await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
	},

	async execute(interaction) {
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) {
			return interaction.reply('Don\'t try and play music without being able to hear it!');
		}

		console.logInfo('Attempting to retrieve song title. . .');
		const userTitle = interaction.options.getString('title');

		try {
			console.logInfo(`Retrieved song title: ${userTitle}`);
			await audio.playAudio(interaction, audio.connection, userTitle);
		}
		catch (error) {
			console.logError(`Error playing audio: ${error}`);
			interaction.reply('Something went wrong with playing the song. Sorry!');
		}
	},
};