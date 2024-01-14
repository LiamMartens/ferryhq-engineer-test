import { GridCoordinate } from "@/types";

export function doesShipOverlap(
  shipA: GridCoordinate[],
  shipB: GridCoordinate[]
) {
  return shipA.some(([column, row]) =>
    shipB.some((bcoord) => bcoord[0] === column && bcoord[1] === row)
  );
}
