import { css } from "@panda/css";
import { WithCss } from "@panda/types";
import React, { ButtonHTMLAttributes } from "react";

type Props = WithCss &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {};

export function PrimaryButton({
  css: cssOverride,
  children,
  ...buttonProps
}: Props) {
  return (
    <button
      className={css(
        {
          p: "2",
          rounded: "4",
          color: "white",
          background: "blue.500",
          cursor: "pointer",
        },
        cssOverride
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
