const { joinVoiceChannel, entersState, AudioPlayerStatus, createAudioResource, AudioPlayer } = require('@discordjs/voice');
const EventEmitter = require('events');
const audioManager = new EventEmitter();
const queueEmitter = new EventEmitter();
const fs = require('node:fs').promises;
const path = require('node:path');
const metadata = require('music-metadata');
const wait = require('node:timers/promises').setTimeout;

const console = require('../db/console.js');
const musicFolder = './music';

let connection = null;
let songCount = 0;
let songDatabase = [];
const songQueue = [];
let totalCount = 0;

loadTotalCount();

class Song {
	constructor(title, artist, album, genre, bpm, website, picture, label, year, disk, lyrics, filename) {
		this.title = title;
		this.artist = artist;
		this.album = album;
		this.genre = genre;
		this.bpm = bpm;
		this.website = website;
		this.picture = picture;
		this.label = label;
		this.year = year;
		this.disk = disk;
		this.lyrics = lyrics;
		this.filename = filename;
	}
	getDisplayString() {
		return `${this.title} by ${this.artist}`;
	}
	getFormattedDuration(durationInSeconds) {
		const minutes = Math.floor(durationInSeconds / 60);
		const seconds = durationInSeconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
}

async function refreshSongDatabase() {
	const dbPath = path.join(__dirname, '../db/songs.json');
	songDatabase = [];

	try {
		await exploreSync(musicFolder);

		const data = JSON.stringify(songDatabase, null, 2);
		await fs.writeFile(dbPath, data, 'utf-8');
		console.logInfo(`Song database refreshed and saved to: ${dbPath}`);
		console.logInfo(`Database contains ${songDatabase.length} entries.`);
	}
	catch (error) {
		console.logError('Error refreshing and saving song database:', error);
	}
}

async function exploreSync(dirPath) {
	const files = await fs.readdir(dirPath);
	for (const file of files) {
		const filePath = path.join(dirPath, file);
		const stats = await fs.stat(filePath);

		if (stats.isDirectory()) {
			await exploreSync(filePath);
		}
		else if (stats.isFile()) {
			const filenameWithoutExt = path.parse(file).name;
			const formattedFilename = filenameWithoutExt.replace(
				/\w\S*/g,
				function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); },
			);

			let meta;
			try {
				meta = await metadata.parseFile(filePath);
			}
			catch (error) {
				console.logError(`Error reading metadata for ${file}: ${error}`);
			}

			const title = meta?.common.title || formattedFilename;
			const artist = meta?.common.artist || 'Unknown Artist';
			const album = meta?.common.album || 'Unknown Album';
			const genre = meta?.common.genre || 'Not Listed';
			const bpm = meta?.common.bpm || '???';
			const website = meta?.common.website || '';
			const picture = meta?.common.picture || '';
			const label = meta?.common.label || 'Unknown Label';
			const year = meta?.common.year || '????';
			const disk = meta?.common.disk || '?';
			const lyrics = meta?.common.lyrics || 'No Lyrics Provided';

			const songEntry = new Song(title, artist, album, genre, bpm, website, picture, label, year, disk, lyrics, filePath);
			songEntry.filename = filePath;
			songDatabase.push(songEntry);
		}
	}
}

const refreshInterval = 60 * 60 * 1000;
setInterval(refreshSongDatabase, refreshInterval);

refreshSongDatabase();

async function connect(channelId, guildId, adapterCreator) {
	try {
		songQueue.clear();
		const queuePath = path.join(__dirname, '../db/queue.json');
		await fs.promises.writeFile(queuePath, '[]', 'utf-8');

		connection = await joinVoiceChannel({
			channelId,
			guildId,
			adapterCreator,
		});
		console.logInfo(`Connected to voice channel: ${connection.channel.name}`);
	}
	catch (error) {
		console.logError('Error connecting to voice channel:', error);
	}
}

function disconnect() {
	if (connection) {
		const player = connection.subscription?.audioPlayer;
		if (player) {
			player.stop();
			connection.unsubscribe();
		}
		connection.destroy();
		connection = null;
		songQueue.clear();
		console.logInfo('Disconnected from voice channel');
	}
}

function isConnected() {
	return !!connection;
}

async function incrementSongCount() {
	songCount++;
	console.logInfo(`Incremented song count to: ${songCount}`);

	audioManager.emit('songCountUpdated', songCount);
}

