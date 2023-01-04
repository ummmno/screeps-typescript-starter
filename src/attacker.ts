function goToRoom(creep:Creep){
  const attackroom = new Room('W7N2')
  //const target = creep.pos.findClosestByPath(attackroom.find(FIND_HOSTILE_SPAWNS)!)!
  if(creep.room != attackroom){
    //creep.moveTo(target.pos)
  }
}

export function attackerLogic(creep:Creep){
  if(!creep.memory.working){
    goToRoom(creep)
  }
}
