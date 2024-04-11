const { audioManager, getSongQueue, queueEmitter, songDatabase } = require('./audio.js');
const { createEmbed } = require('./embeds.js');
const console = require('../db/console.js');

let currentSong = null;
let sentMessage;
let sessionCount = 0;

function formatQueueList(queueData) {
	if (!queueData || queueData.length === 0) return 'Queue is empty.';

	const formattedQueue = queueData.map((song, index) => `**${index + 1}.** ${song.title} by ${song.artist}`).join('\n');
	return formattedQueue;
}

audioManager.on('songCountUpdated', (updatedCount) => {
	sessionCount = updatedCount;
	console.logInfo(`Session count updated to: ${sessionCount}`);
});

async function mediaPlayerEmbed(musicChannel) {
	try {
		const embed = createEmbed({
			color: 0xFFFFFF,
			title: 'Music Player Setup Complete!',
			description: 'Ready to play your favorite tunes!',
			fields: [
				{
					name: '```Current Queue:```',
					value: 'No songs in the queue.',
				},
			],
			footer: {
				text: 'Use the `/play` command to start playing tracks and `/queue add` to add more!',
			},
		});

		console.logInfo(`Embed data: ${embed}`);
		sentMessage = await musicChannel.send({ embeds: [embed] });
	}
	catch (error) {
		console.logError(`Issue loading initial embed: ${error}`);
	}

	audioManager.on('newSong', async (song) => {
		console.logInfo('New song detected!');
		if (!song) return;

		currentSong = song;
		const updatedEmbed = updateEmbed(song, getSongQueue());

		try {
			await sentMessage.edit({ embeds: [updatedEmbed] });
		}
		catch (error) {
			console.logError(`Error editing message: ${error}`);
		}
	});

	queueEmitter.on('queueUpdated', async (songQueue) => {
		console.logInfo('Queue updated!');

		const updatedEmbed = updateEmbed(currentSong, songQueue);

		try {
			await sentMessage.edit({ embeds: [updatedEmbed] });
		}
		catch (error) {
			console.logError(`Error editing message: ${error}`);
		}
	});
	return sentMessage;
}

function updateEmbed(song, queueData) {
	if (!song) return;

	return createEmbed({
		color: 0x000000,
		author: {
			name: `${song.artist}`,
			icon_url: 'https://imgur.com/a/hppVtdj',
		},
		title: `___${song.title}___`,
		description: `${song.album}`,
		fields: [
			{
				name: 'Track Info:',
				value: `Genre: ${song.genre} | BPM: ${song.bpm} | Released: ${song.year} | Label: ${song.label}`,
			},
			{
				name: 'Upcoming Tracks:',
				value: formatQueueList(queueData) || 'Queue is empty.',
			},
			{
				name: 'Lyrics:',
				value: `${song.lyrics}`,
			},
		],
		footer: {
			text: `Aurora | Database: ${songDatabase.length} | Plays: ${sessionCount}`,
		},
	});
}

module.exports = {
	mediaPlayerEmbed,
};
