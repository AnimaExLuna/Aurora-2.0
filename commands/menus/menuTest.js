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

        const collector = menuCollector(interaction, 'selector', async (menu) => {
            console.log(interaction);
            if (menu.user.id === interaction.user.id) {
                const selected = interaction.values ? interaction.values[0] : null;
                if (selected === 'Cat') {
                    await interaction.update('A feline lover!');
                } else if (selected === 'Dog') {
                    await interaction.update('One with the pack!');
                } else if (selected === 'Bird') {
                    await interaction.update('Someone likes to fly high!');
                } else if (selected === 'Fish') {
                    await interaction.update('The ocean is your fishbowl!');
                }
            } else {
                menu.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
        });

    },
};