const { MessageEmbed } = require('discord.js');
const console = require('../db/console.js');

const timeouts = {
	0: null,
	15: 15000,
	30: 30000,

};

function createMessage(type = 'normal', timeout = 0) {
	if (!['normal', 'ephemeral'].includes(type)) {
		throw new Error(`Invalid message type: ${type}`);
	}

	if (!timeouts[timeout] && timeout !== 0) {
		throw new Error(`Invalid message timeout: ${timeout}`);
	}

	return async function sendMessage(interaction, content) {
		const embed = new MessageEmbed()
			.setDescription(content);

		if (type === 'ephemeral') {
			embed.setEphemeral(true);
		}

		const reply = await interaction.reply({ embeds: [embed] });

		if (timeouts[timeout]) {
			setTimeout(() => {
				try {
					reply.delete();
				}
				catch (error) {
					console.logError(`Error deleting reply message: ${error}`);
				}
			}, timeouts[timeout]);
		}

		return reply;
	};
}

const msgN = createMessage();
const msgN15 = createMessage('normal', 15);
const msgN30 = createMessage('normal', 30);

const msgE = createMessage('ephemeral');
const msgE15 = createMessage('ephemeral', 15);
const msgE30 = createMessage('ephemeral', 30);

module.exports = {
	msgN,
	msgN15,
	msgN30,
	msgE,
	msgE15,
	msgE30,
};
