function goToRoom(creep: Creep) {
  const position = new RoomPosition(25, 25, "W7N2"); //W7N2
  if (creep.pos.getRangeTo(position) != 0) {
    creep.moveTo(position);
  } else {
    creep.memory.working = true;
  }
}

function attackCreeps(creep: Creep) {
  const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (target) {
    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
  if (!target) {
    const spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
    if (spawn != null && creep.pos.getRangeTo(spawn) != 0) {
      creep.moveTo(spawn);
    }else{
      // ??
    }
  }
}

function signController(creep: Creep) {
  if (creep.room.controller) {
    if (creep.signController(creep.room.controller, '"Pees on your controller"') == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  }
}

export function attackerLogic(creep: Creep) {
  if (!creep.memory.working) {
    goToRoom(creep);
  }
  if (creep.memory.working) {
    attackCreeps(creep);
  }
}
