const { Events } = require('discord.js');
const { setBotStatus } = require('./presence.js');
const console = require('../db/console.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		try {
			console.init(client);

			console.logStartup(client);

			setBotStatus(client);

			setInterval(() => {
				console.logInfo('Setting new random status...');
				setBotStatus(client);
			}, Math.floor(Math.random() * (60 * 60 * 1000 - 5 * 60 * 1000) + 20 * 60 * 1000));
		}
		catch (error) {
			console.logError(`Error loading default status file: ${error}`);
		}
		console.logBreak();
	},
};

