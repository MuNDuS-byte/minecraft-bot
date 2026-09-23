const { AXE_NAMES } = require('../config/constants');

function findAxe(bot) {
    return bot.inventory.items().find((item) => AXE_NAMES.includes(item.name));
}

function isInventoryFull(bot) {
    const inventorySlots = bot.inventory.slots.slice(9, 45);

    return inventorySlots.every((slot) => slot !== null);
}

module.exports = {
    findAxe,
    isInventoryFull,
};
