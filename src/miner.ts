import { isEqual, object } from "lodash";

function moveToCont(creep: Creep) {
  const target = creep.memory.container!
  const found = creep.room.find(FIND_STRUCTURES, {
    filter: object => object.structureType == STRUCTURE_CONTAINER &&
    object.id == target.id
  })[0];

  if (target != undefined) {
    if (!creep.pos.isEqualTo(found.pos)) {
      creep.moveTo(found)
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

export function minerLogic(creep: Creep) {
  if (!creep.memory.working) {
    moveToCont(creep)
  }
  if (creep.memory.working) {
    tryMine(creep)
  }
}
