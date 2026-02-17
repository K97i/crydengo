// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { token } = require('./config.json');

const { perspectiveFix } = require('./image-fix/perspective-fix.js');
const { readText } = require('./image-fix/ocr.js');

// Create a new client instance
// Initialize the client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Required for the bot to be in servers
        GatewayIntentBits.GuildMessages, // Required to receive message events in servers
        GatewayIntentBits.MessageContent, // Privileged intent required to read message content, embeds, etc.
        GatewayIntentBits.DirectMessages // Required to receive DM events
    ]
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection(); 

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Log in to Discord with your client's token
client.login(token);

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return; 
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

// Listen for new messages
client.on('messageCreate', async (message) => {
    // Ignore messages from other bots to prevent infinite loops
    if (message.author.bot) return;

    // Log the message content to the console
    console.log(`New message from ${message.author.tag}: ${message.content}`);
    if (message.attachments) {
        const attachment = message.attachments.first();
		if (attachment && attachment.contentType.startsWith('image/')) {
			const imageUrl = attachment.url;
			const fixed = await perspectiveFix(imageUrl);
			const imageText = await readText(fixed);

			if (imageText.includes('crypto casino') && imageText.includes('launch') && imageText.includes('withdraw'))
				message.channel.send({
					content: 'Scam!'
				});
		}
    }
});