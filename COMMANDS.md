# Bot Commands

## come <player>

Makes the bot walk to the specified player.

## come to me

Makes the bot walk to the player who sent the command.

## chop

Chops the nearest tree within 10 blocks of the command start position, then collects dropped logs, saplings, and apples within 48 blocks. A chest must be available within 48 blocks for storing the collected wood and tree drops.
Stops when: inventory is full, no axe is available, no nearby trees remain, or a chest is not available.

## stop

Stops the bot's current command.

## inventory

Shows all items currently in the bot's inventory.

## collect [item ...]

Collects dropped items tracked by the bot within 48 blocks when they are resting on solid ground. With item names, only those items are collected. `item collection [item ...]` is also supported.

## sleep

Walks to the nearest bed within 32 blocks and sleeps there.

## mount <boat|minecart>

Walks to the nearest nearby boat or minecart and mounts it. `ride` and `sit`
can be used as aliases.

The bot automatically eats food from its inventory when its hunger is 14 or
lower.
