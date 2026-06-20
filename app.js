const { Client, GatewayIntentBits, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// تسجيل أمر السلاش عند تشغيل البوت
client.once('ready', async () => {
    const command = new SlashCommandBuilder()
        .setName('menu')
        .setDescription('عرض قائمة SH CLAN الرئيسية');

    await client.application.commands.create(command);
    console.log('[SUCCESS] Slash command registered!');
});

// التعامل مع أوامر السلاش
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'menu') {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('members').setLabel('👤 الأعضاء').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('stats').setLabel('📊 الإحصائيات').setStyle(ButtonStyle.Secondary)
            );

        // ephemeral: true تعني الرسالة تظهر لك أنت فقط
        await interaction.reply({ content: 'أهلاً بك في قائمة SH CLAN الرئيسية:', components: [row], ephemeral: true });
    }
});

client.login(process.env.TOKEN);
