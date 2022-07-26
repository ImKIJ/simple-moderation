const { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear up to 100 messages in the text channel!')
        .addUserOption(option =>
            option
                .setName("amount")
                .setDescription("amount of messages to clear (default: 100)")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        let amount = interaction.options.getNumber("amount") || 100;
        let messages = await interaction.channel.bulkDelete(amount);
        
        interaction.editReply({
            content: `:white_check_mark: Successfully deleted ${messages.size} messages!`
        });
	},
};