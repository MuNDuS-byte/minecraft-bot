const {
    goals: { GoalLookAtBlock },
} = require('mineflayer-pathfinder');

const { TREE_RADIUS } = require('../config/constants');

const { findAxe, isInventoryFull } = require('../utils/inventory');

const { findLogs, findTreeLogs, findDroppedItems } = require('../utils/blocks');

const RANGE_GOAL = 4.5;

async function moveToBlock(bot, movements, block, isStopped) {
    if (isStopped()) {
        return false;
    }

    movements.canDig = true;
    movements.allow1by1towers = false;

    bot.pathfinder.setMovements(movements);

    try {
        await bot.pathfinder.goto(
            new GoalLookAtBlock(block.position, bot.world, {
                reach: RANGE_GOAL,
            }),
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

async function moveToItem(bot, movements, item, isStopped) {
    if (isStopped()) {
        return false;
    }

    movements.canDig = true;
    movements.allow1by1towers = false;

    bot.pathfinder.setMovements(movements);

    try {
        await bot.pathfinder.goto(
            new GoalLookAtBlock(item.position, bot.world, {
                reach: RANGE_GOAL,
            }),
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

async function collectDroppedItems(bot, movements, startPosition, isStopped) {
    while (!isStopped()) {
        if (isInventoryFull(bot)) {
            bot.pathfinder.stop();
            bot.chat('My inventory is full');
            return false;
        }

        const items = findDroppedItems(bot, startPosition, TREE_RADIUS);

        if (items.length === 0) {
            return true;
        }

        const item = items[0];

        const reachedItem = await moveToItem(bot, movements, item, isStopped);

        if (!reachedItem) {
            return !isStopped();
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return false;
}

async function chopTree(bot, movements, startPosition, firstLog, isStopped) {
    while (!isStopped()) {
        if (isInventoryFull(bot)) {
            bot.pathfinder.stop();
            bot.chat('My inventory is full');
            return false;
        }

        const treeLogs = findTreeLogs(
            bot,
            startPosition,
            TREE_RADIUS,
            firstLog,
        );

        if (treeLogs.length === 0) {
            return true;
        }

        treeLogs.sort(
            (a, b) =>
                bot.entity.position.distanceTo(a) -
                bot.entity.position.distanceTo(b),
        );

        const logPosition = treeLogs[0];
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
                return false;
            }

            continue;
        }

        if (isInventoryFull(bot)) {
            bot.pathfinder.stop();
            bot.chat('My inventory is full');
            return false;
        }

        const axe = findAxe(bot);

        if (!axe) {
            bot.pathfinder.stop();
            bot.chat('My axe is broken and I have no other axe');
            return false;
        }

        if (isStopped()) {
            return false;
        }

        try {
            await bot.equip(axe, 'hand');

            if (isStopped()) {
                return false;
            }

            await bot.lookAt(block.position.offset(0.5, 0.5, 0.5), true);

            await bot.dig(block);
        } catch (error) {
            if (isStopped()) {
                return false;
            }

            console.log('Digging error:', error.message);

            const newAxe = findAxe(bot);

            if (!newAxe) {
                bot.pathfinder.stop();
                bot.chat('My axe is broken and I have no other axe');
                return false;
            }
        }
    }

    return false;
}

async function chopTrees(bot, movements, isStopped, onFinished) {
    const startPosition = bot.entity.position.clone();

    bot.chat('Starting to chop trees');

    try {
        while (!isStopped()) {
            if (isInventoryFull(bot)) {
                bot.pathfinder.stop();
                bot.chat('My inventory is full');
                break;
            }

            const axe = findAxe(bot);

            if (!axe) {
                bot.pathfinder.stop();
                bot.chat('I need an axe');
                break;
            }

            const logs = findLogs(bot, TREE_RADIUS, startPosition);

            if (logs.length === 0) {
                break;
            }

            const nearestLog = logs
                .slice()
                .sort(
                    (a, b) =>
                        bot.entity.position.distanceTo(a) -
                        bot.entity.position.distanceTo(b),
                )[0];

            const treeFinished = await chopTree(
                bot,
                movements,
                startPosition,
                nearestLog,
                isStopped,
            );

            if (!treeFinished || isStopped()) {
                break;
            }
        }

        if (isStopped()) {
            return;
        }

        if (isInventoryFull(bot)) {
            bot.pathfinder.stop();
            bot.chat('My inventory is full');
            return;
        }

        await collectDroppedItems(bot, movements, startPosition, isStopped);

        if (isStopped()) {
            return;
        }

        bot.pathfinder.stop();
        bot.chat('All trees chopped and useful items collected');
    } finally {
        bot.pathfinder.stop();
        onFinished();
    }
}

module.exports = {
    chopTrees,
};
