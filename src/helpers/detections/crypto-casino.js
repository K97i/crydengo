const { readText } = require('../image-fix/ocr.js');
const { modMember } = require('../mod-action.js');

async function imageUrlToBuffer(url) {
    const response = await fetch(url);

    if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();

        return Buffer.from(arrayBuffer);
    }

    return null;
}

async function cryptoDetection(message, cryptoConfig) {
    const attachment = message.attachments.first();
    if (attachment && attachment.contentType.startsWith('image/')) {
        const imageBuffer = await imageUrlToBuffer(attachment.url);
        if (imageBuffer) {
            const imageText = await readText(imageBuffer);
            let matches = [];

            cryptoConfig.keywords.forEach((keyword) => {
                matches.push(imageText.includes(keyword));
            });

            let count = 0;

            matches.forEach((item) => {
                if (item)
                    count++;
            });

            if (count >= cryptoConfig.threshold) {
                const log = await modMember(message, cryptoConfig.action, cryptoConfig.duration, 'Crypto casino scam detected!');
                return log;
            }
        }
        
    }
}

module.exports = { cryptoDetection };