const { Keyv } = require('keyv');
const { KeyvSqlite } = require('@keyv/sqlite');
const { defaultSerialize, defaultDeserialize } = require('@keyv/serialize');
const { defaults } = require('../../configs/database-defaults.json');
const { validateConfig } = require('./config-validation.js');

const guildAutomod = new Keyv({ store: new KeyvSqlite('sqlite://databases/guild-automod.sqlite') });
const guildGeneral = new Keyv({ store: new KeyvSqlite('sqlite://databases/guild-general.sqlite') });
const guildRegex = new Keyv({ store: new KeyvSqlite('sqlite://databases/guild-regex.sqlite') });

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
        await config_defaults(guildId, config);
        result = get_config(guildId, config);
    }

    return result;
}

async function set_config(guildId, config, data, serialize = false, autocorrect) {
    let result;
    const validity = await validateConfig(data, config);

    if (!(validity.validSchemaVersion.length)) {
        if (autocorrect) {
            let source;
            switch (config) {
                case 'automod': 
                    source = defaults.guildAutomodDefaults;
                    break;        
                case 'general':
                    source = defaults.guildGeneralDefaults;
                    break;        
                case 'regex':
                    source = defaults.guildRegexDefaults;
                    break;        
            }
            data = await update(data, source);
            result = await set_config(guildId, config, data, true, false);
            return result
        }

        else {
            console.log(validity);
            return false;
        }
    }

    const serialized = serialize ? defaultSerialize(data) : data;

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

async function update(target, source) {
    if (typeof target === 'string') {
        try {
            target = JSON.parse(target);
        } catch (e) {
            console.error("Failed to parse target config string:", e);
            return;
        }
    }

    function mergeRecursively(targetObj, sourceObj) {
        for (const key in sourceObj) {
            if (!(key in targetObj)) {
                targetObj[key] = typeof structuredClone === 'function' 
                    ? structuredClone(sourceObj[key]) 
                    : JSON.parse(JSON.stringify(sourceObj[key]));
            } 
            
            else if (
                typeof targetObj[key] === 'object' && targetObj[key] !== null &&
                typeof sourceObj[key] === 'object' && sourceObj[key] !== null &&
                !Array.isArray(targetObj[key]) ) {
                mergeRecursively(targetObj[key], sourceObj[key]);
            }
        }
    }

    mergeRecursively(target, source);

    return target;
}

async function update_version(guildId, config) {
    let target;

    switch (config) {
        case 'automod': 
            target = await guildAutomod.get(guildId);
            source = defaults.guildAutomodDefaults
            break;        
        case 'general':
            target = await guildGeneral.get(guildId);
            source = defaults.guildGeneralDefaults;
            break;        
        case 'regex':
            target = await guildRegex.get(guildId);
            source = defaults.guildRegexDefaults;
            break;        
    }

    target = await update(target, source);
    await set_config(guildId, config, target, true, false);
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

module.exports = { get_config, set_config, config_defaults, update_version };