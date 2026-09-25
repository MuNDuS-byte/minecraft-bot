const {
    goals: { GoalNear },
} = require('mineflayer-pathfinder');

const VEHICLE_NAMES = {
    boat: new Set(['boat', 'chest_boat']),
    minecart: new Set([
        'minecart',
        'chest_minecart',
        'furnace_minecart',
        'hopper_minecart',
        'tnt_minecart',
    ]),
};

function isVehicle(entity, vehicleType) {
    if (vehicleType === 'boat') {
        return (
            VEHICLE_NAMES.boat.has(entity.name) ||
            entity.name?.endsWith('_boat') ||
            entity.name?.endsWith('_chest_boat')
        );
    }

    return VEHICLE_NAMES.minecart.has(entity.name);
}

async function mountVehicle(bot, movements, vehicleType, isStopped, onFinished) {
    try {
        const vehicle = Object.values(bot.entities)
            .filter(
                (entity) =>
                    entity.position &&
                    isVehicle(entity, vehicleType) &&
                    entity.position.distanceTo(bot.entity.position) <= 32,
            )
            .sort(
                (a, b) =>
                    a.position.distanceTo(bot.entity.position) -
                    b.position.distanceTo(bot.entity.position),
            )[0];

        if (!vehicle) {
            bot.chat(`I cannot find a ${vehicleType} nearby`);
            return;
        }

        movements.canDig = false;
        movements.allow1by1towers = false;
        bot.pathfinder.setMovements(movements);
        await bot.pathfinder.goto(
            new GoalNear(
                vehicle.position.x,
                vehicle.position.y,
                vehicle.position.z,
                2,
            ),
        );

        if (isStopped()) {
            return;
        }

        await bot.mount(vehicle);
        bot.chat(`I am riding the ${vehicleType}`);
    } catch (error) {
        if (!isStopped()) {
            bot.chat(`I could not mount the ${vehicleType}: ${error.message}`);
        }
    } finally {
        bot.pathfinder.stop();
        onFinished();
    }
}

module.exports = {
    mountVehicle,
};
