const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('r6info')
        .setDescription('Replies with your basic stats')
        .addStringOption((option: any) =>
            option.setName('username')
                .setDescription('Username')
                .setRequired(true)),
    async execute(interaction: any, r6api: any) {
        const username = interaction.options.getString('username')
        const platform = 'uplay';

        const { 0: player } = await r6api.findByUsername(platform, username);
        if (!player) {
            await interaction.reply('Player not found!')
            return null
        }

        const { 0: stats } = await r6api.getStats(platform, player.id);
        if (!stats) {
            await interaction.reply('Stats not found')
            return null
        }
        const { pvp: { general } } = stats;

        const { 0: level } = await r6api.getProgression(platform, player.id);
        if (!level) {
            await interaction.reply('Level not found')
            return null
        }
        const { 0: ranks } = await r6api.getRanks(platform, player.id);
        if (!ranks) {
            await interaction.reply('Ranks not found')
            return null
        }

        const season = Object.keys(ranks.seasons)[0]
        const rank = ranks.seasons[season].regions.emea.boards.pvp_ranked

        let rankColor = 0x000000

        // faster than switch o.O
        if (rank.current.mmr < 1500) {
            rankColor = 0xDC5526 //copper
        } else if (2000 > rank.current.mmr && rank.current.mmr >= 1500) {
            rankColor = 0xDF9B33 //bronze
        } else if (2600 > rank.current.mmr && rank.current.mmr >= 2000) {
            rankColor = 0xC0C0C0 //silver
        } else if (3200 > rank.current.mmr && rank.current.mmr >= 2600) {
            rankColor = 0xFFEE76 //gold
        } else if (4400 > rank.current.mmr && rank.current.mmr >= 3200) {
            rankColor = 0x4AC2C1 //plat
        } else if (5000 > rank.current.mmr && rank.current.mmr >= 4400) {
            rankColor = 0xB79DFE //diam
        } else if (rank.current.mmr >= 5000) {
            rankColor = 0xD74977 //champ
        }


        const embed = new EmbedBuilder()
            .setColor(rankColor)
            .setTitle(player.username)
            .setAuthor({ name: 'R6Info', iconURL: 'https://imgur.com/1ELl1Ze.jpg', url: 'https://discord.js.org' })
            .setThumbnail(player.avatar[500])
            .setDescription("Player's stats")
            .addFields(
                { name: 'KD ratio', value: general.kd.toString(), inline: true },
                { name: 'Win ratio', value: general.winRate.toString(), inline: true },
                { name: 'HS ratio', value: `${Math.round(general.headshots / (general.kills - general.meleeKills) * 100)}%`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Level', value: level.level.toString(), inline: true },
                { name: 'Play time', value: `${Math.round(general.playtime / 3600)}h`, inline: true },
                { name: '\u200B', value: 'Current season:' },
                { name: 'Current rank', value: `${rank.current.name} (${rank.current.mmr})`, inline: true },
                { name: 'Max rank', value: `${rank.max.name} (${rank.max.mmr})`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'KD ratio', value: rank.kd.toString(), inline: true },
                { name: 'Win ratio', value: rank.winRate.toString(), inline: true },
                { name: 'Skill', value: `${Math.round(rank.skillMean * 100) / 100} (\u00B1${Math.round(rank.skillStdev * 100) / 100})`, inline: true },
            )
            .setTimestamp()

        await interaction.reply({ content: 'Playters stats, ', embeds: [embed] })
    },
};

export { };