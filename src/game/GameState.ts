import mitt from "mitt";
import { GamePlayer } from "./GamePlayer";
import {
  GameConfig,
  GameEvents,
  IGameState,
  PlayState,
  PlayStateType,
} from "./IGameState";

export class GameState implements IGameState {
  public $e = mitt<GameEvents>();
  public playState: PlayState = {
    type: PlayStateType.IDLE,
  };
  public players: GamePlayer[] = [];

  private currentAbortController = new AbortController();

  constructor(public config: GameConfig) {
    this.run = this.run.bind(this);
  }

  protected updatePlayState = (playState: PlayState) => {
    const previous = { ...this.playState };
    this.playState = playState;
    this.$e.emit("playstatechanged", {
      game: this,
      playState: { ...playState },
      previousPlayState: previous,
    });
  };

  public reset = () => {
    this.currentAbortController.abort();
    for (const player of this.players) {
      player.reset();
    }
    this.players.splice(0, this.players.length);
    this.$e.emit("playerschanged", { game: this, players: [...this.players] });
    this.updatePlayState({ type: PlayStateType.IDLE });
  };

  public addPlayer = (player: GamePlayer) => {
    this.players.push(player);
    this.$e.emit("playerschanged", { game: this, players: [...this.players] });
  };

  public run = async function* (this: GameState) {
    const abrtController = new AbortController();
    this.currentAbortController = abrtController;

    if (this.players.length < 2) {
      throw new Error("Unable to start game with less than 2 players");
    }

    if (abrtController.signal.aborted) return;
    this.$e.emit("started", { game: this });
    this.updatePlayState({ type: PlayStateType.STARTED });
    yield;

    for (const player of this.players) {
      if (abrtController.signal.aborted) return;
      this.updatePlayState({
        type: PlayStateType.PLAYER_SHIP_PLACEMENT,
        player,
      });
      await player.placeShips(this);
      this.$e.emit("playerready", { player, game: this });
      yield;
    }

    // run until one player is left
    while (this.players.filter((player) => !player.hasLost).length > 1) {
      for (const player of this.players) {
        if (abrtController.signal.aborted) return;
        this.updatePlayState({
          type: PlayStateType.PLAYER_ROUND,
          player,
        });
        await player.playRound(this);
        this.$e.emit("roundplayed", { player, game: this });
        yield;
      }
    }

    if (abrtController.signal.aborted) return;
    const winner = this.players.find((player) => !player.hasLost)!;
    this.updatePlayState({
      type: PlayStateType.ENDED,
      winner,
    });
    this.$e.emit("ended", {
      game: this,
      winner,
    });
    yield;
  };
}