async function incrementTotalCount() {
	const filePath = path.join(__dirname, '../db/totalSongCount.JSON');

	try {
		await fs.access(filePath, fs.constants.F_OK);

		const data = await fs.readFile(filePath, 'utf-8');
		totalCount = JSON.parse(data).totalCount;
	}
	catch (error) {
		if (error.code === 'ENOENT') {
			console.logInfo('Total song count file not found. Creating a new one...');
		}
		else {
			console.logError('Error reading total song count on update:', error);
		}
	}

	totalCount++;

	const data = JSON.stringify({ totalCount }, null, 2);
	await fs.writeFile(filePath, data, 'utf-8');
	console.logInfo('Total count updated!');
}


async function loadTotalCount() {
	const filePath = path.join(__dirname, '../db/totalSongCount.JSON');

	try {
		await fs.promises.access(filePath, fs.constants.F_OK);

		const data = await fs.promises.readFile(filePath, 'utf-8');
		console.logInfo('Loaded data from totalSongCount.JSON:', data);
		totalCount = JSON.parse(data).totalCount;
	}
	catch (error) {
		if (error.code === 'ENOENT') {
			console.logInfo('Total song count file not found. Initializing with count 0...');
		}
		else if (error.name === 'SyntaxError') {
			console.logError('Error parsing total song count data:', error);
			totalCount = 0;
		}
		else {
			console.logError('Error reading total song count on load:', error);
		// Handle other potential errors (optional)
		}
	}

	return totalCount;
}

const getCurrentChannel = () => connection?.channel;

// eslint-disable-next-line no-shadow
async function playNextSong(connection) {
	if (songQueue.length > 0) {
		try {
			const nextSong = songQueue.shift();
			const songTitle = nextSong.title;
			console.logInfo(`Next song: ${songTitle}.`);
			await playAudio(null, connection, songTitle);
		}
		catch (error) {
			console.logError(`Error playing next song: ${error}`);
			return Promise.reject(error);
		}
	}
	else {
		console.logInfo('Queue is empty. Please add more songs.');
		return Promise.resolve();
	}
}

// eslint-disable-next-line no-shadow
async function playAudio(interaction = null, connection, songTitle) {
	const matchingSongs = songDatabase.filter(song => song.title.toLowerCase() === songTitle.toLowerCase());

	if (matchingSongs.length === 0) {
		return interaction.reply(`Sorry, couldn't find a song with the title "${songTitle}"`);
	}

	if (matchingSongs.length > 1) {
		return;
	}

	const matchedSong = matchingSongs[0];
	incrementSongCount();
	incrementTotalCount();

	if (!connection) {
		return interaction.reply('I\'m not connected to a voice channel yet. Please use the "/join" command first!');
	}

	if (interaction) {
		interaction.reply({
			content: 'Let\'s play some tunes!',
			ephemeral: true,
		});
		await wait(1_000);
		await interaction.deleteReply();
	}

	try {
		console.logInfo(`Now starting audio playback of ${matchedSong.filename}`);

		const resource = createAudioResource(matchedSong.filename);

		const player = new AudioPlayer();
		connection.subscribe(player);

		player.play(resource);


		player.on('playing', () => {
			console.logInfo(`Playback of ${matchedSong.title} has started!`);
		});

		audioManager.emit('newSong', matchedSong, songCount, totalCount);
		await entersState(player, AudioPlayerStatus.Playing, 1000);

		player.on('idle', async () => {
			console.logInfo('Playback finished. Attempting to play next song...');
			if (songQueue.length > 0) {
				await playNextSong(connection);
			}
			else {
				console.logInfo('The queue is empty. Please add more songs for playback.');
			}
		});


		player.on('error', (error) => console.logError(`Error during playback: ${error}`));
		return matchedSong;

	}
	catch (error) {
		console.logError(`Error playing audio: ${error}`);
		return interaction.reply('Uh oh! There seems to be an issue. Please try again later.');
	}
}


