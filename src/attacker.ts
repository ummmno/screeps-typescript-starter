function goToRoom(creep:Creep){
  const position = new RoomPosition(25, 25,'W7N2')
  if(creep.pos != position){
    creep.moveTo(position)
  }
}

export function attackerLogic(creep:Creep){
  if(!creep.memory.working){
    goToRoom(creep)
  }
}
