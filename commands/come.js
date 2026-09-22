const {
    goals: { GoalNear },
} = require('mineflayer-pathfinder');

const RANGE_GOAL = 1;

function handleComeCommand(bot, movements, username, parts) {
    let targetPlayerName;

    if (parts[1]?.toLowerCase() === 'to' && parts[2]?.toLowerCase() === 'me') {
        targetPlayerName = username;
    } else {
        targetPlayerName = parts[1];
    }

    if (!targetPlayerName) {
        bot.chat('Usage: come <player> or come to me');
        return false;
    }

    const targetPlayer = Object.values(bot.players).find(
        (player) =>
            player.username.toLowerCase() === targetPlayerName.toLowerCase(),
    );

    if (!targetPlayer || !targetPlayer.entity) {
        bot.chat(`I don't see ${targetPlayerName}`);
        return false;
    }

    const { x, y, z } = targetPlayer.entity.position;

    bot.chat(`Coming to ${targetPlayer.username}`);

    movements.canDig = false;

    bot.pathfinder.setMovements(movements);

    bot.pathfinder.setGoal(new GoalNear(x, y, z, RANGE_GOAL));

    return true;
}

module.exports = {
    handleComeCommand,
};
