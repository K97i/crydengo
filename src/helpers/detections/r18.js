const { modMember } = require('../mod-action.js');

async function r18InviteDetection(message, inviteConfig, invites) {
    // ['discord.gg/[INVITE-CODE]', undefined, undefined, 'discord.gg', 'gg', '[INVITE-CODE]']
    const inviteCode = invites[5];

    try {
        let matches = [];
        const inviteMetadata = await message.client.fetchInvite(inviteCode);

        inviteConfig.keywords.forEach((keyword) => {
            if (inviteMetadata.guild.description) {
                matches.push(inviteMetadata.guild.description.includes(keyword));
            }
            
            matches.push(inviteMetadata.guild.name.includes(keyword));
        });

        let count = 0;

        matches.forEach((item) => {
            if (item)
                count++;
        });

        if (count >= inviteConfig.threshold) {
            const log = await modMember(message, inviteConfig.action, inviteConfig.duration, '18+ invite detected!');
            return log;
        }
    }
    catch (err) {
        console.warn('Failed to get invite metadata!');
        console.warn(err);
    }
}

module.exports = { r18InviteDetection };