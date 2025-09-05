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
            inline_keyboard: [
                [{ text: '🎮 Играть', web_app: { url: 'https://dota2-roulette.vercel.app/' } }]
            ]
        }
    });
});

// Обработка команды старт
bot.start((ctx) => {
    ctx.reply(
        'Добро пожаловать! 🎉\n\n' +
        'Используйте команды:\n' +
        '/play - Играть через inline кнопку (с initData)\n' +
        '/help - Помощь'
    );
});

// Помощь
bot.help((ctx) => {
    ctx.reply(
        'Доступные команды:\n' +
        '/play - Запустить игру\n' +
        '/start - Начать заново\n\n' +
        'Для корректной передачи данных используйте /play'
    );
});

// Обработка данных от WebApp
bot.on('web_app_data', (ctx) => {
    console.log('Получены данные от WebApp:', ctx.webAppData);
    const data = JSON.parse(ctx.webAppData.data);

    ctx.reply(
        `🎉 Спасибо за игру!\n\n` +
        `📊 Результат: ${JSON.stringify(data, null, 2)}`,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔄 Играть снова', web_app: { url: 'https://dota2-roulette.vercel.app/' } }]
                ]
            }
        }
    );
});

// Обработка текстовых сообщений
bot.on('text', (ctx) => {
    if (ctx.message.text === '❌ Закрыть') {
        ctx.reply('Клавиатура скрыта', {
            reply_markup: { remove_keyboard: true }
        });
    } else if (!ctx.message.text.startsWith('/')) {
        ctx.reply('Используйте /play чтобы начать игру!');
    }
});

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error('Ошибка бота:', err);
    ctx.reply('Произошла ошибка. Попробуйте еще раз.');
});

bot.launch();

console.log('Бот запущен!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));