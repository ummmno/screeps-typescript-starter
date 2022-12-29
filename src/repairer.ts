export function tryRepair(creep: Creep) {
  const targets = creep.room.find(FIND_STRUCTURES, {
    filter: object => object.hits < object.hitsMax
  });

  targets.sort((a, b) => a.hits - b.hits);

  if (targets.length > 0) {
    if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0]);
    }
  }
}

function getEnergy(creep: Creep) {
  var storage: Structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_CONTAINER ||
          s.structureType == STRUCTURE_SPAWN ||
          s.structureType == STRUCTURE_STORAGE) &&
        s.store[RESOURCE_ENERGY] > s.store.getCapacity(RESOURCE_ENERGY)
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

export function repairerLogic(creep: Creep, room:Room) {
  if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
    creep.memory.working = true
  }
  if (creep.memory.working) {
    tryRepair(creep);
  }
  if (!creep.memory.working && room.energyAvailable - 0.7*room.energyAvailable > room.energyCapacityAvailable) {
    getEnergy(creep)
  }
  else if(!creep.memory.working){
    tryHarvest(creep)
  }
  if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = false
  }
}
