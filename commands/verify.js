const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Generates a verification code to grant access to the server.'),

    async execute(interaction) {
        const verificationCode = Math.random().toString(36).substring(2, 8);

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify-button')
                    .setLabel('Click to Verify')
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({
            content: `Please click the button below to verify yourself.`,
            components: [button]
        });

        const filter = (interaction) => interaction.customId === 'verify-button' && interaction.user.id === interaction.message.interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.isButton()) {
                if (interaction.customId === 'verify-button') {
                    const modal = new ModalBuilder()
                        .setCustomId('verify-modal')
                        .setTitle('Please verify yourself.')
                        .addComponents([
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('verify-input')
                                    .setLabel(`Your verification code is: \`${verificationCode}\`.`)
                                    .setStyle(TextInputStyle.Short)
                                    .setMinLength(6)
                                    .setMaxLength(12)
                                    .setPlaceholder('A1B2C3')
                                    .setRequired(true),
                            ),
                        ]);

                    await interaction.showModal(modal);
                }
            }

            if (interaction.isModalSubmit()) {
                console.log('Modal Submitted');
                if (interaction.customId === 'verify-modal') {
                    console.log('verify-modal');
                    const verificationInput = interaction.fields.getTextInputValue('verify-input');
                    console.log(`Verification input: ${verificationInput}`);
                    console.log(`Verification code: ${verificationCode}`);
                    if (verificationInput === verificationCode) {
                        const role = interaction.guild.roles.cache.find(role => role.name === 'Access');
                        await interaction.member.roles.add(role);
            
                        button.components[0].setDisabled(true);
            
                        button.components[0].setLabel('Verification Closed').setStyle(ButtonStyle.Secondary);
                        await interaction.editReply({ content: 'Verification successful. You now have access to the server.', components: [button] });
                        console.log('Verification successful');
                    } else {
                        await interaction.followUp({ content: 'Invalid verification code. Please try again.', ephemeral: true });
                        console.log('Invalid verification code');
                    }
                }
            }
            
            
        });

        collector.on('end', async () => {
            button.components[0].setDisabled(true);

            button.components[0].setLabel('Verification Closed').setStyle(ButtonStyle.Secondary);
            await interaction.editReply({ content: 'Verification has ended.', components: [button] });
        });
    },
};
