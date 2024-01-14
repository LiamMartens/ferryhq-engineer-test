import { GridCoordinate } from "@/types";

export function doesShipOverlap(
  shipA: GridCoordinate[],
  shipB: GridCoordinate[],
  minDistance = 1
) {
  return shipA.some(([column, row]) =>
    shipB.some((bcoord) => {
      const coldiff = Math.abs(bcoord[0] - column);
      const rowdiff = Math.abs(bcoord[1] - row);
      return coldiff + rowdiff < minDistance;
    })
  );
}
