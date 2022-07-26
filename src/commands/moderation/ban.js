const { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban user from the server!')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("user to ban")
                .setRequired(true)    
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("reason")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        
        let user = interaction.options.getUser("user", true);
        let reason = interaction.options.getString("reason");
        
        if(user.id === interaction.user.id) return interaction.editReply({
            content: `:x: You cannot ban yourself.`
        });

        let member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch({ user: user.id });
        if(!member) return interaction.editReply({
            content: `:x: Couldn't find ${user.tag} in the server.`
        });

        if(interaction.user.id != interaction.guild.ownerId && interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.editReply({
            content: `:x: You cannot ban this user as their role is equal/higher than yours.`
        });

        if(!member.bannable) return interaction.editReply({
            content: `:x: I cannot ban ${user.tag}`
        });

        await member.ban({ reason: `${reason} | Moderator: ${interaction.user.id} (${interaction.user.tag})` });
        return interaction.editReply({
            content: `:white_check_mark: ${user.tag} has been banned for **${reason || "No Reason"}**`
        });
	},
};