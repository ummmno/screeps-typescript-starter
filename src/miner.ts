import { object } from "lodash";

function moveToCont(creep: Creep) {
  const target = creep.memory.container
  const source = creep.pos.findClosestByRange(FIND_SOURCES)!

  if (target != undefined) {
    if (creep.harvest(source) != OK) {
      let found = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.structureType == STRUCTURE_CONTAINER &&
        object.id == target.id
      })[0];

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

// TODO need a lorry and something to keep containers alive if im going to use miners

export function minerLogic(creep: Creep) {
  if (!creep.memory.working) {
    moveToCont(creep)
  }
  if (creep.memory.working) {
    tryMine(creep)
  }
}
