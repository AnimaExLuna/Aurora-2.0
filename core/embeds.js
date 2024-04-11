const { EmbedBuilder } = require('discord.js');
const console = require('../db/console.js');

function createEmbed({ title = '', description = '', fields = [], color = '', url = '', author = null, thumbnail = null, image = null, timestamp = null, footer = null }) {
	try {
		const embed = new EmbedBuilder()
			.setTitle(title);

		if (color) {
			embed.setColor(color);
		}

		if (url) {
			embed.setURL(url);
		}

		if (author) {
			embed.setAuthor(author);
		}

		if (description) {
			embed.setDescription(description);
		}

		if (thumbnail) {
			embed.setThumbnail(thumbnail);
		}

		if (fields.length > 0) {
			embed.addFields(fields);
		}

		if (image) {
			embed.setImage(image);
		}

		if (timestamp) {
			embed.setTimestamp(timestamp);
		}

		if (footer) {
			embed.setFooter(footer);
		}

		return embed;
	}
	catch (error) {
		console.logError(`Error creating embed: ${error}`);
	}
}


module.exports = {
	createEmbed,
};
