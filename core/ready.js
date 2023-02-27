const { Events } = require('discord.js');
const activities = require('../db/status/default.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Aurora 2.0 is now online. . . Info: ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        console.log(`Program started at: ${new Date().toLocaleString()}`);
        client.user.setPresence({
            activities: [{
                name: 'the latest anime.',
                type: 'WATCHING'
            }],
            status: 'online'
        });
        

        /* console.log(activities);

        setInterval(() => {
            console.log('Intializing Default Status File...')
            try {
                const activity = activities[Math.floor(Math.random() * activities.length)];
                console.log(`Activity set to: ${activity.type} ${activity.text[Math.floor(Math.random() * activity.text.length)]}`);
                client.user.setPresence(activity.text[Math.floor(Math.random() * activity.text.length)], { type: activity.type });
                console.log(`Status set as: ${JSON.stringify(activity)}`)
            } catch (error) {
                console.error('Error setting status:', error);
            }
        }, 300000); // Change status every 30 minutes. */

    },
};
