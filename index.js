const mineflayer = require('mineflayer');
const {
    pathfinder,
    Movements,
    goals: { GoalNear },
} = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 25565,
    username: 'MyBot',
});

bot.loadPlugin(pathfinder);

const RANGE_GOAL = 1;
const TREE_RADIUS = 20;

const AXE_NAMES = [
    'wooden_axe',
    'stone_axe',
    'iron_axe',
    'golden_axe',
    'diamond_axe',
    'netherite_axe',
];

const LOG_NAMES = [
    'oak_log',
    'spruce_log',
    'birch_log',
    'jungle_log',
    'acacia_log',
    'dark_oak_log',
    'mangrove_log',
    'cherry_log',
    'pale_oak_log',
    'stripped_oak_log',
    'stripped_spruce_log',
    'stripped_birch_log',
    'stripped_jungle_log',
    'stripped_acacia_log',
    'stripped_dark_oak_log',
    'stripped_mangrove_log',
    'stripped_cherry_log',
    'stripped_pale_oak_log',
];

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
            handleComeCommand(username, parts);
        }

        if (command === 'chop') {
            if (chopping) {
                bot.chat('I am already chopping trees');
                return;
            }

            chopTrees();
        }
    });
});

async function handleComeCommand(username, parts) {
    let targetPlayerName;

    if (parts[1]?.toLowerCase() === 'to' && parts[2]?.toLowerCase() === 'me') {
        targetPlayerName = username;
    } else {
        targetPlayerName = parts[1];
    }

    if (!targetPlayerName) {
        bot.chat('Usage: come <player> or come to me');
        return;
    }

    const targetPlayer = Object.values(bot.players).find(
        (player) =>
            player.username.toLowerCase() === targetPlayerName.toLowerCase(),
    );

    if (!targetPlayer || !targetPlayer.entity) {
        bot.chat(`I don't see ${targetPlayerName}`);
        return;
    }

    const { x, y, z } = targetPlayer.entity.position;

    bot.chat(`Coming to ${targetPlayer.username}`);

    movements.canDig = false;

    bot.pathfinder.setMovements(movements);

    bot.pathfinder.setGoal(new GoalNear(x, y, z, RANGE_GOAL));
}

function findAxe() {
    return bot.inventory.items().find((item) => AXE_NAMES.includes(item.name));
}

function isInventoryFull() {
    const inventorySlots = bot.inventory.slots.slice(9, 45);

    return inventorySlots.every((slot) => slot !== null);
}

function findLogs() {
    const logIds = LOG_NAMES.map(
        (name) => bot.registry.blocksByName[name]?.id,
    ).filter((id) => id !== undefined);

    if (logIds.length === 0) {
        return [];
    }

    return bot.findBlocks({
        point: bot.entity.position,
        matching: (block) => logIds.includes(block.type),
        maxDistance: TREE_RADIUS,
        count: 100,
    });
}

async function moveToBlock(block) {
    bot.pathfinder.setMovements(movements);

    await bot.pathfinder.goto(
        new GoalNear(
            block.position.x,
            block.position.y,
            block.position.z,
            RANGE_GOAL,
        ),
    );
}

async function chopTrees() {
    chopping = true;

    bot.chat('Starting to chop trees');

    try {
        while (true) {
            if (isInventoryFull()) {
                bot.pathfinder.stop();
                bot.chat('My inventory is full');
                break;
            }

            let axe = findAxe();

            if (!axe) {
                bot.pathfinder.stop();
                bot.chat('I need an axe');
                break;
            }

            const logs = findLogs();

            if (logs.length === 0) {
                bot.pathfinder.stop();
                bot.chat('No trees found nearby');
                break;
            }

            const logPosition = logs[0];
            const block = bot.blockAt(logPosition);

            if (!block) {
                continue;
            }

            try {
                await moveToBlock(block);
            } catch (error) {
                console.log('Pathfinding error:', error.message);
                continue;
            }

            if (isInventoryFull()) {
                bot.pathfinder.stop();
                bot.chat('My inventory is full');
                break;
            }

            axe = findAxe();

            if (!axe) {
                bot.pathfinder.stop();
                bot.chat('My axe is broken and I have no other axe');
                break;
            }

            try {
                await bot.equip(axe, 'hand');
                await bot.dig(block);
            } catch (error) {
                console.log('Digging error:', error.message);

                const newAxe = findAxe();

                if (!newAxe) {
                    bot.pathfinder.stop();
                    bot.chat('My axe is broken and I have no other axe');
                    break;
                }
            }
        }
    } finally {
        bot.pathfinder.stop();
        chopping = false;
    }
}

bot.on('goal_reached', () => {
    bot.chat('I arrived');
});

bot.on('error', (error) => {
    console.error('Bot error:', error);
});

bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', reason);
});
