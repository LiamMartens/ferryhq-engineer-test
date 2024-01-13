import type { Meta, StoryObj } from "@storybook/react";
import { PlayerGridSquare } from "./PlayerGridSquare";
import { css } from "@panda/css";

const meta: Meta<typeof PlayerGridSquare> = {
  component: PlayerGridSquare,
};
export default meta;

type Story = StoryObj<typeof PlayerGridSquare>;

export const Default: Story = {
  args: {
    row: 0,
    column: 0,
    css: css.raw({
      width: "100px",
      height: "100px",
    }),
  },
};
