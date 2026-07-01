const { EmbedBuilder } = require('discord.js');
const { get_config, set_config } = require('../../helpers/config/guild-config.js');
const { modMember } = require('../../helpers/mod-action.js');

async function incrementCount(message) {
    let config = await get_config(message.guildId, 'automod');
    config.honeypot.count++;
    await set_config(message.guildId, 'automod', config, true);

    return config.honeypot.count;
}

async function honeypot(client, message, honeypotConfig) {
    let log;
    if (message.channelId === honeypotConfig.channel) {
        log = modMember(message, honeypotConfig.action, honeypotConfig.duration, 'Honeypot activated!');
        if (log) {
            if (honeypotConfig.embedSnowflake != "") {
                const honeypotChannel = await client.channels.fetch(honeypotConfig.channel),
                      embed = await honeypotChannel?.messages.fetch(honeypotConfig.embedSnowflake);

                const editedEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Honeypot Channel')
                    .setDescription(`# DO NOT SEND MESSAGES IN THIS CHANNEL!
                        
                        If you send a message in this channel, **you will be kicked from the server!** This channel was made to catch bots and spammers.

    **Kicked members**: ${await incrementCount(message)}`)
                    .setThumbnail('https://static.wikia.nocookie.net/herofanon/images/a/a5/Screenshot_20251116_181431_YouTube.jpg')
                    .setFooter({ text: '"A honeypot is something whose purpose is to attract people and catch them doing something wrong, especially on the internet." - Collins Dictionary' });

                await embed.edit({ embeds: [ editedEmbed ] });
            }
            
            try {
                if (message.deletable)
                    await message.delete();
            }
            catch {}

            return log;
        }
    }
}

module.exports = { honeypot };