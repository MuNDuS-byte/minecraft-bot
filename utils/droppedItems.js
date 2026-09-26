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
        find(center, radius, itemNames = PICKUP_ITEM_NAMES) {
            return [...droppedItems.values()]
                .filter((entity) => {
                    if (!entity.position) {
                        return false;
                    }

                    const item = entity.getDroppedItem?.();
                    const support = bot.blockAt(entity.position.offset(0, -0.8, 0));
                    const onGround = support && support.boundingBox === 'block' &&
                        !support.name.endsWith('_leaves') && support.name !== 'vine';

                    return (
                        item &&
                        onGround &&
                        itemNames.includes(item.name) &&
                        entity.position.distanceTo(center) <= radius
                    );
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
