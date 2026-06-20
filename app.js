const { Client, GatewayIntentBits, ActivityType, REST, Routes } = require('discord.js');
const express = require('express');

// سيرفر ويب للحفاظ على اتصال البوت
const app = express();
app.get('/', (req, res) => res.send('BOT IS ONLINE'));
app.listen(process.env.PORT || 8080);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`[SUCCESS] Logged in as ${client.user.tag}!`);
    client.user.setActivity('SH CLAN', { type: ActivityType.Playing });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() === 'menu' || message.content === 'قائمة') {
        message.reply('أهلاً بك في قائمة SH CLAN الرئيسية!');
    }
});

// تسجيل الدخول مع تأمين التوكن
const token = process.env.TOKEN;
if (!token) {
    console.error('ERROR: TOKEN is missing in Railway Variables!');
} else {
    client.login(token).catch(err => console.error('Login Error:', err));
}
