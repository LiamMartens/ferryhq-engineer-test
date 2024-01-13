export enum PlayerGridSquareState {
  EMPTY = "empty", // no ship
  OCCUPIED = "occupied", // a ship on this square
  HIT = "hit", // this square has been hit -> implies occupied
  MISS = "miss", // this square has been missed
  HIGHLIGHTED = "highlighted", // state dependent
}
