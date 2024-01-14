import { it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import { useGame } from "../useGame";
import { AutoGamePlayer } from "@/game";
import { PlayStateType } from "@/game/IGameState";

it("should work", async () => {
  const player1 = new AutoGamePlayer();
  const player2 = new AutoGamePlayer();
  const players = [player1, player2];
  const { result } = renderHook(() => useGame(players));
  expect(result.current.playState).toEqual({ type: PlayStateType.IDLE });

  await act(async () => {
    await result.current.run();
  });

  expect(result.current.playState.type).toEqual(PlayStateType.ENDED);
});
