import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set');
}

const bot = new Telegraf(BOT_TOKEN);

bot.command('play', (ctx) => {
    ctx.replyWithGame('d2r');
});

bot.on('callback_query', (ctx) => {
    if (ctx.callbackQuery.game_short_name === 'd2r') {
        ctx.telegram.answerGameQuery(ctx.callbackQuery.id, 'https://dota2-roulette.vercel.app/');
    } else {
        ctx.answerCbQuery();
    }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));