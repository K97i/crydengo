const { userMention } = require('discord.js');

async function modMember(message, action, duration, reason) {
    try {
        const user = message.member.user, originalMessage = message.content;
        let logMessage = '';

        switch (action) {
            case 'block':
                await message.delete();
                
                logMessage = `Blocked message from ${userMention(message.member.user.id)} (${message.member.user.globalName} / ${message.member.user.username}).`;
                break;

            case 'timeout':
                await message.delete();
                await message.member.timeout(duration * 60 * 60 * 1000);
                
                logMessage = `Timed out ${userMention(message.member.user.id)} (${message.member.user.globalName} / ${message.member.user.username}) for ${duration} hours`;
                break;

            case 'ban':
                await message.member.ban({
                    deleteMessageDays: duration <= 7 ? duration : 7,
                    reason: reason,
                });
                
                logMessage = `Banned ${userMention(message.member.user.id)} (${message.member.user.globalName} / ${message.member.user.username})`;
                break;

            case 'none':
                break;
        }

        if (action != 'none') {
            return {
                member: user,
                originalMessage: originalMessage,
                logMessage: logMessage,
                reason: reason,
                action: action,
            };
        }
    }

    catch (err) {
        console.warn('Moderation action failed!');
        console.warn(err);
    }
}

module.exports = { modMember };