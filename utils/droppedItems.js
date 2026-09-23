const { PICKUP_ITEM_NAMES } = require('../config/constants');

function createDroppedItemTracker(bot) {
    const droppedItems = new Map();

    bot.on('itemDrop', (entity) => {
        const item = entity.getDroppedItem?.();

        if (!item) {
            return;
        }

        if (!PICKUP_ITEM_NAMES.includes(item.name)) {
            return;
        }

        droppedItems.set(entity.id, entity);
    });

    bot.on('entityGone', (entity) => {
        droppedItems.delete(entity.id);
    });

    bot.on('playerCollect', (collector, collected) => {
        droppedItems.delete(collected.id);
    });

    return {
        find(center, radius) {
            return [...droppedItems.values()]
                .filter((entity) => {
                    if (!entity.position) {
                        return false;
                    }

                    return entity.position.distanceTo(center) <= radius;
                })
                .sort(
                    (a, b) =>
                        a.position.distanceTo(bot.entity.position) -
                        b.position.distanceTo(bot.entity.position),
                );
        },
    };
}

module.exports = {
    createDroppedItemTracker,
};
