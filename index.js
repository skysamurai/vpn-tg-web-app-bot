const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6539749303:AAF520m4E5IgYHKYZiaoPkOLr0ynTDWLcGk'
const webAppUrl = 'https://650326182642c703d579da93--classy-quokka-8f1c9e.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (text === '/start') {
        await bot.sendMessage(chatId, `Добро пожаловать за своим VPN`, {
            reply_markup: {
                keyboard: [
                    [{text: 'Покупка товара или оплата сервиса', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        })

        await bot.sendMessage(chatId, `Выбери товар`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)

            await bot.sendMessage(chatId, 'Спасибо за заявку!')
            await bot.sendMessage(chatId, 'Вы хотите заказать ' + data?.product)
            await bot.sendMessage(chatId, 'Мы с вами свяжемся!')
        } catch (e) {
            console.log(e)
        }

    }


});

app.post('/web-data', async (reg, res) => {
    const {queryId, products? totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {message_text: 'Поздравляю с покупкой, установите VPN Outline на устройство и ждите ключ.'}
        })
        return res.status(200).json({});
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Покупка не прошла',
            input_message_content: {message_text: 'К сожалению покупка не прошла'}
    }
    return res.status(500).json({});
})
const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT ' + PORT))