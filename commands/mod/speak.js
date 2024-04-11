const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../db/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('speak')
		.setDescription('Allow me to speak for you in the designated channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
			option.setName('input')
				.setDescription('What do you want me to say, captain?')),
};