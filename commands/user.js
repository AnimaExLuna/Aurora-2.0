const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription(`Let's find out who you are!`),
    async execute(interaction) {
        await interaction.reply(`Hello, ${interaction.user.username}! You joined on ${interaction.memeber.joinedAt}.`);
    },

};