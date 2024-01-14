import { it, expect } from "vitest";
import { doesShipOverlap } from "../doesShipOverlap";

it("should return true", () => {
  expect(
    doesShipOverlap(
      [
        [0, 0],
        [1, 0],
      ],
      [
        [1, 0],
        [1, 1],
      ]
    )
  ).toEqual(true);
});

it("should return false", () => {
  expect(
    doesShipOverlap(
      [
        [0, 0],
        [1, 0],
      ],
      [
        [1, 1],
        [1, 2],
      ]
    )
  ).toEqual(false);
});
