const { SlashCommandBuilder } = require('discord.js');


module.exports = {

    data: new SlashCommandBuilder()
        .setName('assist')
        .setDescription('Send a message to the captain!'),
    execute(interaction) {

    }
};