import { act, renderHook } from "@testing-library/react-hooks";
import { it, expect } from "vitest";
import { useCellPointerHover } from "..";

it("should work", () => {
  const { result } = renderHook(() => useCellPointerHover());
  expect(result.current.hovering).toEqual(null);

  act(() => {
    result.current.handleCellPointerEnter([0, 0]);
  });
  expect(result.current.hovering).toEqual([0, 0]);

  act(() => {
    result.current.handleCellPointerLeave();
  });
  expect(result.current.hovering).toEqual(null);
});