async function addToQueue(interaction, songTitle) {
	const queuePath = path.join(__dirname, '../db/queue.json');
	console.logInfo(`Attempting to add song "${songTitle}" to queue.`);

	const matchingSongs = songDatabase.filter(song => song.title.toLowerCase() === songTitle.toLowerCase());

	if (matchingSongs.length > 0) {
		const matchedSongObject = matchingSongs[0];

		if (!songQueue.some(songObject => songObject.title.toLowerCase() === songTitle.toLowerCase())) {
			songQueue.push(matchedSongObject);
			console.logInfo(`Adding ${matchedSongObject.title} to the queue.`);

			try {
				await updateQueueFile(songQueue);
				console.logInfo(`Updated queue data saved to: ${queuePath}`);
				queueEmitter.emit('queueUpdated', songQueue.slice());
			}
			catch (error) {
				console.logError(`Error saving queue data: ${error}.`);
				interaction.reply({
					content: 'There was an issue updating the queue. Please try again later.',
					ephemeral: true,
				});
				await wait(5_000);
				await interaction.deleteReply();
			}
			interaction.reply({
				content: `Added **${matchedSongObject.getDisplayString()}** to the queue!`,
				ephemeral: true,
			});
			await wait(5_000);
			await interaction.deleteReply();
		}
		else {
			interaction.reply({
				content: `**${songTitle}** is already in the queue!`,
				ephemeral: true,
			});
			await wait(5_000);
			await interaction.deleteReply();
		}
	}
	else {
		interaction.reply({
			content: `Sorry, couldn't find a song with the title "${songTitle}"`,
			ephemeral: true,
		});
		await wait(5_000);
		await interaction.deleteReply();
	}
}

async function removeFromQueue(interaction, position = null) {
	const queuePath = path.join(__dirname, '../db/queue.json');

	if (songQueue.length === 0) {
		return interaction.reply('The queue is already empty!');
	}

	if (isNaN(position) || position < 1 || position > songQueue.length) {
		return interaction.reply({ content: 'Invalid position! Please enter a number between 1 and ' + songQueue.length, ephemeral: true });
	}

	const removedSong = songQueue.splice(position - 1, 1)[0];

	try {
		if (position === null) {
			songQueue.length = 0;
			console.logInfo('Queue cleared.');
		}
		else {
			console.logInfo(`Removed song **${removedSong.title}** from queue at position ${position}`);
		}

		await updateQueueFile(songQueue, interaction);
		console.logInfo(`Updated queue data saved to: ${queuePath}`);
		queueEmitter.emit('queueUpdated', songQueue.slice());

		if (position === null) {
			interaction.reply({
				content: 'Cleared the queue!',
				ephemeral: true,
			});
			await wait(5_000);
			await interaction.deleteReply();
		}
		else {
			interaction.reply({
				content: `Removed **${removedSong.title}** from the queue!`,
				ephemeral: true,
			});
			await wait(5_000);
			await interaction.deleteReply();
		}
	}
	catch (error) {
		console.logError(`Error removing from queue: ${error}`);
		interaction.reply('Uh oh! There seems to be an issue. Please try again later.');
	}
}

async function updateQueueFile(queueData, interaction) {
	const queuePath = path.join(__dirname, '../db/queue.json');

	try {
		const queueDataJSON = JSON.stringify([...queueData], null, 2);
		await fs.writeFile(queuePath, queueDataJSON, 'utf-8');
	}
	catch (error) {
		console.logError(`Error saving queue data to ${queuePath}: ${error}`);
		interaction.reply('There was an issue updating the queue. Please try again later.');
	}
}

// eslint-disable-next-line no-shadow
function pauseAudio(connection) {
	if (connection) {
		const player = connection.subscription?.audioPlayer;
		if (player) {
			player.pause();
			console.logInfo('Playback paused.');
		}
	}
}

// eslint-disable-next-line no-shadow
function skipAudio(connection) {
	if (connection) {
		const player = connection.subscription?.audioPlayer;
		if (player) {
			player.stop();
			console.logInfo('Song skipped.');
		}
	}
}

// eslint-disable-next-line no-shadow
function stopAudio(connection) {
	if (connection) {
		const player = connection.subscription?.audioPlayer;
		if (player) {
			player.stop();
			connection.unsubscribe();
			console.logInfo('Playback stopped.');
			songQueue.length = 0;
		}
	}
}

module.exports = {
	addToQueue,
	audioManager,
	connect,
	connection: null,
	disconnect,
	getCurrentChannel,
	getSongQueue: () => songQueue,
	isConnected,
	pauseAudio,
	playAudio,
	queueEmitter,
	refreshSongDatabase,
	removeFromQueue,
	skipAudio,
	songCount,
	songDatabase,
	stopAudio,
};