const { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mute user from takling!')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("user to mute")
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
        
        if(user.id === interaction.user.id) return interaction.editReply({
            content: `:x: You cannot mute yourself.`
        });

        let member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch({ user: user.id });
        if(!member) return interaction.editReply({
            content: `:x: Couldn't find ${user.tag} in the server.`
        });

        if(interaction.user.id != interaction.guild.ownerId && interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.editReply({
            content: `:x: You cannot mute this user as their role is equal/higher than yours.`
        });

        let muteRole = interaction.guild.roles.cache.find(role => role.name === "muted");
        if(!muteRole) {
            muteRole = await interaction.guild.roles.create({
                name: "muted",
                reason: "couldnt find the muted role, so I created one.",
                hoist: false
            });

            for await(let channel of interaction.guild.channels.cache.values()) {
                channel.permissionOverwrites.create(muteRole.id, {
                    Speak: false,
                    SendMessages: false
                });
            }
        }

        if(member.roles.cache.has(muteRole.id)) return interaction.editReply({
            content: `:x: User already muted!`
        });
        
        member.roles.add(muteRole.id);

        return interaction.editReply({
            content: `:white_check_mark: ${user.tag} has been muted for **${reason || "No Reason"}**`
        });
	},
};