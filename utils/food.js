const { FOOD_NAMES } = require('../config/constants');

const HUNGER_THRESHOLD = 14;
const CHECK_INTERVAL = 5000;

function createAutoEat(bot) {
    let eating = false;
    let lastNoFoodNotice = 0;

    const eatIfHungry = async () => {
        if (
            eating ||
            bot.food === undefined ||
            bot.food > HUNGER_THRESHOLD ||
            bot.health <= 0
        ) {
            return;
        }

        const food = bot.inventory
            .items()
            .find((item) => FOOD_NAMES.includes(item.name));

        if (!food) {
            if (Date.now() - lastNoFoodNotice > 30000) {
                bot.chat('I am hungry, but I have no food');
                lastNoFoodNotice = Date.now();
            }
            return;
        }

        eating = true;

        try {
            await bot.equip(food, 'hand');
            await bot.consume();
        } catch (error) {
            console.log('Eating error:', error.message);
        } finally {
            eating = false;
        }
    };

    const timer = setInterval(eatIfHungry, CHECK_INTERVAL);

    return () => clearInterval(timer);
}

module.exports = {
    createAutoEat,
};
