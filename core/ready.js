const { Events, ActivityType } = require('discord.js');
const fs = require('node:fs');
const console = require('../db/console.js');

const jsonData = fs.readFileSync('./db/status/default.json', 'utf-8');
const statuses = JSON.parse(jsonData);

const setStatus = (client) => {
    try {
        const values = statuses[Math.floor(Math.random() * statuses.length)];
        const activityType = parseInt(values.type);
        const activityTypeString = ActivityType[activityType];
        const activityText = values.text[Math.floor(Math.random() * values.text.length)];
        client.user.setPresence({
            activities: [{
                name: activityText,
                type: activityType
            }],
            status: 'online'
        });
        console.logInfo(`Activity set to: ${activityTypeString} ${activityText}`);
        console.logInfo(`Current presence: ${JSON.stringify(client.user.presence)}`);
    } catch (error) {
        console.logError(`Error setting presence: ${error}`);
    }
};

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            console.logStartup(client);
            console.logInfo(`Initializing Default Status File...`);
            console.logInfo(`Default status file loaded successfully.`);
            console.logBreak();

            setStatus(client);

            setInterval(() => {
                console.logInfo('Setting new random status...');
                setStatus(client);
            }, Math.floor(Math.random() * (60 * 60 * 1000 - 5 * 60 * 1000) + 5 * 60 * 1000));
        } catch (error) {
            console.logError(`Error loading default status file: ${error}`);
        } console.logBreak();
    }
};
