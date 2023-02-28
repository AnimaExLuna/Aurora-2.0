const { Events, Presence, ActivityType } = require('discord.js');
const activities = require('../db/status/default.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Aurora > ${client.user.tag} is now online.`);
        console.log(`Aurora > Program started at: ${new Date()}`);
        console.log(`Aurora > ----------------------------------`);
        console.log(`Aurora > Initializing Default Status File...`);
        console.log(`Aurora > Activities: ${JSON.stringify(activities)}`);

        setInterval(() => {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            const activityType = ActivityType[activity.type];
            const activityText = activity.text[Math.floor(Math.random() * activity.text.length)];

            client.user.setPresence({
            activity: {
                name: activityText,
                type: activityType
            }
        });
        console.log(`Aurora > Activity set to: ${activityType} ${activityText}`);
        }, 120000);
    }
};
