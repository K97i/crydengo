const { perspectiveFix } = require('../image-fix/perspective-fix.js');
const { readText } = require('../image-fix/ocr.js');
const { modMember } = require('../mod-action.js');

async function cryptoDetection(message, cryptoConfig) {
    const attachment = message.attachments.first();
    if (attachment && attachment.contentType.startsWith('image/')) {
        const imageUrl = attachment.url;
        const fixed = await perspectiveFix(imageUrl, cryptoConfig.imageRotation);
        const imageText = await readText(fixed);
        let matches = [];

        cryptoConfig.keywords.forEach((keyword) => {
            matches.push(imageText.includes(keyword));
        });

        let count = 0;

        matches.forEach((item) => {
            if (item)
                count++;
        });
        console.log(imageText);
        console.log(`Length: ${matches.length}`);
        console.log(matches);
        console.log(count);

        if (count >= cryptoConfig.threshold) {
            const log = await modMember(message, cryptoConfig.action, cryptoConfig.duration, 'Crypto casino scam detected!');
            return log;
        }
    }
}

module.exports = { cryptoDetection };