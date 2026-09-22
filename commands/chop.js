const {
    goals: { GoalNear },
} = require('mineflayer-pathfinder');

const { TREE_RADIUS } = require('../config/constants');

const { findAxe, isInventoryFull } = require('../utils/inventory');

const { findLogs } = require('../utils/blocks');

const RANGE_GOAL = 1;

async function moveToBlock(bot, movements, block) {
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

async function chopTrees(bot, movements, getChopping, setChopping) {
    setChopping(true);

    bot.chat('Starting to chop trees');

    try {
        while (true) {
            if (isInventoryFull(bot)) {
                bot.pathfinder.stop();
                bot.chat('My inventory is full');
                break;
            }

            let axe = findAxe(bot);

            if (!axe) {
                bot.pathfinder.stop();
                bot.chat('I need an axe');
                break;
            }

            const logs = findLogs(bot, TREE_RADIUS);

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
                await moveToBlock(bot, movements, block);
            } catch (error) {
                console.log('Pathfinding error:', error.message);
                continue;
            }

            if (isInventoryFull(bot)) {
                bot.pathfinder.stop();
                bot.chat('My inventory is full');
                break;
            }

            axe = findAxe(bot);

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

                const newAxe = findAxe(bot);

                if (!newAxe) {
                    bot.pathfinder.stop();
                    bot.chat('My axe is broken and I have no other axe');
                    break;
                }
            }
        }
    } finally {
        bot.pathfinder.stop();
        setChopping(false);
    }
}

module.exports = {
    chopTrees,
};
