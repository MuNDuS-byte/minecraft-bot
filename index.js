const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');

const { handleComeCommand } = require('./commands/come');
const { chopTrees, collectDroppedItems } = require('./commands/chop');
const { handleInventoryCommand } = require('./commands/inventory');
const { sleepAtNearestBed } = require('./commands/sleep');
const { mountVehicle } = require('./commands/mount');

const { createDroppedItemTracker } = require('./utils/droppedItems');
const { createAutoEat } = require('./utils/food');
const { PICKUP_ITEM_NAMES } = require('./config/constants');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 25565,
    username: 'MyBot',
});
// наступит на item
bot.loadPlugin(pathfinder);

let movements;
let droppedItemTracker;
let stopAutoEat;

const botState = {
    command: null,
    stopped: false,
};

bot.once('spawn', () => {
    movements = new Movements(bot);

    droppedItemTracker = createDroppedItemTracker(bot);
    stopAutoEat = createAutoEat(bot);

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

        if (command === 'collect' || command === 'item') {
            const itemNames =
                command === 'item' && parts[1]?.toLowerCase() === 'collection'
                    ? parts.slice(2)
                    : parts.slice(1);
            const requestedItems = itemNames.length
                ? itemNames
                : PICKUP_ITEM_NAMES;

            botState.command = 'collecting items';
            botState.stopped = false;

            collectDroppedItems(
                bot,
                movements,
                droppedItemTracker,
                bot.entity.position.clone(),
                () => botState.stopped,
                requestedItems,
            ).finally(() => {
                if (!botState.stopped) {
                    bot.chat('Item collection finished');
                }
                botState.command = null;
            });

            return;
        }

        if (command === 'sleep') {
            botState.command = 'sleeping';
            botState.stopped = false;
            sleepAtNearestBed(
                bot,
                movements,
                () => botState.stopped,
                () => {
                    botState.command = null;
                },
            );
            return;
        }

        if (command === 'mount' || command === 'ride' || command === 'sit') {
            const vehicleType = parts[1]?.toLowerCase();

            if (vehicleType !== 'boat' && vehicleType !== 'minecart') {
                bot.chat('Usage: mount <boat|minecart>');
                return;
            }

            botState.command = `mounting ${vehicleType}`;
            botState.stopped = false;
            mountVehicle(
                bot,
                movements,
                vehicleType,
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

    bot.on('end', () => {
        stopAutoEat?.();
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
