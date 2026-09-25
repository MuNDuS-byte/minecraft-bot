# Bot Commands

## come <player>

Makes the bot walk to the specified player.

## come to me

Makes the bot walk to the player who sent the command.

## chop

Chops trees within 20 blocks of the command start position and collects logs, saplings, and apples.
Bot searches for an axe, finds logs within 20 blocks and chops them.
Stops when: inventory is full, no axe is available, or no trees remain.

## stop

Stops the bot's current command.

## inventory

Shows all items currently in the bot's inventory.

## collect [item ...]

Collects nearby dropped items tracked by the bot. With item names, only those
items are collected. `item collection [item ...]` is also supported.

## sleep

Walks to the nearest bed within 32 blocks and sleeps there.

## mount <boat|minecart>

Walks to the nearest nearby boat or minecart and mounts it. `ride` and `sit`
can be used as aliases.

The bot automatically eats food from its inventory when its hunger is 14 or
lower.
