const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, Events, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Select an animal.'),
    async execute(interaction) {

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selector')
                    .setPlaceholder('Animal?')
                    .addOptions(
                        {
                            label: 'Cat',
                            description: 'Rulers of the internet.',
                            value: 'first_option',
                        },
                        {
                            label: 'Dog',
                            description: `Man's best friend.`,
                            value: 'second_option',
                        },
                        {
                            label: 'Bird',
                            description: 'Tweet, chirp, fly.',
                            value: 'third_option',
                        },
                        {
                            label: 'Fish',
                            description: 'Glub glub.',
                            value: 'fourth_option',
                        },
                    ),
            );

        await interaction.reply({
            content: 'Choose an animal!',
            components: [row]
        });

        const filter = (interaction) => interaction.customId === 'selector' && interaction.user.id === interaction.message.interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            const selected = interaction.values[0];

            if (selected === 'Cat') {
                await interaction.reply('A feline lover!');
            } else if (selected === 'Dog') {
                await interaction.reply('One with the pack!');
            } else if (selected === 'Bird') {
                await interaction.reply('Someone likes to fly high!');
            } else if (selected === 'Fish') {
                await interaction.reply('The ocean is your fishbowl!');
            }

        })

    },
};