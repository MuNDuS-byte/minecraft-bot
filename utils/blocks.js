const { LOG_NAMES } = require('../config/constants');

function findLogs(bot, radius) {
    const logIds = LOG_NAMES.map(
        (name) => bot.registry.blocksByName[name]?.id,
    ).filter((id) => id !== undefined);

    if (logIds.length === 0) {
        return [];
    }

    return bot.findBlocks({
        point: bot.entity.position,
        matching: (block) => logIds.includes(block.type),
        maxDistance: radius,
        count: 100,
    });
}

module.exports = {
    findLogs,
};
