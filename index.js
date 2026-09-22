const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');

const { handleComeCommand } = require('./commands/come');
const { chopTrees } = require('./commands/chop');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 25565,
    username: 'MyBot',
});

bot.loadPlugin(pathfinder);

let movements;
let chopping = false;

bot.once('spawn', () => {
    movements = new Movements(bot);

    console.log('Bot joined the server');

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;

        const parts = message.trim().split(/\s+/);
        const command = parts[0]?.toLowerCase();

        if (command === 'come') {
            handleComeCommand(bot, movements, username, parts);
        }

        if (command === 'chop') {
            if (chopping) {
                bot.chat('I am already chopping trees');
                return;
            }

            chopTrees(
                bot,
                movements,
                () => chopping,
                (value) => {
                    chopping = value;
                },
            );
        }
    });
});

bot.on('goal_reached', () => {
    bot.chat('I arrived');
});

bot.on('error', (error) => {
    console.error('Bot error:', error);
});

bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', reason);
});
