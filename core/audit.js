/* const Discord = require('discord.js');
const config = require('../db/config.json');

const buildAuditEmbed = async (client, eventType, message) => {
  const auditLogs = await message.guild.fetchAuditLogs({ type: eventType, limit: 1 });
  const entry = auditLogs.entries.first();

  if (!entry) return;

  const embedBuilder = new Discord.EmbedBuilder()
    .setColor('#FF0000')
    .setFooter('Audit Log');

  switch (eventType) {
    case 'messageDelete':
      embedBuilder
        .setTitle('Message Deleted')
        .addField('Deleted by', entry.executor.tag)
        .addField('Deleted for', message.author.tag)
        .addField('Deleted message content', message.cleanContent)
        .addField('Deleted channel', message.channel.name)
        .setTimestamp(entry.createdAt);
      break;
    case 'messageUpdate':
      embedBuilder
        .setTitle('Message Edited')
        .addField('Edited by', entry.executor.tag)
        .addField('Edited message content', message.content)
        .addField('Edited in channel', message.channel.name)
        .addField('Previous message content', message.oldMessage.content)
        .setTimestamp(entry.createdAt);
      break;
    // Add additional cases for other event types
  }

  client.channels.cache.get(config.trackChan).send({ embeds: [embedBuilder] });
};

module.exports = async (message, client) => {
  const eventType = message.guild.events.resolve(message);

  switch (eventType) {
    case 'messageDelete':
    case 'messageUpdate':
      await buildAuditEmbed(client, eventType, message);
      break;
    // Add event listeners for other event types here
  }
};
 */