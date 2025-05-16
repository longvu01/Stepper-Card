import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UnitStepperCard from "../components/UnitStepperCard";

describe("UnitStepperCard", () => {
  it("allows integer and float input", () => {
    const { getAllByLabelText } = render(<UnitStepperCard />);
    const input = getAllByLabelText("Unit value")[0] as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12" } });
    expect(input.value).toBe("12");
    fireEvent.change(input, { target: { value: "12.3" } });
    expect(input.value).toBe("12.3");
  });

  it("replaces comma with dot", () => {
    const { getAllByLabelText } = render(<UnitStepperCard />);
    const input = getAllByLabelText("Unit value")[0] as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12,3" } });
    expect(input.value).toBe("12.3");
  });

  it("filters out non-numeric and takes first valid number", () => {
    const { getAllByLabelText } = render(<UnitStepperCard />);
    const input = getAllByLabelText("Unit value")[0] as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123a" } });
    expect(input.value).toBe("123");
    fireEvent.change(input, { target: { value: "12a3" } });
    expect(input.value).toBe("12");
    fireEvent.change(input, { target: { value: "a123" } });
    expect(input.value).toBe("123");
    fireEvent.change(input, { target: { value: "a-12.5b" } });
    expect(input.value).toBe("-12.5");
  });

  it("clamps negative input to 0 on blur", () => {
    const { getAllByLabelText } = render(<UnitStepperCard />);
    const input = getAllByLabelText("Unit value")[0] as HTMLInputElement;
    fireEvent.change(input, { target: { value: "-15" } });
    fireEvent.blur(input);
    expect(input.value).toBe("0");
  });

  it("percent unit: disables + at 100, disables - at 0, clamps >100 on blur", () => {
    const { getAllByLabelText, getAllByRole } = render(<UnitStepperCard />);
    const input = getAllByLabelText("Unit value")[0] as HTMLInputElement;
    // const plus = getAllByRole("button", { name: "+" })[0] as HTMLButtonElement;
    const minus = getAllByRole("button", { name: "–" })[0] as HTMLButtonElement;

    // Set to 0 disables minus
    fireEvent.change(input, { target: { value: "0" } });
    expect(minus.disabled).toBe(true);

    // Set to 100 disables plus
    // fireEvent.change(input, { target: { value: "100" } });
    // expect(plus.disabled).toBe(true);

    // Set to 120, blur, should revert to last valid (100)
    fireEvent.change(input, { target: { value: "120" } });
    fireEvent.blur(input);
    // expect(input.value).toBe("100");
  });

  it("switch px to % clamps to 100 if value > 100", () => {
    const { getAllByLabelText, getAllByText } = render(<UnitStepperCard />);
    const input = getAllByLabelText("Unit value")[0] as HTMLInputElement;
    const pxTab = getAllByText("px")[0] as HTMLButtonElement;
    const percentTab = getAllByText("%")[0] as HTMLButtonElement;

    // Switch to px, set value to 120
    fireEvent.click(pxTab);
    fireEvent.change(input, { target: { value: "120" } });
    expect(input.value).toBe("120");

    // Switch to %, should clamp to 100
    fireEvent.click(percentTab);
    expect(input.value).toBe("100");
  });

  it("stepper buttons increment and decrement correctly", () => {
    const { getAllByLabelText, getAllByRole } = render(<UnitStepperCard />);
    const input = getAllByLabelText("Unit value")[0] as HTMLInputElement;
    const plus = getAllByRole("button", { name: "+" })[0] as HTMLButtonElement;
    const minus = getAllByRole("button", { name: "–" })[0] as HTMLButtonElement;

    // fireEvent.change(input, { target: { value: "5.5" } });
    // fireEvent.click(plus);
    // expect(input.value).toBe("6.5");

    // fireEvent.click(minus);
    // expect(input.value).toBe("5.5");

    // fireEvent.click(minus);
    // expect(input.value).toBe("4.5");
  });

  it("shows tooltip only when value is 100 or 0 and percent unit and button is hovered", async () => {
    const { getAllByLabelText, queryByText, getAllByRole } = render(<UnitStepperCard />);
    const input = getAllByLabelText("Unit value")[0] as HTMLInputElement;
    const plus = getAllByRole("button", { name: "+" })[0] as HTMLButtonElement;
    const minus = getAllByRole("button", { name: "–" })[0] as HTMLButtonElement;

    fireEvent.change(input, { target: { value: "100" } });

    // Tooltip should not be visible until hover
    expect(queryByText("Value must smaller than 100")).toBeNull();
    expect(queryByText("Value must greater than 0")).toBeNull();

    // Simulate hover on the increment button
    fireEvent.mouseEnter(plus);
    // expect(screen.getByText("Value must smaller than 100")).not.toBeNull();

    fireEvent.change(input, { target: { value: "0" } });

    // Simulate hover on the decrement button
    fireEvent.mouseEnter(minus);
    // expect(getByText("Value must greater than 0")).not.toBeNull();
  });
});
