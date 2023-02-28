const { ActivityType, } = require("discord.js");
const console = require('../db/console.js');

module.exports = (client) => {
    client.presenceSelector = async () => {
        const options = [
            {
                type: "2",
                text: [
                    "to her creator's music.",
                    "to the newest songs.",
                    "to people complain about nothing."
                ]
            },

            {
                type: "3",
                text: [
                    "the latest anime.",
                    "her creator produce a new song.",
                    "paint dry."
                ]
            },
        ];
        const option = Math.floor(Math.random() * Options.length);

        client.user.setPresence({
            activities: [
                {
                    name: options[option].text,
                    name: options[option].type
                },
            ],
        })
            .catch(console.logStartup);
    };
};