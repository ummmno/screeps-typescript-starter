function tryHarvest(creep: Creep) {
  const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
  if (target) {
    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
}

function tryEnergyTransfer(creep: Creep) {
  var structure:Structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (s) => (s.structureType == STRUCTURE_SPAWN ||
      s.structureType == STRUCTURE_EXTENSION ||
      s.structureType == STRUCTURE_TOWER ||
      s.structureType == STRUCTURE_STORAGE) &&
      s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY)
  }) ?? creep.pos.findClosestByPath(FIND_MY_SPAWNS)!
  if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(structure)
  }
}

export function harvesterLogic(creep: Creep) {
  if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
    creep.memory.working = false
  }
  if (creep.memory.working) {
    tryHarvest(creep);
  }
  if (!creep.memory.working) {
    tryEnergyTransfer(creep)
  }
  if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = true
  }
}
