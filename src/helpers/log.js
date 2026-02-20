const { EmbedBuilder } = require('discord.js');
const { get_config } = require('./guild-config.js');

async function logToChannel(client, guild, message) {
    
    const config = await get_config(guild, 'general');

    if (config.loggingChannel) {

        try {

            const channel = await client.channels.fetch(config.loggingChannel);
    
            if (channel && channel.isTextBased()) {
    
                let embedColor, embedTitle;
                switch (message.action) {
                    case 'timeout':
                        embedTitle = 'Timed out!';
                        embedColor = 0xe86d0f;
                        break;
    
                    case 'ban':
                        embedTitle = 'Banned!';
                        embedColor = 0xbd1306;
                        break;

                    case 'block':
                        embedTitle = 'Message Blocked!';
                        embedColor = 0x464363;
                        break;
                }
    
                const logEmbed = new EmbedBuilder()
                                        .setColor(embedColor)
                                        .setTitle(embedTitle)
                                        .setThumbnail(message.member.avatarURL())
                                        .setDescription(message.logMessage)
                                        .setFooter({ text: `Reason: ${message.reason}` });
    
                await channel.send({ embeds: [ logEmbed ] });
            }

        }
    
        catch (err) {
            console.warn('Logging failed!');
            console.warn(err);
        }

    }

}

module.exports = { logToChannel };