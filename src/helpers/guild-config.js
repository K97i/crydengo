const { KeyvSqlite } = require('@keyv/sqlite');
const { defaultSerialize, defaultDeserialize } = require('@keyv/serialize');
const { defaults } = require('../configs/database-defaults.json');

const guildAutomod = new KeyvSqlite('sqlite://databases/guild-automod.sqlite');
const guildGeneral = new KeyvSqlite('sqlite://databases/guild-general.sqlite');
const guildRegex = new KeyvSqlite('sqlite://databases/guild-regex.sqlite');

guildAutomod.on('error', (err) => console.error('Keyv connection error:', err));
guildGeneral.on('error', (err) => console.error('Keyv connection error:', err));
guildRegex.on('error', (err) => console.error('Keyv connection error:', err));

async function get_config(guildId, config) {
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

    else {
        config_defaults(guildId, config);
        result = get_config(guildId, config);
    }

    return result;
}

async function set_config(guildId, config, data, serialize = false) {
    const serialized = serialize ? defaultSerialize(data) : data;
    let result;

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

async function config_defaults(guildId, config) {
    let result;

    switch (config) {
        case 'automod': 
            result = await guildAutomod.set(guildId, defaultSerialize(defaults.guildAutomodDefaults));
            break;        
        case 'general':
            result = await guildGeneral.set(guildId, defaultSerialize(defaults.guildGeneralDefaults));
            break;
        case 'regex':
            result = await guildRegex.set(guildId, defaultSerialize(defaults.guildRegexDefaults));
            break;
    }

    return result;
}

module.exports = { get_config, set_config, config_defaults };