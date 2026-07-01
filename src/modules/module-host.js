const { get_config } = require('../helpers/config/guild-config.js');
const { logToChannel } = require('../helpers/log.js');

const { cryptoDetection } = require('./crypto-casino/crypto-casino.js');
const { r18InviteDetection } = require('./r18/r18.js');
const { regexScan } = require('./regex-scan/regex-scan.js');

const inviteRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/([a-zA-Z0-9-]{2,32})/;

async function runScans(client, message) {
    // Ignore messages from other bots to prevent infinite loops
    if (message.author.bot) return;

	// CONFIG LOADING

	let log;
	const automodConfig = await get_config(message.guildId, 'automod'), regexConfig = await get_config(message.guildId, 'regex'); 

	// CHECKS
	
	try {
		// crypto image
		if (message.attachments && automodConfig.cryptoImages.block)
			log = await cryptoDetection(message, automodConfig.cryptoImages);
	
		// r18 invites
		if (!log && inviteRegex.test(message.content) && automodConfig.r18Invites.block) {
			invites = message.content.match(inviteRegex);
			log = await r18InviteDetection(message, automodConfig.r18Invites, invites);
		}
	
		// regex scan
		if (!log)
			log = await regexScan(message, regexConfig);

		// Logging functionality
		if (log)
			await logToChannel(client, message.guildId, log);
	}

	catch (err) {
		console.warn("Error!");
		console.warn(err);
	}
}

module.exports = { runScans };