const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../core/embeds.js');
const fs = require('node:fs').promises;
const path = require('node:path');
const audio = require('../../core/audio.js');
const console = require('../../db/console.js');

async function songDB() {
	try {
		const databasePath = path.join(__dirname, '../../db/songs.json');
		const data = await fs.readFile(databasePath, 'utf-8');
		const database = JSON.parse(data).map(song => song.title);
		return database;
	}
	catch (error) {
		console.logError(`Unable to find song database: ${error}`);
		return [];
	}
}


async function getQueue(interaction) {
	try {
		const queueData = audio.getSongQueue();
		return queueData;
	}
	catch (error) {
		console.logError(`Error reading queue data: ${error}`);
		return interaction.reply('Uh oh! There seems to be an issue with the queue data.');
	}
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Want to know what\'s in my mix? Got a request? Not feeling a track? You\'ve found the right location!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a song to the queue!')
				.addStringOption(option =>
					option
						.setName('title')
						.setDescription('Grab a song from the catalog and put it here!')
						.setAutocomplete(true)
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('Check out my current mix!'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Not interested in a certain song I see.')
				.addIntegerOption(option =>
					option
						.setName('index')
						.setDescription('What track is it?')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('clear')
				.setDescription('Record scratch moment!'),
		),

	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const choices = await songDB();
		const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));
		await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
	},

	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {

			const songTitle = interaction.options.getString('title');
			audio.addToQueue(interaction, songTitle);

		}
		else if (interaction.options.getSubcommand() === 'list') {

			// eslint-disable-next-line no-shadow
			const queueList = async (interaction) => {
				const queue = await getQueue();
				const formattedQueue = queue.map((song, index) => `**${index + 1}.** ${song.title} by ${song.artist}`).join('\n');

				if (queue.length === 0) {
					return interaction.reply('Looks like the queue is empty! Add some songs using `/queue add`.');
				}
				else {
					const embed = new createEmbed({
						title: 'Current Queue',
						description: formattedQueue,
					});
					interaction.reply({ embeds: [embed] });
				}
			};
			queueList(interaction);

		}
		else if (interaction.options.getSubcommand() === 'remove') {
			const position = interaction.options.getInteger('index');
			await audio.removeFromQueue(interaction, position);
		}
		else if (interaction.options.getSubcommand() === 'clear') {
			audio.removeFromQueue(interaction);
		}
	},
};