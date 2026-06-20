const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const express = require('express');

// 1. تشغيل سيرفر ويب وهمي لمنع منصة Railway من إغلاق البوت
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('SH CLAN BOT IS ONLINE 24/7!');
});

app.listen(port, () => {
    console.log(`Web server is running perfectly on port ${port}`);
});

// 2. إعداد البوت والصلاحيات اللازمة لقراءة الرسائل والتفاعل
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 3. حدث تشغيل البوت بنجاح وتحديد الحالة (Status)
client.once('ready', () => {
    console.log(`[SUCCESS] Logged in as ${client.user.tag}!`);
    
    // تعيين حالة البot (يلعب SH CLAN)
    client.user.setActivity('SH CLAN', { type: ActivityType.Playing });
});

// 4. الاستماع للأوامر (مثل أمر menu)
client.on('messageCreate', async (message) => {
    // تجاهل رسائل البوتات الأخرى
    if (message.author.bot) return;

    // التحقق من الأمر menu
    if (message.content.toLowerCase() === 'menu' || message.content === '!menu') {
        try {
            await message.reply({
                content: ' Our bot is ready! This is the main menu for **SH CLAN**.'
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
});

// 5. تسجيل الدخول باستخدام التوكن المخزن في بيئة العمل (Variables)
const token = process.env.DISCORD_TOKEN || process.env.TOKEN;
