const { Events, Presence, ActivityType } = require('discord.js');
const fs = require ('node:fs');
const console = require('../db/console.js')

let activities = [];

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        console.logStartup(client);
        console.logInfo(`Initializing Default Status File...`);
        try {
            const jsonData = fs.readFileSync('./db/status/default.json', 'utf-8');
            activities = JSON.parse(jsonData);
            console.logInfo(`Default status file loaded successfully.`);
        } catch (error) {
            console.logError(`Error loading default status file: ${error}`);
        }

        // Set initial presence
        try {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            console.logInfo(`Selected activity: ${JSON.stringify(activity)}`);
            const activityType = ActivityType[activity.type];
            console.logInfo(`Selected activity type: ${activityType}`);
            const activityText = activity.text[Math.floor(Math.random() * activity.text.length)];
            console.logInfo(`Selected activity text: ${activityText}`);

            await client.user.setPresence({
              activity: {
                name: activityText,
                type: activityType,
              },
              status: 'online',
            });
            console.logInfo(`Activity set to: ${activityType} ${activityText}`);
          } catch (error) {
            console.logError(`Error setting presence: ${error}`);
          }

        // Set interval to change presence
        setInterval(() => {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            const activityType = ActivityType[activity.type];
            const activityText = activity.text[Math.floor(Math.random() * activity.text.length)];

            client.user.setPresence({
                activity: {
                    name: activityText,
                    type: activityType
                }
            }).then(() => {
                console.logInfo(`Activity set to: ${activityType} ${activityText}`);
            }).catch((error) => {
                console.logError(`Error setting activity: ${error}`);
            });
        }, 300000);
    }
};
