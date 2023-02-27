const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./db/config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);


	client.commands.set(command.data.name, command);
}


client.login(token);
require('./db/loader')(client);


