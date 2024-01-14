"use client";

import React from "react";
import { css } from "@panda/css";
import {
  GridState,
  OnCellClick,
  OnCellPointerEnter,
  OnCellPointerLeave,
  PlayerGrid as UIPlayerGrid,
} from "@/ui/PlayerGrid";

type Props = {
  isPrivate?: boolean;
  name: string;
  label?: string;
  gridState?: GridState;
  onCellClick?: OnCellClick;
  onCellPointerEnter?: OnCellPointerEnter;
  onCellPointerLeave?: OnCellPointerLeave;
};

export function PlayerGrid({
  isPrivate,
  name,
  label,
  gridState,
  onCellClick,
  onCellPointerEnter,
  onCellPointerLeave,
}: Props) {
  return (
    <div className={css({})}>
      <p className={css({ color: "white", mb: "2" })}>{name}</p>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1",
          height: "50vh",
        })}
      >
        <UIPlayerGrid
          isPrivate={isPrivate}
          gridState={gridState ?? []}
          size={[10, 10]}
          onCellClick={onCellClick}
          onCellPointerEnter={onCellPointerEnter}
          onCellPointerLeave={onCellPointerLeave}
        />
      </div>
      <p className={css({ color: "white", mt: "2" })}>{label}</p>
    </div>
  );
}
