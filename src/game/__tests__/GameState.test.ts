import { vi, it, expect } from "vitest";
import { GameState } from "../GameState";
import { AutoGamePlayer } from "../GamePlayer";
import { afterEach, beforeEach } from "node:test";

afterEach(() => {
  vi.useRealTimers();
});

it("should emit the right events", async () => {
  vi.useFakeTimers();

  const playersChanged = vi.fn();
  const gameStarted = vi.fn();
  const playerReady = vi.fn();
  const roundPlayed = vi.fn();
  const gameEnded = vi.fn();

  const gameState = new GameState({
    gridSize: [5, 5],
    ships: [4, 3],
  });
  gameState.$e.on("playerschanged", playersChanged);
  gameState.$e.on("started", gameStarted);
  gameState.$e.on("playerready", playerReady);
  gameState.$e.on("roundplayed", roundPlayed);
  gameState.$e.on("ended", gameEnded);

  const autoplayer1 = new AutoGamePlayer();
  const autoplayer2 = new AutoGamePlayer();
  gameState.addPlayer(autoplayer1);
  gameState.addPlayer(autoplayer2);
  vi.runAllTicks();
  expect(playersChanged).toBeCalledTimes(2);

  const runPromise = gameState.run();
  await runPromise.next();
  expect(gameStarted).toBeCalledTimes(1);

  await runPromise.next();
  await runPromise.next();
  expect(playerReady).toBeCalledTimes(2);

  while (true) {
    const result = await runPromise.next();
    if (result.done) break;
  }

  // expect(roundPlayed).toBeCalled();
  // expect(gameEnded).toBeCalledTimes(1);
});
