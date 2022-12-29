function tryBuild(creep: Creep) {
  // TODO make it build procedurally
  const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
  if (target) {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
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
    if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(storage);
  }
}

export function builderLogic(creep: Creep) {
  if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
    creep.memory.working = true
  }
  if (creep.memory.working) {
    tryBuild(creep);
  }
  if (!creep.memory.working) {
    getEnergy(creep)
  }
  if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = false
  }
}
