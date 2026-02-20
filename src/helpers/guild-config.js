const { Keyv } = require('keyv');
const { KeyvSqlite } = require('@keyv/sqlite');
const { defaultSerialize, defaultDeserialize } = require('@keyv/serialize');
const { guildAutomodDefaults, guildGeneralDefaults, guildRegexDefaults } = require('../configs/database-defaults.json');

const guildAutomod = new KeyvSqlite('sqlite://databases/guild-automod.sqlite');
const guildGeneral = new KeyvSqlite('sqlite://databases/guild-general.sqlite');
const guildRegex = new KeyvSqlite('sqlite://databases/guild-regex.sqlite');

guildAutomod.on('error', (err) => console.error('Keyv connection error:', err));
guildGeneral.on('error', (err) => console.error('Keyv connection error:', err));
guildRegex.on('error', (err) => console.error('Keyv connection error:', err));

async function get_config (guildId, config){
    let result;

    switch (config) {
        case 'automod': 
            result = await guildAutomod.get(guildId);
            break;        
        case 'general':
            result = await guildGeneral.get(guildId);
            break;        
        case 'regex':
            result = await guildRegex.get(guildId);
            break;        
    }

    if (result)
        result = defaultDeserialize(result);

    return result;
}

async function set_config (guildId, config, data, serialize = false) {
    let result, serialized;

    serialized = serialize ? defaultSerialize(data) : data;

    switch (config) {
        case 'automod': 
            result = await guildAutomod.set(guildId, serialized);
            break;
        case 'general':
            result = await guildGeneral.set(guildId, serialized);
            break;
        case 'regex':
            result = await guildRegex.set(guildId, serialized);
            break;
    }

    return result;
}

async function config_defaults (guildId, config) {
    let result;

    switch (config) {
        case 'automod': 
            result = await guildAutomod.set(guildId, defaultSerialize(guildAutomodDefaults));
            break;        
        case 'general':
            result = await guildGeneral.set(guildId, defaultSerialize(guildGeneralDefaults));
            break;
        case 'regex':
            result = await guildRegex.set(guildId, defaultSerialize(guildRegexDefaults));
            break;
    }

    return result;
}

module.exports = { get_config, set_config, config_defaults };