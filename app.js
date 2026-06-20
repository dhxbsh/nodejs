const { Client, GatewayIntentBits, ActivityType, REST, Routes } = require('discord.js');
const express = require('express');

// 1. سيرفر ويب لإبقاء البوت متصلاً
const app = express();
app.get('/', (req, res) => res.send('SH CLAN BOT IS ONLINE!'));
app.listen(process.env.PORT || 8080);

// 2. إعداد البوت
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 3. تعريف الأوامر (Slash Commands)
const commands = [
    {
        name: 'menu',
        description: 'عرض القائمة الرئيسية للكلان'
    }
];

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('SH CLAN', { type: ActivityType.Playing });

    // تسجيل الأوامر
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN || process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Successfully registered commands.');
    } catch (error) {
        console.error(error);
    }
});

// 4. الرد على الأوامر (Slash Commands)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'menu') {
        await interaction.reply({
            content: 'مرحباً بك في قائمة **SH CLAN** الرئيسية! البوت يعمل الآن بشكل صحيح.'
        });
    }
});

// 5. الرد على الرسائل العادية
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() === 'menu' || message.content === 'قائمة') {
        await message.reply('هذه هي القائمة الرئيسية للكلان، جرب استخدام الأمر المدمج `/menu` أيضاً!');
    }
});

client.login(process.env.TOKEN || process.env.DISCORD_TOKEN);
