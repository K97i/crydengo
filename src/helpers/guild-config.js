const { Keyv } = require('keyv');
const { KeyvSqlite } = require('@keyv/sqlite');
const { defaultSerialize, defaultDeserialize } = require('@keyv/serialize');
const { guildAutomodDefaults, guildUsersDefaults, guildRegexDefaults } = require('../configs/database-defaults.json');

const guildAutomod = new KeyvSqlite('sqlite://databases/guild-automod.sqlite');
const guildUsers = new KeyvSqlite('sqlite://databases/guild-users.sqlite');
const guildRegex = new KeyvSqlite('sqlite://databases/guild-regex.sqlite');

guildAutomod.on('error', (err) => console.error('Keyv connection error:', err));
guildUsers.on('error', (err) => console.error('Keyv connection error:', err));
guildRegex.on('error', (err) => console.error('Keyv connection error:', err));

async function get_config (guildId, config){
    let result;

    switch (config) {
        case 'automod': 
            result = await guildAutomod.get(guildId);
            break;        
        case 'users':
            result = await guildUsers.get(guildId);
            break;        
        case 'regex':
            result = await guildRegex.get(guildId);
            break;        
    }

    if (result)
        result = defaultDeserialize(result);

    return result;
}

async function set_config (guildId, config, data) {
    let result, serialized = defaultSerialize(data);

    switch (config) {
        case 'automod': 
            result = await guildAutomod.set(guildId, serialized);
            break;
        case 'users':
            result = await guildUsers.set(guildId, serialized);
            break;
        case 'regex':
            result = await guildRegex.set(guildId, serialized);
            break;
    }

    console.log(result);

    return result;
}

async function config_defaults (guildId, config) {
    let result;

    switch (config) {
        case 'automod': 
            result = await guildAutomod.set(guildId, defaultSerialize(guildAutomodDefaults));
            break;        
        case 'users':
            result = await guildUsers.set(guildId, defaultSerialize(guildUsersDefaults));
            break;
        case 'regex':
            result = await guildRegex.set(guildId, defaultSerialize(guildRegexDefaults));
            break;
    }

    return result;
}

module.exports = { get_config, set_config, config_defaults };