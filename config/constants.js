const TREE_RADIUS = 48;
const TREE_SEARCH_RADIUS = 10;

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

const KEEP_ITEMS = ['diamond_axe', 'iron_axe', 'cooked_beef', 'cobblestone', 'dirt', 'wooden_shovel', 'stone_shovel', 'iron_shovel', 'golden_shovel', 'diamond_shovel', 'netherite_shovel'];

const FOOD_NAMES = [
    'apple',
    'bread',
    'baked_potato',
    'carrot',
    'cooked_beef',
    'cooked_chicken',
    'cooked_mutton',
    'cooked_porkchop',
    'cooked_rabbit',
    'cooked_salmon',
    'cooked_cod',
    'golden_carrot',
    'melon_slice',
    'pumpkin_pie',
    'rabbit_stew',
    'mushroom_stew',
    'beetroot',
    'beetroot_soup',
    'sweet_berries',
    'glow_berries',
    'dried_kelp',
    'tropical_fish',
];

const BED_NAMES = [
    'white_bed',
    'orange_bed',
    'magenta_bed',
    'light_blue_bed',
    'yellow_bed',
    'lime_bed',
    'pink_bed',
    'gray_bed',
    'light_gray_bed',
    'cyan_bed',
    'purple_bed',
    'blue_bed',
    'brown_bed',
    'green_bed',
    'red_bed',
    'black_bed',
];

module.exports = {
    TREE_RADIUS,
    TREE_SEARCH_RADIUS,
    AXE_NAMES,
    LOG_NAMES,
    PICKUP_ITEM_NAMES,
    KEEP_ITEMS,
    FOOD_NAMES,
    BED_NAMES,
};
