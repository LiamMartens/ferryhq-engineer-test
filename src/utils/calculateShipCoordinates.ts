import { ShipOrientation } from "@/constants";
import { GridCoordinate } from "@/types";

export function calculateShipCoordinates(
  head: GridCoordinate,
  size: number,
  orientation: ShipOrientation,
  gridSize: [number, number]
) {
  const directionIndex =
    orientation === ShipOrientation.DEG0 ||
    orientation === ShipOrientation.DEG180
      ? 0
      : 1;
  const step =
    orientation === ShipOrientation.DEG0 ||
    orientation === ShipOrientation.DEG90
      ? 1
      : -1;

  const ship: [number, number][] = [[head[0], head[1]]];
  for (let i = 1; i < size; i++) {
    if (directionIndex === 0) {
      let next = head[0] + step * i;
      if (next < 0) next += size;
      if (next >= gridSize[0]) next -= size;
      ship.push([next, head[1]]);
    } else {
      let next = head[1] + step * i;
      if (next < 0) next += size;
      if (next >= gridSize[1]) next -= size;
      ship.push([head[0], next]);
    }
  }

  return ship;
}
