const { modMember } = require('../mod-action.js');

async function regexScan(message, regexConfig) {

    if (regexConfig.enhancedRegex){
        for (const regexEntry of regexConfig.regexList) {
            if (message.content.match(new RegExp(regexEntry.regex))){
                try {
                    let log = await modMember(message, regexEntry.action, regexEntry.duration, `Regex matched: ${regexEntry.regex}`);
                    return log;
                }

                catch (err) {
                    console.warn("Regex Scan failed!");
                    console.warn(err);
                }
            }
        }
    }
}

module.exports = { regexScan };