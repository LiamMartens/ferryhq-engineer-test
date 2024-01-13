import { expect, test } from "vitest";
import { calculateShipCoordinates } from "../calculateShipCoordinates";
import { ShipOrientation } from "@/constants";

test("calculateShipCoordinates should be able to calculate the ship coordinates for all orientations", () => {
  expect(
    calculateShipCoordinates([0, 0], 4, ShipOrientation.DEG0, [10, 10])
  ).toEqual([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ]);

  expect(
    calculateShipCoordinates([0, 0], 4, ShipOrientation.DEG90, [10, 10])
  ).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ]);

  expect(
    calculateShipCoordinates([3, 0], 4, ShipOrientation.DEG180, [10, 10])
  ).toEqual([
    [3, 0],
    [2, 0],
    [1, 0],
    [0, 0],
  ]);

  expect(
    calculateShipCoordinates([0, 3], 4, ShipOrientation.DEG270, [10, 10])
  ).toEqual([
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
  ]);
});

test("calculateShipCoordinates should consider the grid boundaries", () => {
  expect(
    calculateShipCoordinates([0, 0], 4, ShipOrientation.DEG180, [10, 10])
  ).toEqual([
    [0, 0],
    [3, 0],
    [2, 0],
    [1, 0],
  ]);
});
