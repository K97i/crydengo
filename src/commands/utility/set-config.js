const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { set_config } = require('../../helpers/guild-config.js');

module.exports = {
	data: new SlashCommandBuilder()
				.setName('set-config')
				.setDescription('Gets the current server\'s configuration')
                .addStringOption((option) => option
                                                    .setName('category')
                                                    .setDescription('The config category you would like to replace.')
                                                    .setRequired(true)
                                                    .addChoices(
                                                        { name: 'Automod', value: 'automod' },
                                                        { name: 'General', value: 'general' },
                                                        { name: 'Regex', value: 'regex' },
                                                    ))
				.addAttachmentOption((option) => option
                                                    .setName('file')
                                                    .setDescription('The new config you would like to upload.')
                                                    .setRequired(true)),
	async execute(interaction) {
        const config = await (await fetch(interaction.options.getAttachment('file').url)).json();

        await set_config(interaction.guildId, interaction.options.getString('category'), config, true);

        await interaction.reply({
						content: `Config for guild ID ${interaction.guildId}, category ${interaction.options.getString('category')} updated.`,
						flags: MessageFlags.Ephemeral,
					});
	},
};