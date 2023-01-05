import { getEnergy, tryHarvest } from "dansdl";
import { random } from "lodash";
import { tryRepair } from "repairer";
import { tryUpgrade } from "upgrader";

function tryRoad(creep: Creep) {
  const randomcreep: Creep = creep.room.find(FIND_MY_CREEPS, {
    filter: function (object) {
      return object.memory.role == "harvester" || object.memory.role == "upgrader";
    }
  })[0]

  if(randomcreep.pos.createConstructionSite(STRUCTURE_ROAD) == OK){

  }else{
    tryUpgrade(creep)
  }

  // TODO make some sort of a heatmap ideally
}

export function tryBuild(creep: Creep) {
  // TODO make it build procedurally
  const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
  if (target) {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  } else {
    tryRoad(creep);
  }
}

export function builderLogic(creep: Creep, room: Room) {
  if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
    creep.memory.working = true;
  }
  if (creep.memory.working) {
    tryBuild(creep);
  }
  if (!creep.memory.working && room.energyAvailable - 0.7 * room.energyAvailable > room.energyCapacityAvailable) {
    getEnergy(creep);
  } else if (!creep.memory.working) {
    tryHarvest(creep);
  }
  if (creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.working = false;
  }
}
