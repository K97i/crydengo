const { SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder, MessageFlags } = require('discord.js');
const { update_version } = require('../../helpers/config/guild-config.js');

module.exports = {
	data: new SlashCommandBuilder()
				.setName('update-config-version')
				.setDescription('Updates the current server\'s configuration')
				.addStringOption((option) => option
												.setName('category')
												.setDescription('Which config to update')
												.setRequired(true)
												.addChoices(
													{ name: 'Automod', value: 'automod' },
													{ name: 'General', value: 'general' },
													{ name: 'Regex', value: 'regex' },
												))
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

	async execute(interaction) {
        await update_version(interaction.guildId, interaction.options.getString('category'));

        await interaction.reply({
                        content: `Config for guild ID ${interaction.guildId}, category ${interaction.options.getString('category')} updated.`,
                        flags: MessageFlags.Ephemeral,
                    });
	},
};