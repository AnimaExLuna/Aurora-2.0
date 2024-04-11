const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../db/config.json');
const console = require('../../db/console.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('signal')
		.setDescription('Shooting signals toward silent stars.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addUserOption(option => option.setName('user').setDescription('Who is it?').setRequired(true))
		.addStringOption(option => option.setName('message').setDescription('What to tell them?').setRequired(true)),
	async execute(interaction) {
		const targetUser = interaction.options.getMember('user');
		const targetMessage = interaction.options.getString('message');

		const owner = config.ownerID;
		const signalChannel = config.assistChan;

		if (interaction.user.id !== owner) {
			return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
		}

		if (!interaction.guild.channels.cache.get(signalChannel).permissionsFor(interaction.member).has(PermissionFlagsBits.SendMessages)) {
			return interaction.reply({ content: 'This command can only be used in a specific channel.', ephemeral: true });
		}

		try {
			await targetUser.send(targetMessage);
			await interaction.reply({ content: 'Message sent successfully.', ephemeral: true });
		}
		catch (error) {
			console.logError(error);
			await interaction.reply({ content: 'There was an error sending the message.', ephemeral: true });
		}
	},
};