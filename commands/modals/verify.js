const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const console = require('../../db/console.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verification for the server.'),
    async execute(interaction) {
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verifyButton')
                    .setLabel('📜')
                    .setStyle(ButtonStyle.Primary),
            );
        await interaction.reply({
            content: 'Click here to verify.',
            components: [button],
            ephemeral: true,
        });
        const filter = (interaction) => interaction.customId === 'verifyButton' && interaction.user.id === interaction.message.interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {

            const verifyCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            if (interaction.isButton()) {
                if (interaction.customId === 'verifyButton') {
                    const modal = new ModalBuilder()
                        .setCustomId('verifyModal')
                        .setTitle('Please verify yourself.')
                        .addComponents([
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('verifyModal')
                                    .setLabel(`Your verification code is: \`${verifyCode}\`.`)
                                    .setStyle(TextInputStyle.Short)
                                    .setMinLength(6)
                                    .setMaxLength(12)
                                    .setPlaceholder('A1B2C3')
                                    .setRequired(true),
                            ),
                        ]);

                    await interaction.showModal(modal);

                    const filter = i => {
                        return i.user.id === interaction.user.id;
                    };

                    interaction.awaitModalSubmit({ time: 60_000, filter })
                        .then(async interaction => {
                            try {
                                const verifyEntry = interaction.fields.getTextInputValue('verifyModal');
                                console.logInfo(`User: ${interaction.user.username} - Verify code: ${verifyCode}.`);
                                console.logInfo(`User: ${interaction.user.username} - Verify entry: ${verifyEntry}.`);
                                if (verifyEntry === verifyCode) {
                                    const role = interaction.guild.roles.cache.find(role => role.name === 'Verified');
                                    await interaction.member.roles.add(role);

                                    button.components[0].setDisabled(true);
                                    button.components[0].setLabel('Verification Closed').setStyle(ButtonStyle.Secondary);

                                    await interaction.reply({ content: `Your verification code has been accepted.`, ephemeral: true });
                                    setTimeout(async () => {
                                        await interaction.deleteReply();
                                    }, 10000);
                                } else {
                                    await interaction.reply({ content: `This verification code is incorrect. Please try again.`, ephemeral: true });
                                    setTimeout(async () => {
                                        await interaction.deleteReply();
                                    }, 10000);
                                }
                            } catch (error) {
                                console.logError(error);
                            }
                        })
                        .catch(err => console.logWarning('The verification modal interaction was not collected.'));
                }
            }
        })
        collector.once('end', async () => {
            button.components[0].setDisabled(true);
            button.components[0].setLabel('Verification Closed').setStyle(ButtonStyle.Secondary);
            await interaction.editReply({ content: 'Verification has ended.', components: [button] });

            // Remove the button and interaction message after a delay of 5 seconds (5000 milliseconds)
            setTimeout(async () => {
                await interaction.editReply({ components: [] });
            }, 3000);

            setTimeout(async () => {
                await interaction.deleteReply();
            }, 3050);
        });
    },
};
