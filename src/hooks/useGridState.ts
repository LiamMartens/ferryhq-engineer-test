import { ShipOrientation } from "@/constants";
import { GamePlayer } from "@/game";
import { IGameState } from "@/game/IGameState";
import { GridCoordinate } from "@/types";
import { GridState } from "@/ui/PlayerGrid";
import { PlayerGridSquareState } from "@/ui/PlayerGridSquare";
import { calculateShipCoordinates, doesShipOverlap } from "@/utils";
import { useMemo } from "react";

type UseGridStateConfig = {
  player: GamePlayer;
  gameState: IGameState;
  activeCell: GridCoordinate | null;
  placingShipState: {
    shipSize: number;
    orientation: ShipOrientation;
    resolve: (value: GridCoordinate[]) => void;
  } | null;
  playingRoundState: {
    resolve: (value: {
      coordinate: GridCoordinate;
      target: GamePlayer;
    }) => void;
  } | null;
  displayOptions: {
    showShips: boolean;
  };
};

export function useGridState(config: UseGridStateConfig) {
  return useMemo(() => {
    const state: GridState = [];

    if (config.placingShipState && config.activeCell) {
      const shipCoords = calculateShipCoordinates(
        config.activeCell,
        config.placingShipState.shipSize,
        config.placingShipState.orientation,
        config.gameState.config.gridSize
      );
      shipCoords.forEach((coord) => {
        const overlaps = config.player.state.ships.some((ship) =>
          doesShipOverlap(ship.coordinates, [coord])
        );
        state.push({
          coordinates: coord,
          state: overlaps
            ? PlayerGridSquareState.HIT
            : PlayerGridSquareState.HIGHLIGHTED,
        });
      });
    }

    if (config.playingRoundState && config.activeCell) {
      state.push({
        coordinates: config.activeCell,
        state: PlayerGridSquareState.HIGHLIGHTED,
      });
    }

    for (const player of config.gameState.players) {
      if (player !== config.player) {
        const firedShots = player.state.firedShots.get(config.player);
        if (firedShots) {
          for (const shot of firedShots) {
            state.push({
              coordinates: shot.coordinate,
              state: shot.hit
                ? PlayerGridSquareState.HIT
                : PlayerGridSquareState.MISS,
            });
          }
        }
      }
    }

    if (config.displayOptions.showShips) {
      config.player.state.ships.forEach((ship) => {
        for (const coord of ship.coordinates) {
          state.push({
            coordinates: coord,
            state: PlayerGridSquareState.OCCUPIED,
          });
        }
      });
    }

    return state;
  }, [config]);
}
