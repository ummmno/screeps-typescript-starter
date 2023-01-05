export function findStructure(room: Room, filter: StructureConstant[]) {
  room.find(FIND_STRUCTURES, {
    filter: s => s.structureType in filter
  });
}

export function getEnergy(creep: Creep) {
  var storage: Structure =
    creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s =>
        (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
        s.store[RESOURCE_ENERGY] > 200
    }) ?? creep.pos.findClosestByPath(FIND_MY_SPAWNS)!;
  if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(storage);
  }
}

export function tryHarvest(creep: Creep):boolean {
  const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
  if (target) {
    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    return true
  } else {
    return false
  }
}
