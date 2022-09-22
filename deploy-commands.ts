require('dotenv').config()
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const token = process.env.DISCORD_TOKEN ?? ''
const clientID = process.env.CLIENT_ID ?? ''
// const guildID = process.env.GUILD_ID ?? ''

const commands = new Array
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: String) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientID), { body: commands })
    .then((data: Array<JSON>) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error);

export { };