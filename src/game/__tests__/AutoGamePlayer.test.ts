import mitt from "mitt";
import { it, expect, vi, afterEach } from "vitest";
import { AutoGamePlayer } from "../GamePlayer";
import { GameEvents, IGameState } from "../IGameState";

const originalRandomImpl = Math.random;

afterEach(() => {
  Math.random = originalRandomImpl;
});

it("should place ships without overlapping", async () => {
  const gridSize: [number, number] = [10, 10];
  const ships = [2, 4];

  const mockRandom = vi
    .fn()
    // first ship orientation
    .mockImplementationOnce(() => 0)
    // first ship column
    .mockImplementationOnce(() => 0 / gridSize[0])
    // first ship row
    .mockImplementationOnce(() => 1 / gridSize[1])

    // this should cause an overlap -> so should not be used
    // 2nd ship orientation
    .mockImplementationOnce(() => 1 / 4)
    // 2nd ship column
    .mockImplementationOnce(() => 1 / gridSize[0])
    // 2nd ship row
    .mockImplementationOnce(() => 1 / gridSize[1])

    // retry - no overlap
    // 2nd ship orientation
    .mockImplementationOnce(() => 1 / 4)
    // 2nd ship column
    .mockImplementationOnce(() => 5 / gridSize[0])
    // 2nd ship row
    .mockImplementationOnce(() => 1 / gridSize[1]);
  Math.random = mockRandom;

  const autoPlayer = new AutoGamePlayer();
  await autoPlayer.placeShips({
    $e: mitt<GameEvents>(),
    config: {
      gridSize,
      ships,
    },
    players: [autoPlayer],
  });
  expect(autoPlayer.state.ships).toEqual([
    {
      coordinates: [
        [0, 1],
        [1, 1],
      ],
      sunkCoordinates: [],
    },
    {
      coordinates: [
        [5, 1],
        [5, 2],
        [5, 3],
        [5, 4],
      ],
      sunkCoordinates: [],
    },
  ]);
});

it("should be able to play a round", async () => {
  const gridSize: [number, number] = [10, 10];

  const autoPlayer1 = new AutoGamePlayer();
  const autoPlayer2 = new AutoGamePlayer();

  const mockRandom = vi
    .fn()
    // target player selection -> always player 2 in this case since there are only 2
    .mockImplementationOnce(() => 0)
    // column + row (first round)
    .mockImplementationOnce(() => 0)

    // target player selection -> always player 2 in this case since there are only 2
    .mockImplementationOnce(() => 0)
    // column + row (2nd round)
    .mockImplementationOnce(() => 0);
  Math.random = mockRandom;

  const gameState: IGameState = {
    $e: mitt<GameEvents>(),
    config: {
      gridSize,
      ships: [4],
    },
    players: [autoPlayer1, autoPlayer2],
  };

  await autoPlayer1.playRound(gameState);
  await autoPlayer1.playRound(gameState);

  expect(autoPlayer1.state.firedShots.get(autoPlayer2)).toEqual([
    { coordinate: [0, 0], hit: false },
    { coordinate: [1, 0], hit: false },
  ]);
});
