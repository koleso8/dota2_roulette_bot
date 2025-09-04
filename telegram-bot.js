import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set');
}

const bot = new Telegraf(BOT_TOKEN);

// Кнопка для WebApp (откроет вашу игру внутри Telegram)
bot.command('play', (ctx) => {
    ctx.reply('Открыть игру', {
        reply_markup: {
            keyboard: [
                [{ text: 'Играть', web_app: { url: 'https://dota2-roulette.vercel.app/' } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    });
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 