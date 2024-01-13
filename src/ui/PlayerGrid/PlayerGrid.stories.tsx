import type { Meta, StoryObj } from "@storybook/react";
import { PlayerGrid } from "./PlayerGrid";
import { css } from "@panda/css";
import { PlayerGridSquareState } from "../PlayerGridSquare";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import { calculateShipCoordinates } from "@/utils/calculateShipCoordinates";
import { ShipOrientation } from "@/constants";

const meta: Meta<typeof PlayerGrid> = {
  component: PlayerGrid,
};
export default meta;

type Story = StoryObj<typeof PlayerGrid>;

export const Default: Story = {
  args: {
    gridState: [{ coordinates: [1, 2], state: PlayerGridSquareState.OCCUPIED }],
    size: [10, 10],
    css: css.raw({
      width: "65vmin",
      height: "65vmin",
    }),
  },
};

const PlaceShipExampleRenderComponent = (
  args: ComponentProps<typeof PlayerGrid>
) => {
  const orientationValues = Object.values(ShipOrientation);
  const [hovering, setHovering] = useState<[number, number] | null>(null);
  const [orientation, setOrientation] = useState(0);
  const shipCoordinates = hovering
    ? calculateShipCoordinates(
        hovering,
        4,
        orientationValues[orientation],
        args.size
      )
    : null;

  const handlePointerEnter = useCallback((coords: [number, number]) => {
    setHovering(coords);
  }, []);

  const handlePointerLeave = useCallback((coords: [number, number]) => {
    setHovering(null);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handler = (event: KeyboardEvent) => {
        if (event.code === "KeyR") {
          setOrientation((orientation + 1) % orientationValues.length);
        }
      };
      window.addEventListener("keypress", handler);
      return () => {
        window.removeEventListener("keypress", handler);
      };
    }
  }, [orientation]);

  return (
    <div>
      <PlayerGrid
        {...args}
        gridState={(coordinates) => {
          const [row, col] = coordinates;
          if (shipCoordinates) {
            const shouldHighlight = shipCoordinates.some(
              (coords) => coords[0] === row && coords[1] === col
            );
            if (shouldHighlight) {
              return {
                coordinates,
                state: PlayerGridSquareState.HIGHLIGHTED,
              };
            }
          }
          return null;
        }}
        onCellPointerEnter={handlePointerEnter}
        onCellPointerLeave={handlePointerLeave}
      />
      <p className={css({ color: "white", mt: "3", fontSize: "sm" })}>
        Tip: press R to change rotation
      </p>
    </div>
  );
};

export const PlaceShipExample: Story = {
  args: {
    size: [10, 10],
    css: css.raw({
      width: "65vmin",
      height: "65vmin",
    }),
  },
  render: PlaceShipExampleRenderComponent,
};
