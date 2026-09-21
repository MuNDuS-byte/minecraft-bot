const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 25565,
    username: 'MyBot',
});

bot.loadPlugin(pathfinder);

let movements;

bot.once('spawn', () => {
    movements = new Movements(bot);
    console.log('Бот зашел на сервер');
});

bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const target = bot.players[message];

    if (!target || !target.entity) {
        bot.chat(`Игрок ${message} не найден`);
        return;
    }

    bot.chat(`Иду к ${message}`);

    bot.pathfinder.setMovements(movements);

    bot.pathfinder.setGoal(
        new goals.GoalNear(
            target.entity.position.x,
            target.entity.position.y,
            target.entity.position.z,
            1,
        ),
    );
});

bot.on('goal_reached', () => {
    bot.chat('Я пришел');
});
