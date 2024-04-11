const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
require('dotenv').config();

const logChannelId = process.env.DEVLOG;

module.exports = {

	init: function(client) {
		this.logChannel = client.channels.cache.get(logChannelId);

		if (!this.logChannel) {
			console.error('Error retrieving log channel:', error);
		}
	},

	logStartup: function(client) {
		console.log(`Aurora > ${client.user.tag} is now ${chalk.green('online')}.`);
		console.log(`Aurora > Program started at: ${new Date()}`);

		this.sendLogMessage(
			`Aurora \`${client.user.tag}\` is now online!
      **Program started at:** ${new Date()}`,
		);
	},

	logBreak: function() {
		console.log('----------------------------------');
	},

	logInfo: function(message) {
		console.log(`${new Date().toISOString()} Aurora > ${chalk.blue('Info')}: ${message}`);
		this.sendLogMessage(`**Info:** ${message}`);
	},

	logError: function(message) {
		console.error(`${new Date().toISOString()} Aurora > ${chalk.red('Error')}: ${message}`);
		this.sendLogMessage(`**Error:** ${message}`, 'error');
	},

	logWarning: function(message) {
		console.warn(`${new Date().toISOString()} Aurora > ${chalk.yellow('Warning')}: ${message}`);
		this.sendLogMessage(`**Warning:** ${message}`, 'warning');
	},

	sendLogMessage: function(message, type = 'info') {
		const embed = new EmbedBuilder()
			.setTimestamp(new Date().getTime());
    
		switch (type) {
		case 'info':
			embed.setColor('#0099ff');
			break;
		case 'error':
			embed.setColor('#ff0000');
			break;
		case 'warning':
			embed.setColor('#ffff00');
			break;
		default:
			embed.setColor('#777777');
		}

		embed.setDescription(message);

		if (!this.logChannel) {
			console.warn('Log channel not cached; messages not sent.');
			return;
		}

		this.logChannel.send({ embeds: [embed] })
			.catch(console.error);
	},
};
