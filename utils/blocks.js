const { LOG_NAMES } = require('../config/constants');

const DIRECTIONS = [
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
];

function getLogIds(bot) {
    return LOG_NAMES.map((name) => bot.registry.blocksByName[name]?.id).filter(
        (id) => id !== undefined,
    );
}

function findLogs(bot, radius, center) {
    const logIds = getLogIds(bot);

    if (logIds.length === 0) {
        return [];
    }

    return bot.findBlocks({
        point: center,
        matching: (block) => logIds.includes(block.type),
        maxDistance: radius,
        count: 100,
    });
}

function findTreeLogs(bot, startPosition, radius, seedPosition) {
    const logs = findLogs(bot, radius, startPosition);

    const logMap = new Map(
        logs.map((position) => [
            `${position.x},${position.y},${position.z}`,
            position,
        ]),
    );

    const seedKey = `${seedPosition.x},${seedPosition.y},${seedPosition.z}`;

    if (!logMap.has(seedKey)) {
        return [];
    }

    const tree = [];
    const queue = [seedPosition];
    const visited = new Set([seedKey]);

    while (queue.length > 0) {
        const current = queue.shift();

        tree.push(current);

        for (const direction of DIRECTIONS) {
            const next = {
                x: current.x + direction.x,
                y: current.y + direction.y,
                z: current.z + direction.z,
            };

            const key = `${next.x},${next.y},${next.z}`;

            if (visited.has(key)) {
                continue;
            }

            if (!logMap.has(key)) {
                continue;
            }

            visited.add(key);
            queue.push(logMap.get(key));
        }
    }

    return tree;
}

module.exports = {
    findLogs,
    findTreeLogs,
};
