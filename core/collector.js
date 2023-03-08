const console = require('../db/console.js');
const collectors = [];

// Add a collector to the collectors array
function addCollector(collector) {
    collectors.push(collector);
}

// Listen for button interactions
function startListening() {
    for (const collector of collectors) {
        collector.on('collect', async interaction => {
            // Do something with the interaction here
            console.logInfo(`Button clicked by ${interaction.user.tag}`);
            await interaction.reply('Button clicked!');

            // Remove the collector after it's been used
            collector.stop();
        });
    }
}

module.exports = { addCollector, startListening };
