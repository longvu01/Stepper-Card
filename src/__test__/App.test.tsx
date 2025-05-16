import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "../App";

it("renders UnitStepperCard", () => {
  const { getByText, getByLabelText } = render(<App />);
  // Check for the Unit label
  expect(getByText("Unit")).not.toBeNull();
  // Check for the Value label
  expect(getByText("Value")).not.toBeNull();
  // Check for the input
  expect(getByLabelText("Unit value")).not.toBeNull();
});
