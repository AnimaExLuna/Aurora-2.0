const { createEmbed } = require('./embeds.js');
const audio = require('./audio.js');
const console = require('../db/console.js');

async function getQueue() {
	try {
		const queueData = audio.getSongQueue();
		console.logInfo('queueData from getQueue:', queueData);
	}
	catch (error) {
		console.logError(`Error reading queue data: ${error}`);
		return 'Uh oh! There seems to be an issue with the queue data.';
	}
}

async function formatQueue() {
	const queue = await getQueue();
	console.logInfo('Current Queue format:', queue);
	if (!queue || queue.length === 0) {
		return 'Looks like the queue is empty! Start playing a song and then add more using `/queue add`!';
	}
	else {
		return queue.map((song, index) => (
			`**${index + 1}**. ${song.title} by ${song.artist} ${song.link ? `([Link](${song.link})):` : ':'}`
		)).join('\n');
	}
}

async function createInitialEmbed(musicChannel) {
	try {
		const embed = createEmbed({
			color: 0xFFFFFF,
			title: 'Music Player Setup Complete!',
			description: 'Ready to play your favorite tunes!',
			fields: [
				{
					name: 'Current Song:',
					value: 'No song playing yet.',
				},
				{
					name: 'Queue:',
					value: 'No songs in the queue.',
				},
			],
			Footer: {
				text: 'Type "/play [song title]" to start the music!',
			},
		});
		console.logInfo('Embed data: ', embed);
		await musicChannel.send({ embeds: [embed] });
	}
	catch (error) {
		console.logError(`Issue loading initial embed: ${error}`);
	}
}

async function createPlaylistEmbed(connection) {a
	console.logInfo('Playlist update active...');
	if (!connection) {
		console.logError('Error: Connection object not provided!');
		return;
	}
	let initialEmbedSent = false;
	const initialEmbed = createInitialEmbed();

	const nowPlaying = audio.matchedSong ? audio.matchedSong : null;
	const title = nowPlaying ? audio.matchedSong.title : 'Nothing Playing';
	const description = nowPlaying ? `by ${audio.matchedSong.artist}` : '';
	const formattedQueue = await formatQueue();
	const author = { name: nowPlaying ? 'Now Playing' : 'Nothing Playing' };
	const footer = { text: `Number of tracks in database: ${audio.songDatabase.length} | Total playcount ${audio.songCount}` };

	console.logBreak;
	console.logInfo(`
		Now Playing: ${nowPlaying ? JSON.stringify(audio.matchedSong, null, 2) : 'Nothing Playing'}
		Title: ${title}
		Description: ${description}
		Queue: ${formattedQueue}
		Author: ${JSON.stringify(author)}
		Footer: ${JSON.stringify(footer)}
	`);

	const embed = createEmbed({
		title: nowPlaying ? audio.matchedSong.title : 'Nothing Playing',
		description: nowPlaying ? `by ${audio.matchedSong.artist}` : '',
		fields: [{ name: 'Coming Up Next:', value: formattedQueue }],
		author: { name: nowPlaying ? 'Now Playing' : 'Nothing Playing' },
		footer: { text: `Number of tracks in database: ${audio.songDatabase.length} | Total playcount ${audio.songCount}` },
	});

	await musicChannel.send({ embeds: [embed] });

	const player = connection?.subscription?.audioPlayer;

	if (player) {
		player.on('playing', async () => {
			console.logInfo('Song change event triggered.');
			if (!initialEmbedSent) {
				const updatedEmbed = await createPlaylistEmbed();
				if (initialEmbed && updatedEmbed.title !== initialEmbed.embeds[0].title) {
					console.logInfo('Updating embed with new title', updatedEmbed.title);
					await initialEmbed.edit({ embeds: [updatedEmbed] });
				}
				else {
					console.logInfo('Title not changed for playback.');
				}
				initialEmbedSent = true;
			}
		});
	}
	else {
		console.logWarning('No audio player found on connection!');
	}

}

module.exports = {
	createInitialEmbed,
	createPlaylistEmbed,
};
