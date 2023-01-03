import { tryBuild } from "builder";

export function tryUpgrade(creep: Creep) {
  // TODO make it build procedurally
  const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
    filter: (s) => (s.structureType == STRUCTURE_CONTROLLER)
  })
  if (target) {
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }
  } else {
    tryBuild(creep)
  }
}

function getEnergy(creep: Creep) {
  var storage: Structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_CONTAINER ||
          s.structureType == STRUCTURE_STORAGE) &&
        s.store[RESOURCE_ENERGY] > 200
    }) ?? creep.pos.findClosestByPath(FIND_MY_SPAWNS) !
    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(storage);
    }
}

function tryHarvest(creep: Creep) {
  const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
  if (target) {
    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
}

export function upgraderLogic(creep: Creep, room: Room) {
  if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
    creep.memory.working = true
  }
  if (creep.memory.working) {
    tryUpgrade(creep);
  }
  if (!creep.memory.working) {
    getEnergy(creep)
  }
  else if(!creep.memory.working){
    //tryHarvest(creep) // TODO Fix this
  }
  if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = false
  }
}
