export function towerLogic(tower: StructureTower) {
  const enemyCreep: Creep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)!;

  if (enemyCreep) {
    tower.attack(enemyCreep);
  } else if (tower.store[RESOURCE_ENERGY] > 500) {
    const targets = tower.room.find(FIND_STRUCTURES, {
      filter: object => object.hits < object.hitsMax
    });

    targets.sort((a, b) => a.hits - b.hits);

    if (targets.length > 0) {
      tower.repair(targets[0]);
    }
  }
}
