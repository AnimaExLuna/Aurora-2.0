const console = require('../db/console.js');
const config = require('../db/config.json');

module.exports = (client, message) => {

    if (message.author.bot) return;
    if (message.channel.type !== 'text') return;

    if (!message.content.startsWith(config.prefix)) return;

    const prefix = config.prefix;
    const args = message.content.split(' ');
    const command = args.shift().slice(config.prefix.length);

    try {
        let cmdFile = require(`../commands/${command}`);
        cmdFile.run(client, message, args);
    } catch (err) {
        console.logError(`Command' ${command} failed: \n${err.stack}`);
    };

}