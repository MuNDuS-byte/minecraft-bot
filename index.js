const mineflayer = require('mineflayer');
const {
    pathfinder,
    Movements,
    goals: { GoalNear },
} = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 25565,
    username: 'MyBot',
});

bot.loadPlugin(pathfinder);

const RANGE_GOAL = 1;

bot.once('spawn', () => {
    const defaultMove = new Movements(bot);

    console.log('Bot joined the server');

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;

        const parts = message.trim().split(/\s+/);
        const command = parts[0]?.toLowerCase();

        if (command !== 'come') return;

        let targetPlayerName;

        if (
            parts[1]?.toLowerCase() === 'to' &&
            parts[2]?.toLowerCase() === 'me'
        ) {
            targetPlayerName = username;
        } else {
            targetPlayerName = parts[1];
        }

        if (!targetPlayerName) {
            bot.chat('Usage: come <player> or come to me');
            return;
        }

        const targetPlayer = Object.values(bot.players).find(
            (player) =>
                player.username.toLowerCase() ===
                targetPlayerName.toLowerCase(),
        );

        if (!targetPlayer || !targetPlayer.entity) {
            bot.chat(`I don't see ${targetPlayerName}`);
            return;
        }

        const { x, y, z } = targetPlayer.entity.position;

        bot.chat(`Coming to ${targetPlayer.username}`);

        bot.pathfinder.setMovements(defaultMove);

        bot.pathfinder.setGoal(new GoalNear(x, y, z, RANGE_GOAL));
    });
});

bot.on('goal_reached', () => {
    bot.chat('I arrived');
});

bot.on('error', (error) => {
    console.error('Bot error:', error);
});

bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', reason);
});
