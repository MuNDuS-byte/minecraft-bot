const { LOG_NAMES, PICKUP_ITEM_NAMES } = require('../config/constants');

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
    const logIds = getLogIds(bot);

    if (logIds.length === 0) {
        return [];
    }

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

function findDroppedItems(bot, center, radius) {
    const items = Object.values(bot.entities).filter((entity) => {
        if (entity.type !== 'object' && entity.type !== 'item') {
            return false;
        }

        if (!entity.position) {
            return false;
        }

        const distance = entity.position.distanceTo(center);

        if (distance > radius) {
            return false;
        }

        if (typeof entity.getDroppedItem !== 'function') {
            return false;
        }

        const droppedItem = entity.getDroppedItem();

        if (!droppedItem) {
            return false;
        }

        return PICKUP_ITEM_NAMES.includes(droppedItem.name);
    });

    return items.sort(
        (a, b) =>
            a.position.distanceTo(bot.entity.position) -
            b.position.distanceTo(bot.entity.position),
    );
}

module.exports = {
    findLogs,
    findTreeLogs,
    findDroppedItems,
};
