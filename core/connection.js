const { Events } = require('discord.js');
const console = require('../db/console.js');

module.exports = {
    name: Events.Disconnect,
    once: false,
    async execute(client) {
        console.logWarn(`I've disconnected from the servers! Give me a moment...`);
    },
};

module.exports = {
    name: Events.Reconnecting,
    once: false,
    async execute(client) {
        console.logInfo(`Connection reestablished; we're back online!`);
    },
};