const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./db/config.json');
const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config();

const token = process.env.TOKEN;

const commands = [];
const clientId = process.env.DEV;
const guildId = (config.guildID);

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

	console.log('All commands are being cleared.')
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
		.then(() => console.log('Successfully deleted all guild commands.'))
		.catch(console.error);

})();