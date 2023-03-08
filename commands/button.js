const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { addCollector } = require('../core/collector.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('The Test Button.'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('test')
                    .setLabel('🤍')
                    .setStyle(ButtonStyle.Primary),
            );

            const collector = interaction.channel.createMessageComponentCollector({
                filter: i => i.customId === 'primary',
                time: 10000,
            });
    
            // Add the collector to the collectors array in collect.js
            addCollector(collector);
    
            await interaction.reply({ content: 'Is this working?', components: [row] });
        }

};