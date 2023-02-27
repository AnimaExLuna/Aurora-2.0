const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('permissions')
		.setDescription('Check out what I can do!'),
	async execute(interaction = new CommandInteraction()) {
        const permissions = interaction.guild.me.permissions;
        console.log(`Bot has the following permissions in this server:\n${permissions.toArray().join('\n')}`);
        await interaction.reply(`Bot has the following permissions in this server:\n${permissions.toArray().join('\n')}`);
	},
};