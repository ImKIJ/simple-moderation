module.exports = {
    data: {
        name: "ready",
        once: true
    },
    /**
     * 
     * @param {import("discord.js").Client} client 
     */
	async execute(client) {
		console.log(`Ready! ${client.user.tag} | Guilds: ${client.guilds.cache.size}`);
	},
};