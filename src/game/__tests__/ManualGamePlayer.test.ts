import { it, expect } from "vitest";
import { ManualGamePlayer } from "../ManualGamePlayer";
import { AutoGamePlayer } from "../GamePlayer";
import mitt from "mitt";
import { GameEvents } from "../IGameState";

it("should work", async () => {
  const gridSize: [number, number] = [10, 10];
  const ships = [2, 3];

  const autoPlayer = new AutoGamePlayer();
  const player = new ManualGamePlayer({
    async placeShip(player, gameState, shipSize) {
      if (shipSize === 2) {
        return [
          [0, 0],
          [1, 0],
        ];
      }

      return [
        [0, 1],
        [1, 1],
        [2, 1],
      ];
    },
    async playRound(player, gameState) {
      return { target: autoPlayer, coordinate: [0, 0] };
    },
  });

  const $e = mitt<GameEvents>();
  await player.placeShips({
    $e,
    config: {
      gridSize,
      ships,
    },
    players: [player, autoPlayer],
  });

  expect(player.state.ships).toEqual([
    {
      coordinates: [
        [0, 0],
        [1, 0],
      ],
      sunkCoordinates: [],
    },
    {
      coordinates: [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      sunkCoordinates: [],
    },
  ]);

  await player.playRound({
    $e,
    config: {
      gridSize,
      ships,
    },
    players: [player, autoPlayer],
  });
  expect(player.state.firedShots.get(autoPlayer)).toEqual([
    { coordinate: [0, 0], hit: false },
  ]);
});
