const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const console = require('./db/console.js');
const config = require('./db/config.json');
const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config();

const token = process.env.LIVETOKEN;

const commands = [];
const clientId = (config.clientID);

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {

		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.logInfo('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.logInfo('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.logError(error);
	}
})();