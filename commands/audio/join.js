const { SlashCommandBuilder, VoiceConnectionStatus } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const audio = require('../../core/audio.js');
const console = require('../../db/console.js');
const response = require('../../db/response.js');
const wait = require('node:timers/promises').setTimeout;

const alreadyConnectedMessage = 'I\'m already in here! Pick a track for me to play, friend!';
const joinError = 'I\'m currently having trouble joining the voice channel. Give me a moment and try again in a bit!';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Here to play you the latest tunes and tracks by the Captain!'),

	async execute(interaction) {
		if (interaction.channel.id !== process.env.MUSIC_TRACK) {
			return await interaction.reply({
				content: `Whoa! Make sure you use all audio commands in the <#${process.env.MUSIC_TRACK}> channel!`,
				ephemeral: true,
			});
		}

		console.logInfo(`Voice connection status: ${audio.connection}`);
		if (audio.connection && audio.connection.status === VoiceConnectionStatus.Connected) {
			return interaction.reply(alreadyConnectedMessage);
		}

		try {
			console.logInfo('Attempting to join the voice channel. . .');
			audio.connection = await joinVoiceChannel({
				channelId: process.env.MUSIC_CHAN,
				guildId: interaction.guild.id,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});
			console.logInfo('Successfully joined voice channel.');
			await interaction.reply({
				content: await response.getResponse('join'),
				ephemeral: true,
			});
			await wait(5_000);
			await interaction.deleteReply();
		}
		catch (error) {
			console.logError(`Error joining voice channel: ${error}.`);
			interaction.reply(joinError);
		}
	},
};
