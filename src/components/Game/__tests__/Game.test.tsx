import React from "react";
import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Game } from "../Game.client";

// integration components are not easily served by unit testing like this - it would likely be better to perform an E2E test on the app itself

it("should render", () => {
  expect(() => render(<Game />)).not.toThrowError();
});
