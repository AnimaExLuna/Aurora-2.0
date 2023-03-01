const { ActivityType } = require('discord.js');
const fs = require('node:fs');
const console = require('../db/console.js');

module.exports = (client, statusName) => {
    try {
        const jsonData = fs.readFileSync(`./db/status/${statusName}.json`, 'utf-8') || fs.readFileSync('./db/status/offline.json', 'utf-8');
        const statuses = JSON.parse(jsonData);
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
        //console.logInfo(`Current presence: ${JSON.stringify(client.user.presence)}`);
    } catch (error) {
        console.logError(`Error setting presence: ${error}`);
    }
};
