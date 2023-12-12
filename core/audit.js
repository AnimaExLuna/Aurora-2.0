const Discord = require('discord.js');
const config = require('../db/config.json');

const auditChannel = config.trackChan;

module.exports = message => {
  const client = message.client;

  // Define embed builder
  const embedBuilder = new Discord.EmbedBuilder()
    .setColor('#FF0000') // Set default color for audit log embeds
    .setFooter('Audit Log'); // Add a generic footer

  // Identify event type
  const eventType = message.guild.events.resolve(message);

  // Handle specific events
  switch (eventType) {
    case 'messageDelete':
      // Fetch audit logs related to message deletion
      message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE', limit: 1 })
        .then(auditLogs => {
          if (auditLogs.entries.first()) {
            const entry = auditLogs.entries.first();

            // Build embed with extracted data
            embedBuilder
              .setTitle('Message Deleted') // Set title specific to the event
              .addField('Deleted by', entry.executor.tag)
              .addField('Deleted for', message.author.tag)
              .addField('Deleted message content', message.cleanContent)
              .addField('Deleted channel', message.channel.name)
              .setTimestamp(entry.createdAt);

            // Send the embed to the audit log channel
            client.channels.cache.get(config.trackChan).send({ embeds: [embedBuilder] });
          }
        })
        .catch(error => console.error(error));
      break;
    case 'messageUpdate':
      if (message.content !== message.oldMessage.content) {
        // Fetch audit logs related to message update
        message.guild.fetchAuditLogs({ type: 'MESSAGE_UPDATE', limit: 1 })
          .then(auditLogs => {
            if (auditLogs.entries.first()) {
              const entry = auditLogs.entries.first();

              // Build embed with extracted data
              embedBuilder
                .setTitle('Message Edited') // Set title specific to the event
                .addField('Edited by', entry.executor.tag)
                .addField('Edited message content', message.content)
                .addField('Edited in channel', message.channel.name)
                .addField('Previous message content', message.oldMessage.content)
                .setTimestamp(entry.createdAt);

              // Send the embed to the audit log channel
              client.channels.cache.get(config.trackChan).send({ embeds: [embedBuilder] });
            }
          })
          .catch(error => console.error(error));
      }
      break;
    // Implement logic for other event types here
  }
};
