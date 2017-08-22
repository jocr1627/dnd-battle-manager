# dnd-battle-manager
## How do I use this?
```
npm run start
```
* You will be prompted for a file path. Use [test/data/battle.json](https://github.com/jocr1627/dnd-battle-manager/blob/master/test/data/battle.json) for a sample [configuration](#config).

## How can this be expanded?
* Add [action definitions](https://github.com/jocr1627/dnd-battle-manager/blob/master/src/ActionDefinitions.js) (e.g. Attack)
* Add [NPC types](https://github.com/jocr1627/dnd-battle-manager/blob/master/src/character/NPC.js) (e.g. Archer)
* Add roll [types](https://github.com/jocr1627/dnd-battle-manager/blob/master/src/RollTypes.js) and their corresponding [functions](https://github.com/jocr1627/dnd-battle-manager/blob/master/src/RollFns.js)
* Add [weapons](https://github.com/jocr1627/dnd-battle-manager/blob/master/src/Weapons.js)
* Implement equipment other than weapons (e.g. armor)
* Implement an action definition that allows the use of an inventory item
* Expand the available options for the configuration file
* Create a loot generator
* Implement interactable objects both in the configuration and action definitions
* Allow the user to override an npc's action choice
* Allow the user to directly call for events out of turn (e.g. declare that an npc takes damage)
* Allow the user to check on the status of npcs (e.g. print health)
* Enforce other basic rules (e.g. flank attacks & interrupts)
* Allow for more complex NPC allegiance (e.g. siding with players, third interest parties)
* Whatever you can dream of

<a name="config"></a>

## How do I create my own configuration?
The configuration file is a simple JSON object. Look below for descriptions of
the available options.

### Top Level keys
|Key|Type|Description|
|---|---|---|
|enemies|Array|List of enemy configurations|
|map|Object|Object describing the battleground|

### enemies
|Key|Type|Description|
|---|---|---|
|level|number|The enemy's level|
|location|string|The name of the node where this enemy should start|
|name|string|An identifier for this enemy|
|type|string|The NPC.js class implementation used to generate this enemey|

### map
|Key|Type|Description|
|---|---|---|
|edges|Array|List of edges describing relationships between nodes|
|nodes|Array|List of nodes representing locations in the battleground|

#### edges
|Key|Type|Description|
|---|---|---|
|node0|string|The name of one of the nodes involved in the edge|
|node1|string|The name of one of other node involved in the edge|
|type|("movement" \| "sight")|A key describing what type of edge exists between the nodes|

#### nodes
|Key|Type|Description|
|---|---|---|
|name|string|An identifier for this location|
