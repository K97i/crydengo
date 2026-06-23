const fs = require('node:fs');
const { basename, join } = require('path');

function getSchemas() {
    const modules = {};
    const allSchemas = new Map();

    fs.readdirSync(__dirname).forEach((file) => {
        if (file === 'index.js' || !file.endsWith('.js')) return;
        const moduleName = basename(file, '.js');
        modules[moduleName] = require(join(__dirname, file));
    });

    Object.entries(modules).forEach(([version, schema]) => {
        const currentSchema = new Map();

        if (schema && typeof schema === 'object') {
            Object.entries(schema).forEach(([name, entry]) => {
                currentSchema.set(name, entry);
            });
        }

        allSchemas.set(version, currentSchema);
    });

    return allSchemas;
}

module.exports = { getSchemas };