import {
  Console
} from "console";
import {
  harvesterLogic
} from "harvester";
import {
  ErrorMapper
} from "utils/ErrorMapper";

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
    role ? : string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

function randomname(): string {
  var names: string[] = ["Michael", "Dwight", "Jim", "Pam", "Ryan", "Andy", "Robert", "Kelly", "Stanley", "Kevin", "Meredith", "Angela", "Oscar", "Phyllis", "Toby", "Creed", "Darryl", "Roy", "Erin", "Gabe", "Clark", "Pete", "David", "Deangelo", "Jo", "Josh", "Charles", "Ed", "Dan", "Craig", "Troy", "Karen", "Danny", "A.J.", "Ben", "Todd", "Cathy", "Hunter", "Rolando", "Stephanie", "Jordan", "Ronni", "Lonny", "Madge", "Glenn", "Jerry", "Phillip", "Michael", "Matt", "Hidetoshi", "Gary", "Val", "Nate", "Gideon", "Bruce", "Frank", "Louanne", "Devon", "Kendall", "Sadiq", "Nick", "Tony", "Martin", "Hannah", "Hank", "Billy", "Leo", "Brenda", "Vikram", "Al", "Elizabeth", "Fern", "Brandon", "Justin", "Megan", "Deborah", "Tom", "Brian"]
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex] + Math.random();
}
var spawnname = "Spawn1"
var creepsalive: number = 0

class population {
  constructor(role:string) {
    this.role = role
  }
  role:string
  current(){
    var count:number = 0
    for (const name in Game.creeps) {
      var creep = Game.creeps[name]
      if(creep.memory.role == this.role) {
        count++
      }
    }
    return count
  }
}

// TODO make creep counts dynamic
const harvesterWanted:number = 100

export const loop = ErrorMapper.wrapLoop(() => {
  creepsalive = Object.keys(Game.creeps).length
  if (Game.time % 5 == 0) {
    console.log(`Current game tick is ${Game.time}, creeps alive: ${creepsalive}`)
  }

  var harvesterPop:population = new population('harvester')
  const harvesters:number = harvesterPop.current();

  for (const name in Game.creeps) {
    var creep = Game.creeps[name]
    switch (creep.memory.role) {
      case 'harvester':
        harvesterLogic(creep)
        break
      default:
        harvesterLogic(creep)
        console.log('Creep without a role')
    }
  }

  const spawn = Game.spawns[spawnname]
  if (harvesters < harvesterWanted) {
    var name: string = randomname()
    // TODO fix this to work with all roles
    if (spawn.createCreep([MOVE, CARRY, WORK], name, {
        role: 'harvester',
        room: spawn.room.name,
        working: true
      }) == OK) {
      console.log(`Spawning a new creep with the name ${name}`)
    }
  }

  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
