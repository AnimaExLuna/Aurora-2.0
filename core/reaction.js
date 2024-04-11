const reactions = require('../db/constants.js').emojis.reactions;
const console = require('../db/console.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot || message.channel.type === 'DM') return;

		for (const [word, emoji] of Object.entries(reactions)) {
			if (message.content.toLowerCase().includes(word)) {
				try {
					await message.react(emoji);
				}
				catch (error) {
					console.logError(`I could not react to this message: ${error}`);
				}
			}
		}
	},
};