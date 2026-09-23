const KEEP_ITEMS = ['diamond_axe', 'iron_axe', 'cooked_beef'];

async function handleInventoryCommand(bot) {
    const items = bot.inventory.items();

    if (items.length === 0) {
        bot.chat('My inventory is empty');
        return;
    }

    bot.chat('Inventory:');

    for (const item of items) {
        bot.chat(`${item.name} x${item.count}`);
    }

    const itemsToDrop = items.filter((item) => !KEEP_ITEMS.includes(item.name));

    if (itemsToDrop.length === 0) {
        bot.chat('Nothing to drop');
        return;
    }

    bot.chat('Dropping unnecessary items...');

    for (const item of itemsToDrop) {
        try {
            await bot.tossStack(item);
        } catch (error) {
            console.log(`Failed to drop ${item.name}:`, error.message);
        }
    }

    bot.chat('Done');
}

module.exports = {
    handleInventoryCommand,
};
