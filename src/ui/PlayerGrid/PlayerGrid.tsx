import type { WithCss } from "@panda/types";
import {
  PlayerGridSquare,
  PlayerGridSquareProps,
  PlayerGridSquareState,
} from "../PlayerGridSquare";
import { css } from "@panda/css";
import { useId, useMemo } from "react";
import { GridCoordinate } from "@/types";

type GridState = {
  coordinates: GridCoordinate;
  state: PlayerGridSquareState;
}[];

type OnCellClick = PlayerGridSquareProps["onClick"];
type OnCellPointerEnter = PlayerGridSquareProps["onPoinerEnter"];
type OnCellPointerLeave = PlayerGridSquareProps["onPoinerLeave"];

type Props = WithCss & {
  isPrivate?: boolean;
  size: [number, number];
  gridState:
    | GridState
    | ((coordinates: GridCoordinate) => GridState[number] | null);
  onCellClick?: OnCellClick;
  onCellPointerEnter?: OnCellPointerEnter;
  onCellPointerLeave?: OnCellPointerLeave;
};

export function PlayerGrid({
  isPrivate,
  size,
  gridState,
  css: cssOverride,
  onCellClick,
  onCellPointerEnter,
  onCellPointerLeave,
}: Props) {
  const id = useId();
  const slots = useMemo<null[]>(
    () => new Array(size[0] * size[1]).fill(null),
    [size]
  );

  return (
    <div
      className={css(
        {
          display: "grid",
          gap: "2",
        },
        cssOverride
      )}
      style={{
        gridTemplateColumns: `repeat(${size[0]}, minmax(0,1fr))`,
        gridTemplateRows: `repeat(${size[1]}, minmax(0,1fr))`,
      }}
    >
      {slots.map((_, index) => {
        const row = Math.floor(index / size[0]);
        const col = index - row * size[0];
        const squareState =
          typeof gridState === "function"
            ? gridState([col, row])
            : gridState.find(
                ({ coordinates }) =>
                  coordinates[0] === col && coordinates[1] === row
              );

        return (
          <PlayerGridSquare
            key={`playergrid-square-${id}-${row}-${col}`}
            isPrivate={isPrivate}
            row={row}
            column={col}
            state={squareState?.state ?? PlayerGridSquareState.EMPTY}
            onClick={onCellClick}
            onPoinerEnter={onCellPointerEnter}
            onPoinerLeave={onCellPointerLeave}
          />
        );
      })}
    </div>
  );
}
