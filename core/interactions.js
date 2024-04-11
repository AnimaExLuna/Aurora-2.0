const { Events, InteractionType } = require('discord.js');
const console = require('../db/console.js');

module.exports = {

	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				console.logError(`The command ${interaction.commandName} is not a valid command.`);
				return;
			}

			try {
				await command.execute(interaction, client);
			}
			catch (error) {
				console.logError(error);
				await interaction.reply({
					content: 'Uh oh! Something went wrong with this command. Please try again later.',
					ephemeral: true,
				});
			}

		}
		else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				console.logError(`The command ${interaction.commandName} does not have autofill features.`);
				return;
			}

			try {
				await command.autocomplete(interaction, client);
			}
			catch (error) {
				console.logError(error);
			}
		}
	},
};