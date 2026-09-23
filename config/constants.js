const TREE_RADIUS = 20;

const AXE_NAMES = [
    'wooden_axe',
    'stone_axe',
    'iron_axe',
    'golden_axe',
    'diamond_axe',
    'netherite_axe',
];

const LOG_NAMES = [
    'oak_log',
    'spruce_log',
    'birch_log',
    'jungle_log',
    'acacia_log',
    'dark_oak_log',
    'mangrove_log',
    'cherry_log',
    'pale_oak_log',
    'stripped_oak_log',
    'stripped_spruce_log',
    'stripped_birch_log',
    'stripped_jungle_log',
    'stripped_acacia_log',
    'stripped_dark_oak_log',
    'stripped_mangrove_log',
    'stripped_cherry_log',
    'stripped_pale_oak_log',
];

const PICKUP_ITEM_NAMES = [
    ...LOG_NAMES,

    'oak_sapling',
    'spruce_sapling',
    'birch_sapling',
    'jungle_sapling',
    'acacia_sapling',
    'dark_oak_sapling',
    'mangrove_propagule',
    'cherry_sapling',
    'pale_oak_sapling',

    'apple',
];

const KEEP_ITEMS = ['diamond_axe', 'iron_axe', 'cooked_beef', 'cobblestone'];

module.exports = {
    TREE_RADIUS,
    AXE_NAMES,
    LOG_NAMES,
    PICKUP_ITEM_NAMES,
    KEEP_ITEMS,
};
