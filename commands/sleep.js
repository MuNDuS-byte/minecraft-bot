const {
    goals: { GoalNear },
} = require('mineflayer-pathfinder');

const { BED_NAMES } = require('../config/constants');

const BED_RADIUS = 32;

async function sleepAtNearestBed(bot, movements, isStopped, onFinished) {
    try {
        const beds = bot.findBlocks({
            point: bot.entity.position,
            maxDistance: BED_RADIUS,
            count: 1,
            matching: (block) => BED_NAMES.includes(block.name),
        });

        if (beds.length === 0) {
            bot.chat('I cannot find a bed nearby');
            return;
        }

        const bed = beds[0];
        movements.canDig = false;
        movements.allow1by1towers = false;
        bot.pathfinder.setMovements(movements);
        await bot.pathfinder.goto(new GoalNear(bed.x, bed.y, bed.z, 2));

        if (isStopped()) {
            return;
        }

        await bot.sleep(bot.blockAt(bed));
        bot.chat('I am sleeping');
    } catch (error) {
        if (!isStopped()) {
            bot.chat(`I could not sleep: ${error.message}`);
        }
    } finally {
        bot.pathfinder.stop();
        onFinished();
    }
}

module.exports = {
    sleepAtNearestBed,
};
