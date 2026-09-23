const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');

const { handleComeCommand } = require('./commands/come');
const { chopTrees } = require('./commands/chop');
const { handleInventoryCommand } = require('./commands/inventory');

const { createDroppedItemTracker } = require('./utils/droppedItems');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 25565,
    username: 'MyBot',
});

bot.loadPlugin(pathfinder);

let movements;
let droppedItemTracker;

const botState = {
    command: null,
    stopped: false,
};

bot.once('spawn', () => {
    movements = new Movements(bot);

    droppedItemTracker = createDroppedItemTracker(bot);

    console.log('Bot joined the server');

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;

        const parts = message.trim().split(/\s+/);
        const command = parts[0]?.toLowerCase();

        if (command === 'stop') {
            stopCurrentCommand();
            return;
        }

        if (botState.command) {
            bot.chat(`I am currently ${botState.command}. Use stop first.`);
            return;
        }

        if (command === 'come') {
            const started = handleComeCommand(bot, movements, username, parts);

            if (started) {
                botState.command = 'coming to a player';
                botState.stopped = false;
            }

            return;
        }

        if (command === 'chop') {
            botState.command = 'chopping trees';
            botState.stopped = false;

            chopTrees(
                bot,
                movements,
                droppedItemTracker,
                () => botState.stopped,
                () => {
                    botState.command = null;
                },
            );

            return;
        }

        if (command === 'inventory') {
            handleInventoryCommand(bot);
            return;
        }
    });
});

function stopCurrentCommand() {
    if (!botState.command) {
        bot.chat('I am not doing anything');
        return;
    }

    botState.stopped = true;
    bot.pathfinder.stop();

    const stoppedCommand = botState.command;

    botState.command = null;

    bot.chat(`Stopped ${stoppedCommand}`);
}

bot.on('goal_reached', () => {
    if (botState.command !== 'coming to a player') {
        return;
    }

    botState.command = null;
    botState.stopped = false;

    bot.chat('I arrived');
});

bot.on('error', (error) => {
    console.error('Bot error:', error);
});

bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', reason);
});
