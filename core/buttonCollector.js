const { Collection } = require('discord.js');

const collectors = new Collection();

function buttonCollector(interaction, customId, callback) {
  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.customId === customId,
    time: 30000,
  });

  collector.on('collect', callback);

  collectors.set(customId, collector);

  return collector;
}

function removeCollector(customId) {
  const collector = collectors.get(customId);
  if (!collector) return;

  collector.stop();
  collectors.delete(customId);
}

function clearCollectors() {
  collectors.forEach((collector) => collector.stop());
  collectors.clear();
}

module.exports = {
  buttonCollector,
  removeCollector,
  clearCollectors,
};
