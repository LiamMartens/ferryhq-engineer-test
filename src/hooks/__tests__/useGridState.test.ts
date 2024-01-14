import { renderHook } from "@testing-library/react-hooks";
import { it, expect } from "vitest";
import { useGridState } from "../useGridState";
import { AutoGamePlayer } from "@/game";
import mitt from "mitt";
import { GameEvents } from "@/game/IGameState";
import { ShipOrientation } from "@/constants";

it("should highlight when selecting a shot to fire", () => {
  const autoPlayer1 = new AutoGamePlayer();
  const autoPlayer2 = new AutoGamePlayer();

  const { result } = renderHook(() =>
    useGridState({
      activeCell: [0, 0],
      player: autoPlayer1,
      gameState: {
        $e: mitt<GameEvents>(),
        players: [autoPlayer1, autoPlayer2],
        config: { gridSize: [10, 10], ships: [4] },
      },
      displayOptions: { showShips: true },
      placingShipState: null,
      playingRoundState: {
        resolve: () => {},
      },
    })
  );
  expect(result.current).toEqual([
    { coordinates: [0, 0], state: "highlighted" },
  ]);
});

it("should display ships", () => {
  const autoPlayer1 = new AutoGamePlayer();
  const autoPlayer2 = new AutoGamePlayer();

  autoPlayer1.state.ships.push({
    coordinates: [
      [0, 0],
      [1, 0],
    ],
    sunkCoordinates: [],
  });

  const { result } = renderHook(() =>
    useGridState({
      activeCell: [0, 0],
      player: autoPlayer1,
      gameState: {
        $e: mitt<GameEvents>(),
        players: [autoPlayer1, autoPlayer2],
        config: { gridSize: [10, 10], ships: [4] },
      },
      displayOptions: { showShips: true },
      placingShipState: null,
      playingRoundState: null,
    })
  );
  expect(result.current).toEqual([
    { coordinates: [0, 0], state: "occupied" },
    { coordinates: [1, 0], state: "occupied" },
  ]);
});

it("should highlight when selecting ship placement", () => {
  const autoPlayer1 = new AutoGamePlayer();
  const autoPlayer2 = new AutoGamePlayer();

  const { result } = renderHook(() =>
    useGridState({
      activeCell: [0, 0],
      player: autoPlayer1,
      gameState: {
        $e: mitt<GameEvents>(),
        players: [autoPlayer1, autoPlayer2],
        config: { gridSize: [10, 10], ships: [4] },
      },
      displayOptions: { showShips: true },
      placingShipState: {
        orientation: ShipOrientation.DEG0,
        resolve: () => {},
        shipSize: 2,
      },
      playingRoundState: null,
    })
  );
  expect(result.current).toEqual([
    { coordinates: [0, 0], state: "highlighted" },
    { coordinates: [1, 0], state: "highlighted" },
  ]);
});

it("should display fired shots of other players", () => {
  const autoPlayer1 = new AutoGamePlayer();
  const autoPlayer2 = new AutoGamePlayer();
  autoPlayer2.state.firedShots.set(autoPlayer1, [
    {
      coordinate: [0, 0],
      hit: false,
    },
  ]);

  const { result } = renderHook(() =>
    useGridState({
      activeCell: [0, 0],
      player: autoPlayer1,
      gameState: {
        $e: mitt<GameEvents>(),
        players: [autoPlayer1, autoPlayer2],
        config: { gridSize: [10, 10], ships: [4] },
      },
      displayOptions: { showShips: true },
      placingShipState: null,
      playingRoundState: null,
    })
  );
  expect(result.current).toEqual([
    {
      coordinates: [0, 0],
      state: "miss",
    },
  ]);
});
