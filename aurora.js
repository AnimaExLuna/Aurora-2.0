const { Client, GatewayIntentBits, Partials, Collection} = require('discord.js')
const { token } = require('./db/config.json');
const fs = require('node:fs');

const client = new Client({
	intents: [
	  GatewayIntentBits.Guilds,
	  GatewayIntentBits.GuildMessages,
	  GatewayIntentBits.GuildPresences,
	  GatewayIntentBits.GuildMessageReactions,
	  GatewayIntentBits.DirectMessages,
	  GatewayIntentBits.MessageContent
	],
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
  });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);


	client.commands.set(command.data.name, command);
}


client.login(token);
require('./db/loader')(client);


