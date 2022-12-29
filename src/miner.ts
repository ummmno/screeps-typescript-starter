function tryMine(creep: Creep) {
  const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
      i.store[RESOURCE_ENERGY] > 0
  });
  if (target) {
    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
}

// TODO need a lorry and something to keep containers alive if im going to use miners

export function harvesterLogic(creep: Creep) {
  if (creep.memory.working) {
    tryHarvest(creep);
  }
}
