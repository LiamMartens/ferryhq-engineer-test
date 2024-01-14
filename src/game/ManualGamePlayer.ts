import { GridCoordinate } from "@/types";
import { GamePlayer } from "./GamePlayer";
import { IGameState } from "./IGameState";

type ManualGamePlayerConfig = {
  placeShip: (
    player: GamePlayer,
    gameState: IGameState,
    shipSize: number
  ) => Promise<GridCoordinate[]>;
  playRound: (
    player: GamePlayer,
    gameState: IGameState
  ) => Promise<{
    target: GamePlayer;
    coordinate: GridCoordinate;
  }>;
};

export class ManualGamePlayer extends GamePlayer {
  constructor(private config: ManualGamePlayerConfig) {
    super();
  }

  placeShips = async (gameState: IGameState) => {
    for (const shipSize of gameState.config.ships) {
      const shipCoords = await this.config.placeShip(this, gameState, shipSize);
      this.state.ships.push({
        coordinates: shipCoords,
        sunkCoordinates: [],
      });
    }
  };

  playRound = async (gameState: IGameState) => {
    const { target, coordinate } = await this.config.playRound(this, gameState);
    const firedShots = this.state.firedShots.get(target) ?? [];
    firedShots.push({
      coordinate,
      hit: target.checkShot(coordinate),
    });
    this.state.firedShots.set(target, firedShots);
  };
}
