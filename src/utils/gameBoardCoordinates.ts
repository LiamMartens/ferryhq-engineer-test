import { GridCoordinate } from "@/types";
import { coordinateFromIndex } from "./coordinateFromIndex";

const gameboardCache = new Map<string, GridCoordinate[]>();

export function gameBoardCoordinates(size: [number, number]) {
  const key = `${size[0]}x${size[1]}`;
  if (gameboardCache.has(key)) {
    return gameboardCache.get(key)!;
  }
  const board = new Array(size[0] * size[1])
    .fill(null)
    .map((_, index) => coordinateFromIndex(index, size));
  gameboardCache.set(key, board);
  return board;
}
