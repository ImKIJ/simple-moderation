/**
 * ImKIJ @ 2022
 * Github: ImKIJ / https://github.com/ImKIJ
 * Discord: KIJ#1664 / 752342629991055431
 */

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('node:path');
const walk = require("walk");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

walk
	.walk(path.join(__dirname, 'commands'))
	.on("file", (root, file, next) => {
		if(!file.name.endsWith(".js")) next();
		let cmdFile = require(path.join(root, file.name));
		if(!cmdFile?.data || !cmdFile?.execute) next();

		client.commands.set(cmdFile.data.name, cmdFile);
		console.log(`✔ Loaded ${cmdFile.data.name} command.`);

		next();
	});

walk
	.walk(path.join(__dirname, 'events'))
	.on("file", (root, file, next) => {
		if(!file.name.endsWith(".js")) next();
		let eventFile = require(path.join(root, file.name));
		if(!eventFile?.data || !eventFile?.execute) next();

		if(eventFile.data.once) client.once(eventFile.data.name, eventFile.execute.bind(null, client))
		else client.on(eventFile.data.name, eventFile.execute.bind(null, client));
		console.log(`✔ Loaded ${eventFile.data.name} event.`);
		
		next();
	});

client.login(process.env.DISCORD_TOKEN);