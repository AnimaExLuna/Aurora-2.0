const { Events } = require('discord.js');
const games = require('../db/games.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setActivity(games[Math.floor(Math.random() * (games.length))]);
		console.log(`Aurora 2.0 is now online. . . Info: ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	},
};