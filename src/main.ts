import { attackerLogic } from "attacker";
import { builderLogic } from "builder";
import { Console } from "console";
import { buildExtGrid, findFreeSpace, findStructure } from "dansdl";
import { harvesterLogic } from "harvester";
import { identity } from "lodash";
import { minerLogic } from "miner";
import { basename } from "path";
import { repairerLogic } from "repairer";
import { towerLogic } from "tower";
import { upgraderLogic } from "upgrader";
import { ErrorMapper } from "utils/ErrorMapper";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role?: string;
    room: string;
    working: boolean;
    // TODO make it not be there always
    roomtoattack?: Room;
    container?: StructureContainer;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

function randomname(): string {
  var names: string[] = [
    "Michael",
    "Dwight",
    "Jim",
    "Pam",
    "Ryan",
    "Andy",
    "Robert",
    "Kelly",
    "Stanley",
    "Kevin",
    "Meredith",
    "Angela",
    "Oscar",
    "Phyllis",
    "Toby",
    "Creed",
    "Darryl",
    "Roy",
    "Erin",
    "Gabe",
    "Clark",
    "Pete",
    "David",
    "Deangelo",
    "Jo",
    "Josh",
    "Charles",
    "Ed",
    "Dan",
    "Craig",
    "Troy",
    "Karen",
    "Danny",
    "A.J.",
    "Ben",
    "Todd",
    "Cathy",
    "Hunter",
    "Rolando",
    "Stephanie",
    "Jordan",
    "Ronni",
    "Lonny",
    "Madge",
    "Glenn",
    "Jerry",
    "Phillip",
    "Michael",
    "Matt",
    "Hidetoshi",
    "Gary",
    "Val",
    "Nate",
    "Gideon",
    "Bruce",
    "Frank",
    "Louanne",
    "Devon",
    "Kendall",
    "Sadiq",
    "Nick",
    "Tony",
    "Martin",
    "Hannah",
    "Hank",
    "Billy",
    "Leo",
    "Brenda",
    "Vikram",
    "Al",
    "Elizabeth",
    "Fern",
    "Brandon",
    "Justin",
    "Megan",
    "Deborah",
    "Tom",
    "Brian"
  ];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex] + Math.random() * 10;
}
var spawnname = "Spawn1";
var creepsalive: number = 0;

class population {
  constructor(role: string) {
    this.role = role;
  }
  role: string;
  current() {
    var count: number = 0;
    for (const name in Game.creeps) {
      var creep = Game.creeps[name];
      if (creep.memory.role == this.role) {
        count++;
      }
    }
    return count;
  }
}

class containerMem {
  constructor(cont: StructureContainer) {
    this.cont = cont;
  }
  cont: StructureContainer;
  current() {
    var count: number = 0;
    for (const name in Game.creeps) {
      var creep = Game.creeps[name];
      if (creep.memory.container != undefined) {
        if (creep.memory.container.id == this.cont.id) {
          count++;
        }
      }
    }
    return count;
  }
}

function makeBody(role: string, energy: number) {
  energy = energy;
  const BODY: Record<string, Array<number>> = {
    harvester: [1, 1, 1, 0, 0, 0, 0, 0],
    upgrader: [1, 1, 1, 0, 0, 0, 0, 0],
    builder: [1, 1, 1, 0, 0, 0, 0, 0],
    repairer: [1, 1, 1, 0, 0, 0, 0, 0],
    miner: [1, 1, 0, 0, 0, 0, 0, 0],
    attacker: [0, 1, 0, 1, 0, 0, 0, 0]
  };
  let finalbody: BodyPartConstant[] = [];

  const body = BODY[role];

  let i = 0;
  if (role != "miner") {
    while (energy > 0 && i < 50) {
      if (!body[i % 8]) {
        i++;
        continue;
      }

      switch (i % 8) {
        case 0:
          finalbody.push(MOVE);
          energy -= BODYPART_COST[MOVE];
          break;
        case 1:
          finalbody.push(WORK);
          energy -= BODYPART_COST[WORK];
          break;
        case 2:
          finalbody.push(CARRY);
          energy -= BODYPART_COST[CARRY];
          break;
        case 3:
          finalbody.push(ATTACK);
          energy -= BODYPART_COST[ATTACK];
          break;
        case 4:
          finalbody.push(RANGED_ATTACK);
          energy -= BODYPART_COST[RANGED_ATTACK];
          break;
        case 5:
          finalbody.push(TOUGH);
          energy -= BODYPART_COST[TOUGH];
          break;
        case 6:
          finalbody.push(HEAL);
          energy -= BODYPART_COST[HEAL];
          break;
        case 7:
          finalbody.push(CLAIM);
          energy -= BODYPART_COST[CLAIM];
      }
      if (energy < 0) {
        finalbody.pop();
      }
      i++;
    }
  } else if (role == "miner") {
    finalbody.push(MOVE);
    energy -= BODYPART_COST[MOVE];
    while (energy > 0 && i < 49) {
      finalbody.push(WORK);
      energy -= BODYPART_COST[WORK];
      i++;
    }
    if (energy < 0) {
      finalbody.pop();
    }
  }
  return finalbody;
}

