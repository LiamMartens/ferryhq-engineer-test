import { GridCoordinate } from "@/types";

export function coordinateFromIndex(
  index: number,
  gridSize: [number, number]
): GridCoordinate {
  const row = Math.floor(index / gridSize[0]);
  const col = index - row * gridSize[0];
  return [col, row];
}
