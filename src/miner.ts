function moveToCont(creep: Creep) {
  const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: i => i.structureType == STRUCTURE_CONTAINER // TODO add a filter
  });

  const source = creep.pos.findClosestByRange(FIND_SOURCES)!

  if (target) {
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }else{
      creep.memory.working = true
    }
  }
}

function tryMine(creep: Creep) {
  const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
  if (target) {
    creep.harvest(target)
  }
}

// TODO need a lorry and something to keep containers alive if im going to use miners

export function minerLogic(creep: Creep) {
  if (!creep.memory.working) {
    moveToCont(creep)
  }
  if (creep.memory.working) {
    tryMine(creep)
  }
}
