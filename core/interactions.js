const { Events } = require('discord.js');

module.exports = {

    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`The command ${interaction.commandName} is not a valid command.`);
                return;
            }

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'Uh oh! Something went wrong with this command.',
                    ephemeral: true
                });
            }

        } 

    },
};