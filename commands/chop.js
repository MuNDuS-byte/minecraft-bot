const {
    goals: { GoalNear },
} = require('mineflayer-pathfinder');

const { TREE_RADIUS } = require('../config/constants');

const { findAxe, isInventoryFull } = require('../utils/inventory');

const { findLogs } = require('../utils/blocks');

const RANGE_GOAL = 1;

async function moveToBlock(bot, movements, block, isStopped) {
    if (isStopped()) {
        return false;
    }

    // come sets canDig to false because it should not
    // break blocks while following a player.
    // chop needs pathfinding to be able to clear obstacles.
    movements.canDig = true;

    bot.pathfinder.setMovements(movements);

    try {
        await bot.pathfinder.goto(
            new GoalNear(
                block.position.x,
                block.position.y,
                block.position.z,
                RANGE_GOAL,
            ),
        );
    } catch (error) {
        if (isStopped()) {
            return false;
        }

        console.log('Pathfinding error:', error.message);
        return false;
    }

    return !isStopped();
}

async function chopTrees(bot, movements, isStopped, onFinished) {
    bot.chat('Starting to chop trees');

    try {
        while (!isStopped()) {
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

            const reachedBlock = await moveToBlock(
                bot,
                movements,
                block,
                isStopped,
            );

            if (!reachedBlock) {
                if (isStopped()) {
                    break;
                }

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

            if (isStopped()) {
                break;
            }

            try {
                await bot.equip(axe, 'hand');

                if (isStopped()) {
                    break;
                }

                await bot.dig(block);
            } catch (error) {
                if (isStopped()) {
                    break;
                }

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
        onFinished();
    }
}

module.exports = {
    chopTrees,
};
