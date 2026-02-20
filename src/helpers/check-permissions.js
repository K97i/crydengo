const { PermissionsBitField } = require('discord.js');
const { get_config } = require('./guild-config.js');

async function adminRole(interaction) {
    const config = await get_config(interaction.guildId, 'general');
    let permission = false;

    if (config.adminRoles) {
        for (const role of config.adminRoles) {
            if (interaction.member.roles.cache.has(role)) {
                permission = true;
                break;
            }
        }
    }
    
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
        permission = true;

    return permission;
}

module.exports = { adminRole };