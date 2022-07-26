const path = require('node:path');
const walk = require("walk");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();

const commands = [];
walk
	.walk(path.join(__dirname, 'commands'))
	.on("file", (root, file, next) => {
		if(!file.name.endsWith(".js")) next();
		let cmdFile = require(path.join(root, file.name));
		if(!cmdFile?.data || !cmdFile?.execute) next();

		commands.push(cmdFile.data.toJSON());
		next();
	})
	.on("end", () => {
		const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

		rest
			.put(Routes.applicationGuildCommands(process.env.DISCORD_USERID, process.env.DISCORD_GUILDID), { body: commands })
			.then(() => console.log('Successfully registered application commands.'))
			.catch(console.error);
	});