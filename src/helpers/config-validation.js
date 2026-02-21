const fs = require('node:fs');
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true }); 


async function coreCheck(config, schema) {
    const validate = ajv.compile(schema);
    const valid = validate(config);

    if (valid)
        return true;
}

async function validateJson(config, category) {

    let versionValidity = [];

    const foldersPath = path.join(__dirname, 'schemas');
    const schemaFolders = fs.readdirSync(foldersPath);

    for (const schema of schemaFolders) {
        const schemaPath = path.join(foldersPath, schema);
        const schemaFiles = fs.readdirSync(schemaPath).filter((file) => file.endsWith('.js'));
        
        for (const file of schemaFiles) {
            const filePath = path.join(commandsPath, file);
            const { automodSchema, generalSchema, regexSchema } = require(filePath);

            let valid = false;

            switch (category) {
                case 'automod':
                    valid = await coreCheck(config, automodSchema);
                    break;

                case 'general':
                    valid = await coreCheck(config, generalSchema);
                    break;

                case 'regex':
                    valid = await coreCheck(config, regexSchema);
                    break;
            }

            versionValidity.push({
                "version": file.slice(0, -3),
                "valid": valid
            })
        }
    }

    return versionValidity;
}

module.exports = { validateJson };