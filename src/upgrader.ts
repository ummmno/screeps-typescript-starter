import { tryBuild } from "builder";
import { getEnergy, tryHarvest } from "dansdl";

export function tryUpgrade(creep: Creep) {
  // TODO make it build procedurally
  const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
    filter: (s) => (s.structureType == STRUCTURE_CONTROLLER)
  })!

  if (target) {
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }
  } else {
    tryBuild(creep)
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
    tryHarvest(creep)
  }
  if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = false
  }
}