function spawnCreep(
  spawn: StructureSpawn,
  role: string,
  energy: number,
  working: boolean,
  container?: StructureContainer
) {
  const name: string = randomname();
  const body = makeBody(role, energy);
  if (
    spawn.createCreep(body, name, {
      role: role,
      room: spawn.room.name,
      working: working,
      container: container
    }) == OK
  ) {
    //so it only logs succesful spawns
    console.log(`Spawning a new creep with the name ${name}`);
  }
}

// TODO make creep counts dynamic
const harvesterWanted: number = 3;
const upgradersWanted: number = 1;
const buildersWanted: number = 1;
const repairersWanted: number = 1;
const attackersWanted: number = 0;

export const loop = ErrorMapper.wrapLoop(() => {
  creepsalive = Object.keys(Game.creeps).length;

  var harvesterPop: population = new population("harvester");
  const harvesters: number = harvesterPop.current();
  var upgraderPop: population = new population("upgrader");
  const upgrader: number = upgraderPop.current();
  var builderPop: population = new population("builder");
  const builders: number = builderPop.current();
  var repairerPop: population = new population("repairer");
  const repairers: number = repairerPop.current();
  var attackerPop: population = new population("attacker");
  const attackers: number = attackerPop.current();

  const spawn = Game.spawns[spawnname];
  const room = spawn.room;

  for (const name in Game.creeps) {
    var creep = Game.creeps[name];
    switch (creep.memory.role) {
      case "harvester":
        harvesterLogic(creep);
        break;
      case "builder":
        builderLogic(creep, room);
        break;
      case "upgrader":
        upgraderLogic(creep, room);
        break;
      case "repairer":
        repairerLogic(creep, room);
        break;
      case "miner":
        minerLogic(creep);
        break;
      case "attacker":
        attackerLogic(creep);
        break;
      default:
        //harvesterLogic(creep);
        console.log("Creep without a role");
    }
  }

  let towers: StructureTower[] = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType == STRUCTURE_TOWER });
  towers.forEach(towerLogic);

  let containers: StructureContainer[] = room.find(FIND_STRUCTURES, {
    filter: s => s.structureType == STRUCTURE_CONTAINER
  });

  let extensions = findStructure(room, [STRUCTURE_EXTENSION]).length
  let extensionspossible = 0
  let lvl = room.controller?.level!
  if(lvl < 3){
    extensionspossible = 5*(lvl-1)
  }else {
    extensionspossible = 10*(lvl-2)
  }

  if(extensions < extensionspossible){
    //buildExtGrid(spawn, findFreeSpace(spawn))
  }

  let energyrequired: number = Math.min(room.energyCapacityAvailable - 100, 800);

  if (harvesters < 2 && room.energyAvailable >= 200) {
    spawnCreep(spawn, "harvester", room.energyAvailable, true);
  } else if (room.energyAvailable >= energyrequired) {
    if (harvesters < harvesterWanted) {
      spawnCreep(spawn, "harvester", room.energyAvailable, true);
    } else if (upgrader < upgradersWanted) {
      spawnCreep(spawn, "upgrader", room.energyAvailable, false);
    } else if (builders < buildersWanted) {
      spawnCreep(spawn, "builder", room.energyAvailable, false);
    } else if (repairers < repairersWanted) {
      spawnCreep(spawn, "repairer", room.energyAvailable, false);
    } else if (attackers < attackersWanted) {
      spawnCreep(spawn, "attacker", room.energyAvailable, false);
    } else {
      containers.forEach((c: StructureContainer) => {
        var containercreep: containerMem = new containerMem(c);
        const contCreeps: number = containercreep.current();
        if (contCreeps != 1) {
          spawnCreep(spawn, "miner", room.energyAvailable, false, c);
        }
      }); // TODO give them more of a priority
      // TODO dont store the whole conteiner
    }
  }

  const totalcreepswanted =
    harvesterWanted + upgradersWanted + buildersWanted + repairersWanted + attackersWanted + containers.length;

  if (Game.time % 5 == 0) {
    console.log(`Current game tick is ${Game.time}, creeps alive: ${creepsalive}/${totalcreepswanted}`);
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
