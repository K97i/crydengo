const { SlashCommandBuilder, MessageFlags, ChannelType } = require('discord.js');
const { set_config, get_config } = require('../../helpers/guild-config.js');

module.exports = {
	data: new SlashCommandBuilder()
				.setName('set-logging-channel')
				.setDescription(`Sets this bot's logging channel`)
                .addChannelOption((option) => option
                                                .setName('channel')
                                                .setDescription('Channel to send this bot\'s logs to.')
                                                .setRequired(true)
                                                .addChannelTypes(ChannelType.GuildText)
                ),
                
	async execute(interaction) {
        let config = await get_config(interaction.guildId, 'general');

        config.loggingChannel = interaction.options.getChannel('channel').id;
        
        await set_config(interaction.guildId, 'general', config, true);

        await interaction.reply({
						content: `Logging channel for guild ID ${interaction.guildId} updated to channel: ${interaction.options.getChannel('channel')} (snowflake: ${interaction.options.getChannel('channel').id}).`,
						flags: MessageFlags.Ephemeral,
					})
	},
};