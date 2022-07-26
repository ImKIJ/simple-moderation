const { InteractionType } = require("discord.js");
module.exports = {
    data: {
        name: "interactionCreate"
    },
    /**
     * 
     * @param {import("discord.js").Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
	async execute(client, interaction) {
		if (interaction.type !== InteractionType.ApplicationCommand) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
	},
};