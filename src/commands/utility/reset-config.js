const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { config_defaults } = require('../../helpers/guild-config.js');

module.exports = {
	data: new SlashCommandBuilder()
				.setName('reset-config')
				.setDescription('Resets the current server\'s configuration')
				.addStringOption((option) => option
												.setName('category')
												.setDescription('Config category to reset')
												.setRequired(true)
												.addChoices(
													{ name: 'Automod', value: 'automod' },
													{ name: 'General', value: 'general' },
													{ name: 'Regex', value: 'regex' },
												)),
	async execute(interaction) {
        await config_defaults(interaction.guildId, interaction.options.getString('category'));

        await interaction.reply({
						content: `${interaction.options.getString('category')} config for guild ID ${interaction.guildId} reset.`,
						flags: MessageFlags.Ephemeral,
					});
	},
};