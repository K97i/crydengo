const Ajv = require("ajv");
const { getSchemas } = require('./schemas')
const ajv = new Ajv({ allErrors: true }); 

async function coreCheck(config, schema) {
    const validate = ajv.compile(schema);
    const valid = validate(config);

    if (valid)
        return true;

    console.log(validate.errors);

    return validate.errors;
}

async function validateConfig(config, category) {
    let validSchemaVersion = '',
        lastError;

    const schemas = getSchemas();

    for (const [version, schema] of schemas.entries()) {
        const validity = await coreCheck(config, schema.get(category + 'Schema'));
        if (validity === true)
            validSchemaVersion = version;
        else
            lastError = validity;
    }

    return {
        validSchemaVersion,
        lastError,
    };
}

module.exports = { validateConfig };