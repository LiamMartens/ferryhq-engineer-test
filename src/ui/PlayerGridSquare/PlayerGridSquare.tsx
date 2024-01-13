import { css, cva } from "@panda/css";
import { PlayerGridSquareState } from "./PlayerGridSquareState";
import type { WithCss } from "@panda/types";
import React, { ButtonHTMLAttributes } from "react";
import { GridCoordinate } from "@/types";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type OnClick = (
  coordinates: GridCoordinate,
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;
type OnPointer = (
  coordinates: GridCoordinate,
  event: React.PointerEvent<HTMLButtonElement>
) => void;

export type PlayerGridSquareProps = WithCss & {
  isPrivate?: boolean;
  disabled?: boolean;
  row: number;
  column: number;
  state: PlayerGridSquareState;
  onClick?: OnClick;
  onPoinerEnter?: OnPointer;
  onPoinerLeave?: OnPointer;
};

const playerGridSquareRecipe = cva({
  base: {
    borderRadius: "lg",
    borderWidth: "medium",
    borderColor: "neutral.300",
    cursor: "pointer",
    transition: "all 200ms",
    _disabled: {
      pointerEvents: "none",
    },
  },
  variants: {
    private: {
      true: {},
      false: {},
    },
    state: {
      empty: { background: "neutral.800" },
      occupied: { background: "neutral.200" },
      hit: { background: "red.500" },
      miss: { background: "orange.500" },
      highlighted: { background: "blue.500" },
    },
  },
  compoundVariants: [
    {
      private: true,
      state: PlayerGridSquareState.OCCUPIED,
      css: {
        background: "neutral.800",
      },
    },
  ],
  defaultVariants: {
    state: PlayerGridSquareState.EMPTY,
  },
});

export function PlayerGridSquare({
  isPrivate = false,
  state = PlayerGridSquareState.EMPTY,
  disabled,
  row,
  column,
  css: cssOverride,
  onClick,
  onPoinerEnter,
  onPoinerLeave,
}: PlayerGridSquareProps) {
  const handleClick: ButtonProps["onClick"] = (event) => {
    onClick?.([column, row], event);
  };

  const handlePointerEnter: ButtonProps["onPointerEnter"] = (event) => {
    onPoinerEnter?.([column, row], event);
  };

  const handlePointerLeave: ButtonProps["onPointerLeave"] = (event) => {
    onPoinerLeave?.([column, row], event);
  };

  return (
    <button
      data-playergridsquare-row={row}
      data-playergridsquare-column={column}
      disabled={disabled}
      className={css(
        playerGridSquareRecipe.raw({ private: isPrivate, state }),
        cssOverride
      )}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    ></button>
  );
}
