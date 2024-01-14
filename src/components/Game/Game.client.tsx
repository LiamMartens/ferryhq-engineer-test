"use client";

import { useCellPointerHover, useGame } from "@/hooks";
import { css } from "@panda/css";
import { PlayerGrid } from "./PlayerGrid.client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { OnCellClick } from "@/ui/PlayerGrid";
import { GridCoordinate } from "@/types";
import { ShipOrientation } from "@/constants";
import { calculateShipCoordinates, doesShipOverlap } from "@/utils";
import { AutoGamePlayer, GamePlayer, ManualGamePlayer } from "@/game";
import { useGridState } from "@/hooks/useGridState";
import { PlayStateType } from "@/game/IGameState";
import { PrimaryButton } from "@/ui/PrimaryButton";

type PlacingShipState = {
  shipSize: number;
  orientation: ShipOrientation;
  resolve: (value: GridCoordinate[]) => void;
};

type PlayingRoundState = {
  resolve: (value: { coordinate: GridCoordinate; target: GamePlayer }) => void;
};

type Props = {
  showComputerShips?: boolean;
};

export function Game({ showComputerShips = true }: Props) {
  const [placingShipState, setPlacingShipState] =
    useState<PlacingShipState | null>(null);
  const [playingRoundState, setPlayingRoundState] =
    useState<PlayingRoundState | null>(null);

  const playersRef = useRef([
    new ManualGamePlayer({
      placeShip: async (player, gameState, shipSize) => {
        const result = await new Promise<GridCoordinate[]>((resolve) => {
          setPlacingShipState({
            shipSize,
            resolve,
            orientation: ShipOrientation.DEG0,
          });
        });
        setPlacingShipState(null);
        return result;
      },
      playRound: async (player, gameState) => {
        const result = await new Promise<{
          coordinate: GridCoordinate;
          target: GamePlayer;
        }>((resolve) => {
          setPlayingRoundState({
            resolve,
          });
        });
        setPlayingRoundState(null);
        return result;
      },
    }),
    new AutoGamePlayer(),
  ]);

  const {
    ref: gameRef,
    playState,
    playerStates,
    run,
  } = useGame(playersRef.current);

  const {
    hovering: playerCellHover,
    handleCellPointerEnter: handlePlayerCellPointerEnter,
    handleCellPointerLeave: handlePlayerCellPointerLeave,
  } = useCellPointerHover();

  const {
    hovering: computerCellHover,
    handleCellPointerEnter: handleComputerCellPointerEnter,
    handleCellPointerLeave: handleComputerCellPointerLeave,
  } = useCellPointerHover();

  const playerGridState = useGridState({
    player: playersRef.current[0],
    placingShipState,
    playingRoundState: null,
    activeCell: playerCellHover,
    gameState: gameRef.current,
    displayOptions: { showShips: true },
  });

  const computerGridState = useGridState({
    player: playersRef.current[1],
    playingRoundState,
    placingShipState: null,
    activeCell: computerCellHover,
    gameState: gameRef.current,
    displayOptions: { showShips: showComputerShips },
  });

  const playerGridLabel = useMemo(() => {
    if (placingShipState) {
      return `Placing ship (length ${placingShipState.shipSize}) - TIP: Press R to rotate`;
    }
    return null;
  }, [placingShipState]);

  const handlePlayerCellClick: OnCellClick = (coord) => {
    if (placingShipState) {
      const shipCoords = calculateShipCoordinates(
        coord,
        placingShipState.shipSize,
        placingShipState.orientation,
        gameRef.current.config.gridSize
      );
      const overlaps = shipCoords.some((coord) =>
        playersRef.current[0].state.ships.some((ship) =>
          doesShipOverlap(ship.coordinates, [coord])
        )
      );
      if (overlaps) {
        alert("Can't place overlapping ship");
      } else {
        placingShipState.resolve(shipCoords);
      }
    }
  };

  const handleComputerCellClick: OnCellClick = (coord) => {
    if (playingRoundState) {
      const [player, computerPlayer] = playersRef.current;
      const hasPreviouslySelected = player.state.firedShots
        .get(computerPlayer)
        ?.some(
          (shot) =>
            shot.coordinate[0] === coord[0] && shot.coordinate[1] === coord[1]
        );
      if (hasPreviouslySelected) {
        alert("You already attacked this square");
      } else {
        playingRoundState.resolve({
          coordinate: coord,
          target: computerPlayer,
        });
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handler = (event: KeyboardEvent) => {
        if (event.code === "KeyR" && placingShipState) {
          const orientationValues = Object.values(ShipOrientation);
          const currentIndex = orientationValues.indexOf(
            placingShipState.orientation
          );
          setPlacingShipState({
            ...placingShipState,
            orientation:
              orientationValues[(currentIndex + 1) % orientationValues.length],
          });
        }
      };
      window.addEventListener("keypress", handler);
      return () => {
        window.removeEventListener("keypress", handler);
      };
    }
  }, [placingShipState]);

  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "full",
      })}
    >
      <div
        className={css({
          display: "grid",
          gap: "8",
          width: "full",
          maxW: "4xl",
          gridTemplateColumns: "2",
          gridTemplateRows: "1",
        })}
      >
        <PlayerGrid
          name="You"
          label={playerGridLabel ?? undefined}
          gridState={playerGridState}
          onCellPointerLeave={handlePlayerCellPointerLeave}
          onCellPointerEnter={handlePlayerCellPointerEnter}
          onCellClick={handlePlayerCellClick}
        />
        <PlayerGrid
          name="Computer"
          gridState={computerGridState}
          onCellClick={handleComputerCellClick}
          onCellPointerLeave={handleComputerCellPointerLeave}
          onCellPointerEnter={handleComputerCellPointerEnter}
        />
      </div>

      {playState.type === PlayStateType.IDLE && (
        <PrimaryButton css={{ mt: "2" }} onClick={run}>
          Start game
        </PrimaryButton>
      )}

      {playState.type === PlayStateType.ENDED && (
        <div className={css({ mt: "2", textAlign: "center" })}>
          <div
            className={css({
              color: "white",
              fontSize: "2xl",
            })}
          >
            {playState.winner === playersRef.current[0] && "You won!"}
            {playState.winner === playersRef.current[1] && "You lost!"}
          </div>
          <PrimaryButton css={{ mt: "2" }} onClick={run}>
            Restart game
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
