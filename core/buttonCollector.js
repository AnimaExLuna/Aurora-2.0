const { Collection } = require('discord.js');

// Create a collection to store all collectors
const collectors = new Collection();

/**
 * Add a new collector to the collection
 * @param {Interaction} interaction - The interaction object
 * @param {string} customId - The custom ID of the button to listen to
 * @param {Function} callback - The function to execute when the button is clicked
 * @returns {MessageComponentCollector} The newly created collector
 */
function addCollector(interaction, customId, callback) {
  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.customId === customId,
    time: 60000,
  });

  collector.on('collect', callback);

  collectors.set(customId, collector);

  return collector;
}

/**
 * Remove a collector from the collection
 * @param {string} customId - The custom ID of the collector to remove
 */
function removeCollector(customId) {
  const collector = collectors.get(customId);
  if (!collector) return;

  collector.stop();
  collectors.delete(customId);
}

/**
 * Clear all collectors from the collection
 */
function clearCollectors() {
  collectors.forEach((collector) => collector.stop());
  collectors.clear();
}

module.exports = {
  addCollector,
  removeCollector,
  clearCollectors,
};
