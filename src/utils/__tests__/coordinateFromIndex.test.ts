import { expect, test } from "vitest";
import { coordinateFromIndex } from "../coordinateFromIndex";

test("should work", () => {
  expect(coordinateFromIndex(12, [5, 5])).toEqual([2, 2]);
});
