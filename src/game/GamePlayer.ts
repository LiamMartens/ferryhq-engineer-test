import type { GridCoordinate } from "@/types";
import type { IGameState } from "./IGameState";
import { calculateShipCoordinates } from "@/utils/calculateShipCoordinates";
import { ShipOrientation } from "@/constants";
import { doesShipOverlap, gameBoardCoordinates } from "@/utils";

export type PlayerShip = {
  coordinates: GridCoordinate[];
  sunkCoordinates: GridCoordinate[];
};

export type PlayerFiredShot = {
  coordinate: GridCoordinate;
  hit: boolean;
};

export type PlayerState = {
  ships: PlayerShip[];
  firedShots: Map<GamePlayer, PlayerFiredShot[]>;
};

export abstract class GamePlayer {
  abstract placeShips: (gameState: IGameState) => Promise<void>;
  abstract playRound: (gameState: IGameState) => Promise<void>;

  public state: PlayerState;

  get hasLost() {
    return this.state.ships.every(
      (ship) => ship.coordinates.length === ship.sunkCoordinates.length
    );
  }

  constructor() {
    this.state = {
      ships: [],
      firedShots: new Map(),
    };
  }

  public reset = () => {
    this.state = {
      ships: [],
      firedShots: new Map(),
    };
  };

  public checkShot = ([column, row]: GridCoordinate) => {
    const hitShip = this.state.ships.find((ship) =>
      doesShipOverlap(ship.coordinates, [[column, row]])
    );
    if (hitShip) {
      hitShip.sunkCoordinates.push([column, row]);
      return true;
    }
    return false;
  };
}

export class AutoGamePlayer extends GamePlayer {
  placeShips = async (gameState: IGameState) => {
    // @README this isn't optimal of course but fine for now
    const orientationValues = Object.values(ShipOrientation);
    for (const shiplength of gameState.config.ships) {
      let isValidShipPlacement = false;
      while (!isValidShipPlacement) {
        const orientation = Math.floor(
          Math.random() * orientationValues.length
        );
        const column = Math.floor(Math.random() * gameState.config.gridSize[0]);
        const row = Math.floor(Math.random() * gameState.config.gridSize[1]);
        const coordinates = calculateShipCoordinates(
          [column, row],
          shiplength,
          orientationValues[orientation],
          gameState.config.gridSize
        );
        isValidShipPlacement =
          !this.state.ships.length ||
          this.state.ships.every(
            (ship) => !doesShipOverlap(coordinates, ship.coordinates, 2)
          );
        if (isValidShipPlacement) {
          this.state.ships.push({
            coordinates,
            sunkCoordinates: [],
          });
        }
      }
    }
  };

  playRound = async (gameState: IGameState) => {
    const targetablePlayers = gameState.players.filter(
      (player) => player !== this
    );
    const targetPlayerIndex = Math.floor(
      Math.random() * targetablePlayers.length
    );
    const targetPlayer = targetablePlayers[targetPlayerIndex];
    const firedPlayerShots = this.state.firedShots.get(targetPlayer) ?? [];
    const targetableSquares = gameBoardCoordinates(
      gameState.config.gridSize
    ).filter(
      ([col, row]) =>
        !firedPlayerShots.some(
          ({ coordinate }) => coordinate[0] === col && coordinate[1] === row
        )
    );

    const targetSquareIndex = Math.floor(
      Math.random() * targetableSquares.length
    );
    const [column, row] = targetableSquares[targetSquareIndex];
    firedPlayerShots.push({
      coordinate: [column, row],
      hit: targetPlayer.checkShot([column, row]),
    });
    this.state.firedShots.set(targetPlayer, firedPlayerShots);
  };
}
