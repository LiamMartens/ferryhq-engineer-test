import { GridCoordinate } from "@/types";
import { useCallback, useState } from "react";

export function useCellPointerHover() {
  const [hovering, setHovering] = useState<null | GridCoordinate>(null);

  const handleCellPointerEnter = useCallback((coord: GridCoordinate) => {
    setHovering(coord);
  }, []);

  const handleCellPointerLeave = useCallback(() => {
    setHovering(null);
  }, []);

  return {
    hovering,
    handleCellPointerEnter,
    handleCellPointerLeave,
  };
}
