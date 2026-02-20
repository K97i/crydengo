const { SlashCommandBuilder, AttachmentBuilder, MessageFlags } = require('discord.js');
const { get_config } = require('../../helpers/guild-config.js');

module.exports = {
	data: new SlashCommandBuilder()
				.setName('get-config')
				.setDescription('Gets the current server\'s configuration')
				.addStringOption((option) => option
												.setName('category')
												.setDescription('Returns which guild config')
												.setRequired(true)
												.addChoices(
													{ name: 'Automod', value: 'automod' },
													{ name: 'General', value: 'general' },
													{ name: 'Regex', value: 'regex' },
												)),
	async execute(interaction) {
		const file = new AttachmentBuilder(Buffer.from(
			JSON.stringify(await get_config(interaction.guildId, interaction.options.getString('category')), null, '\t'),
		), { name: `${interaction.guildId}-config.json` });

        await interaction.reply({
						content: `Config for guild ID ${interaction.guildId} reset.`,
						files: [ file ],
						flags: MessageFlags.Ephemeral,
					});
	},
};