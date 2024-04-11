const { SlashCommandBuilder, InteractionReplyOptions, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Check a user\'s current status, including voice channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('The user to check (optional)')
				.setRequired(false),
		),

	async execute(interaction) {
		const member = interaction.options.getMember('user') || interaction.member;

		let voiceChannel;
		if (member.voice) {
			voiceChannel = member.voice.channel;
		}

		const replyContent = `**${member.user.tag}:**\n`;

		// Check online/offline status
		replyContent += `**Online:** ${member.presence.status === 'online' ? '✅ Yes' : '❌ No'}\n`;

		// Check voice channel state
		replyContent += `**Voice Channel:** ${member.voice?.channel?.name || 'Not connected'}`;


		await interaction.reply({
			content: replyContent,
			ephemeral: interaction.options.getMember('user') ? false : true,
		});
	},
};