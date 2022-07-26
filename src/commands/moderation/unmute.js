const { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmute user from takling!')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("user to unmute")
                .setRequired(true)    
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("reason")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        let user = interaction.options.getUser("user", true);
        let reason = interaction.options.getString("reason");

        let member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch({ user: user.id });
        if(!member) return interaction.editReply({
            content: `:x: Couldn't find ${user.tag} in the server.`
        });

        let muteRole = interaction.guild.roles.cache.find(role => role.name === "muted");
        if(!muteRole) return interaction.editReply({
            content: `:x Couldn't find the "muted" role in the server.`
        });

        if(!member.roles.cache.has(muteRole.id)) return interaction.editReply({
            content: `:x: User is not muted!`
        });
        
        member.roles.remove(muteRole.id);

        return interaction.editReply({
            content: `:white_check_mark: ${user.tag} has been unmuted for **${reason || "No Reason"}**`
        });
	},
};