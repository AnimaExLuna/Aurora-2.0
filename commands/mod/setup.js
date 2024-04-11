const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const console = require('../../db/console.js');
const playlist = require('../../core/mediaPlayer.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('This is how I show you the tunes!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const musicChannel = interaction.channel;

		try {
			/* console.logInfo('Calling playlist.createInitialEmbed...');
			const playerEmbed = await playlist.createInitialEmbed(musicChannel);
			console.logInfo('Embed created:', playerEmbed);

			await musicChannel.send({ embeds: [playerEmbed] }); */
			await playlist.mediaPlayerEmbed(musicChannel);

			await interaction.reply({
				content: 'Music player setup successfully!',
				ephemeral: true,
			});
			await wait(5_000);
			await interaction.deleteReply();
		}
		catch (error) {
			console.logError(`Error setting up music player: ${error}`);
			await interaction.reply({ content: 'Uh oh! There seems to be an issue setting up the playlist.', ephemeral: true });
		}
	},
};
