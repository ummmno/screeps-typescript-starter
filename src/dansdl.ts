import { privateEncrypt } from "crypto";
import { inRange, isNull } from "lodash";

export function findStructure(room: Room, filter: StructureConstant[]) {
  return room.find(FIND_STRUCTURES, {
    filter: s => filter.some(c => c == s.structureType)
  });
}

export function getEnergy(creep: Creep) {
  var storage: Structure | null = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: s =>
      (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 200
  });
  if (storage != null && creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(storage);
  } else {
    //console.log('no cont with energy more than 200') // TODO not working
    creep.moveTo(findStructure(creep.room, [STRUCTURE_CONTAINER])[0]);
  }
}

export function tryHarvest(creep: Creep): boolean {
  const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
  if (target) {
    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    return true;
  } else {
    return false;
  }
}

interface vector {
  x: number;
  y: number;
}

export function findFreeSpace(spawn: StructureSpawn): vector {
  const room = spawn.room;
  var originX: number = spawn.pos.x;
  var originY: number = spawn.pos.y;

  let offsetX = 0;
  let offsetY = -4;
  let tempx = 0;
  let tempy = 0;

  let i = 0;
  while (i < 4) {
    tempx = offsetX;
    tempy = offsetY;
    if (room.getTerrain().get(originX + offsetX, originY + offsetY) != TERRAIN_MASK_WALL) {
      if (room.getTerrain().get(originX + offsetX * 2, originY + offsetY * 2) != TERRAIN_MASK_WALL) {
        return { x: offsetX + originX, y: offsetY + originY };
      }
    }
    offsetX = tempy;
    offsetY = tempx * -1;
    i++;
  }
  return { x: NaN, y: NaN };
}

function outwardIterateSearchTiles(iterations: number, fn: (x: number, y: number) => any) {
  for (let i = 1; i <= iterations; i++) {
    for (let o = i; o >= 0; o--) {
      fn(i - o, o);
      if (i - o != 0) {
        fn(-(i - o), o);
      }
    }
  }
}

export function tryPlaceRoad(x: number, y: number, room: Room) {
  if (room.getTerrain().get(x, y) != TERRAIN_MASK_WALL) {
    return OK == room.createConstructionSite(x, y, STRUCTURE_ROAD);
    //new RoomVisual(room.name).circle(x, y, { fill: "#072af0" });
  } else {
    console.log(`Wall at ${x}, ${y}`);
    return false;
  }
}

function tryPlaceExtension(x: number, y: number, room: Room) {
  if (room.getTerrain().get(x, y) != TERRAIN_MASK_WALL) {
    return OK == room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
    //new RoomVisual(room.name).circle(x, y, { fill: "#e09119" });
  } else {
    console.log(`Wall at ${x}, ${y}`);
    return false;
  }
}

function placeExtOrRoad(x: number, y: number, room: Room) {
  let isCont = (x: number, y: number) =>
    room.lookAt(x, y).filter(s => {
      if (
        s.structure?.structureType == STRUCTURE_EXTENSION ||
        s.constructionSite?.structureType == STRUCTURE_EXTENSION
      ) {
        return true;
      }
      return false;
    }).length > 0;

  if (isCont(x + 1, y) || isCont(x, y + 1) || isCont(x - 1, y) || isCont(x, y - 1)) {
    return tryPlaceRoad(x, y, room);
  } else {
    return tryPlaceExtension(x, y, room);
  }
}

export function buildExtGrid(spawn: StructureSpawn, buildPosVector: vector) {
  const room = spawn.room;
  var originX: number = spawn.pos.x;
  var originY: number = spawn.pos.y;

  if (room.lookForAt(LOOK_CONSTRUCTION_SITES, buildPosVector.x, buildPosVector.y)) {
    room.createConstructionSite(buildPosVector.x, buildPosVector.y, STRUCTURE_EXTENSION);
  }

  let changeVector: vector = {
    x: originX - buildPosVector.x == 0 ? 0 : (originX - buildPosVector.x) / Math.abs(originX - buildPosVector.x),
    y: originY - buildPosVector.y == 0 ? 0 : (originY - buildPosVector.y) / Math.abs(originY - buildPosVector.y)
  };
  if (isNull(changeVector.x)) {
    changeVector.x = 0;
  }
  if (isNull(changeVector.y)) {
    changeVector.y = 0;
  }

  outwardIterateSearchTiles(4, (x, y) => {
    switch (changeVector.x) {
      case -1:
        if(placeExtOrRoad(buildPosVector.x - y, buildPosVector.y + x, room)){
          return
        }
        break;
      case 0:
        switch (changeVector.y) {
          case 1:
            if(placeExtOrRoad(buildPosVector.x - x, buildPosVector.y - y, room)){
              return
            }
            break;
          case -1:
            if(placeExtOrRoad(buildPosVector.x - x, buildPosVector.y + y, room)){
              return
            }
            break;
        }
        break;
      case 1:
        if(placeExtOrRoad(buildPosVector.x + y, buildPosVector.y - x, room)){
          return
        }
        break;
    }
  });

  // let x: number = buildPosVector.x;
  // let y: number = buildPosVector.y;
  // let tempVectorX: number = changeVector.x;
  // let tempVectorY: number = changeVector.y;

  // let foundSpace: boolean = false;

  // var pos = new RoomPosition(x, y, room.name);
  // while (!foundSpace) {
  //   if (pos.lookFor("structure") == undefined && pos.lookFor("constructionSite") == undefined) {
  //     changeVector.x = tempVectorY;
  //     changeVector.y = tempVectorX;

  //     pos.x = x + changeVector.x;
  //     pos.y = y;
  //   } else {
  //     foundSpace = true;
  //   }
  // }

  //new RoomVisual(room.name).circle(vector.x, vector.y, { fill: "#29ffc6" });
}
