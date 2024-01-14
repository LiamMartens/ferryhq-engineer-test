/* v8 ignore start */
/* this file can be ignored since it does not contain any logic */
import type { Emitter } from "mitt";
import type { GamePlayer } from "./GamePlayer";

export enum PlayStateType {
  IDLE = "idle",
  STARTED = "started",
  PLAYER_SHIP_PLACEMENT = "player_ship_placement",
  PLAYER_ROUND = "player_round",
  ENDED = "ended",
}

export type PlayState =
  | { type: PlayStateType.IDLE }
  | { type: PlayStateType.STARTED }
  | {
      type: PlayStateType.PLAYER_SHIP_PLACEMENT;
      player: GamePlayer;
    }
  | {
      type: PlayStateType.PLAYER_ROUND;
      player: GamePlayer;
    }
  | { type: PlayStateType.ENDED; winner: GamePlayer };

export type GameEvents = {
  playstatechanged: {
    game: IGameState;
    playState: PlayState;
    previousPlayState: PlayState;
  };
  playerschanged: {
    game: IGameState;
    players: GamePlayer[];
  };
  started: {
    game: IGameState;
  };
  playerready: {
    player: GamePlayer;
    game: IGameState;
  };
  roundplayed: {
    player: GamePlayer;
    game: IGameState;
  };
  ended: {
    winner: GamePlayer;
    game: IGameState;
  };
};

export type GameConfig = {
  ships: number[];
  gridSize: [number, number];
};

export interface IGameState {
  $e: Emitter<GameEvents>;
  players: GamePlayer[];
  config: GameConfig;
}
