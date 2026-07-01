const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, ChannelType, EmbedBuilder } = require('discord.js');
const { get_config, set_config } = require('../../helpers/config/guild-config.js');

module.exports = {
	data: new SlashCommandBuilder()
				.setName('set-honeypot')
				.setDescription('Sets this servers\'s honeypot channel')
                .addChannelOption((option) => option
                                                .setName('channel')
                                                .setDescription('Channel to set this servers\'s honeypot to.')
                                                .setRequired(true)
                                                .addChannelTypes(ChannelType.GuildText))
				.addBooleanOption((option) => option
													.setName('enable')
                                                    .setRequired(true)
													.setDescription('Should the bot enable the honeypot?'))
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
                
	async execute(interaction) {
        let config = await get_config(interaction.guildId, 'automod');

        config.honeypot.channel = interaction.options.getChannel('channel').id;
        
        if (interaction.options.getBoolean('enable'))
            config.honeypot.block = true;

        const honeypotChannel = await interaction.client.channels.fetch(config.honeypot.channel);

        const messages = await honeypotChannel.messages.fetch({ limit: 10 }), 
              botSentEmbed = messages.some(msg => msg.author.bot && msg.embeds.length > 0);;

        if (!botSentEmbed) {
            const honeypotEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Honeypot Channel')
                    .setDescription(`# DO NOT SEND MESSAGES IN THIS CHANNEL!
                        
                        If you send a message in this channel, **you will be kicked from the server!** This channel was made to catch bots and spammers.

**Kicked members**: ${config.honeypot.count}`)
                .setThumbnail('https://static.wikia.nocookie.net/herofanon/images/a/a5/Screenshot_20251116_181431_YouTube.jpg')
                .setFooter({ text: '"A honeypot is something whose purpose is to attract people and catch them doing something wrong, especially on the internet." - Collins Dictionary' });

            config.honeypot.embedSnowflake = (await honeypotChannel.send({ embeds: [honeypotEmbed] })).id;
        }

        await set_config(interaction.guildId, 'automod', config, true);

        await interaction.reply({
                        content: `Logging channel for guild ID ${interaction.guildId} updated to channel: ${interaction.options.getChannel('channel')} (snowflake: ${interaction.options.getChannel('channel').id}).`,
                        flags: MessageFlags.Ephemeral,
                    });
	},
};