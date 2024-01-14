import { expect, test } from "vitest";
import { gameBoardCoordinates } from "../gameBoardCoordinates";

test("should work", () => {
  const board = gameBoardCoordinates([4, 4]);
  expect(board).toEqual([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ]);
  expect(board === gameBoardCoordinates([4, 4])).toBe(true);
});
