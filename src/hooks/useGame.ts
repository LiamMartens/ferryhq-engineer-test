import { GamePlayer, GameState } from "@/game";
import { PlayerState } from "@/game/GamePlayer";
import { GameEvents, PlayState } from "@/game/IGameState";
import { useCallback, useEffect, useRef, useState } from "react";

export const GRID_SIZE: [number, number] = [10, 10];
export const SHIPS = [5, 4, 3, 2];

export function useGame(players: GamePlayer[]) {
  const gameRef = useRef(
    new GameState({
      gridSize: GRID_SIZE,
      ships: SHIPS,
    })
  );
  const [playState, setPlayState] = useState<PlayState>(
    gameRef.current.playState
  );
  const [gamePlayerStates, setGamePlayerStates] = useState<PlayerState[]>([]);

  const run = useCallback(() => {
    gameRef.current.reset();
    for (const player of players) {
      gameRef.current.addPlayer(player);
    }

    return new Promise<void>(async (resolve) => {
      const generator = gameRef.current.run();
      while (true) {
        const result = await generator.next();
        if (result.done) {
          resolve();
          break;
        }
      }
    });
  }, [players]);

  useEffect(() => {
    // reset the game if players change
    gameRef.current.reset();
    for (const player of players) {
      gameRef.current.addPlayer(player);
    }
  }, [players]);

  useEffect(() => {
    const game = gameRef.current;

    const updatePlayerStates = () => {
      setGamePlayerStates(game.players.map((player) => player.state));
    };

    const playStateChangedHandler = (event: GameEvents["playstatechanged"]) => {
      setPlayState(event.playState);
      updatePlayerStates();
    };

    game.$e.on("playstatechanged", playStateChangedHandler);
    game.$e.on("started", updatePlayerStates);
    game.$e.on("ended", updatePlayerStates);
    game.$e.on("playerready", updatePlayerStates);
    game.$e.on("roundplayed", updatePlayerStates);
    game.$e.on("playerschanged", updatePlayerStates);

    return () => {
      game.$e.off("playstatechanged", playStateChangedHandler);
      game.$e.off("started", updatePlayerStates);
      game.$e.off("ended", updatePlayerStates);
      game.$e.off("playerready", updatePlayerStates);
      game.$e.off("roundplayed", updatePlayerStates);
      game.$e.off("playerschanged", updatePlayerStates);
    };
  }, []);

  return {
    ref: gameRef,
    run,
    playState,
    playerStates: gamePlayerStates,
  };
}
