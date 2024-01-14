import { Game } from "@/components";
import { css } from "@panda/css";

export default function Home() {
  return (
    <div
      className={css({
        height: "full",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "4",
      })}
    >
      <Game />
    </div>
  );
}
