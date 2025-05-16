import { useRef, useState } from "react";
import { STEPPER_UNITS_TABS } from "./constants";
import { parseInput, parseUpToInvalid } from "./helpers";
import { Unit, UnitType } from "./types";
import UnitStepperButton from "./UnitStepperButton";
import UnitStepperTitle from "./UnitStepperTitle";

const UnitStepperCard = () => {
  const [unit, setUnit] = useState<UnitType>(Unit.PERCENT);
  const [inputValue, setInputValue] = useState<string>("1.0");
  const [lastValidValue, setLastValidValue] = useState<number>(1.0);
  const [isInputHovered, setIsInputHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const value = parseInput(inputValue);
  const isPercentUnit = unit === Unit.PERCENT;
  const activeIdx = STEPPER_UNITS_TABS.findIndex((tab) => tab.value === unit);
  const isHoveringInputOnly = isInputHovered && !isFocused;

  const isDisabledDecrement = value <= 0;
  const isDisabledIncrement = isPercentUnit && value >= 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      // Allow empty while editing
      setInputValue("");
      return;
    }
    const sanitized = parseUpToInvalid(raw);
    setInputValue(sanitized);
    const num = parseFloat(sanitized);
    // Only update last valid value if in range and not empty
    if (!isNaN(num) && num >= 0 && (!isPercentUnit || num <= 100)) {
      setLastValidValue(num);
    }
  };

  // On blur: clamp to 0, or revert if % and > 100
  const handleInputBlur = () => {
    setIsFocused(false);
    let num = parseInput(inputValue);
    if (num < 0) num = 0;
    if (isPercentUnit && num > 100) {
      setInputValue(lastValidValue.toString());
      return;
    }
    setInputValue(num.toString());
    setLastValidValue(num);
  };

  // On unit switch: if switching to % and value > 100, set to 100
  const handleUnitSwitch = (newUnit: UnitType) => {
    if (newUnit === Unit.PERCENT && value > 100) {
      setInputValue("100");
      setLastValidValue(100);
    }
    setUnit(newUnit);
  };

  const updateValue = (newValue: number) => {
    // Round to 6 decimal places to avoid floating point precision issues
    const rounded = parseFloat(newValue.toFixed(6));
    setInputValue(rounded.toString());
    setLastValidValue(rounded);
    inputRef.current?.focus();
  };

  const handleDecrement = () => {
    let num = value - 1;
    if (num < 0) num = 0;
    updateValue(num);
  };

  const handleIncrement = () => {
    if (isPercentUnit && value >= 100) return; // Do nothing if already at or above 100 in percent mode
    let num = value + 1;
    if (isPercentUnit && num > 100) num = 100;
    updateValue(num);
  };

  return (
    <div className="bg-neutral-900 w-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <UnitStepperTitle label="Unit" />
        <div className="relative flex bg-neutral-800 rounded-lg w-full h-9 items-center p-0.5 gap-0.5">
          <span
            className="absolute top-0.5 left-0.5 h-8 w-[calc((100%-6px)/2)] rounded-lg bg-neutral-700 z-0 transition-all duration-300 ease-in-out"
            style={{
              left: `calc(${activeIdx * 50}% + 1.5px)`,
              opacity: 1,
            }}
            aria-hidden
          />
          {STEPPER_UNITS_TABS.map((tab) => (
            <button
              key={tab.value}
              aria-label={tab.label === "%" ? "Percent unit" : "Pixel unit"}
              className={`relative flex-1 h-8 rounded-lg text-xs font-medium transition-colors duration-300 outline-none z-10
                  ${unit === tab.value ? "text-white" : "text-neutral-400 hover:bg-neutral-700"}
                `}
              onClick={() => handleUnitSwitch(tab.value)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <UnitStepperTitle label="Value" />
        <div
          className={`flex items-center bg-neutral-800 rounded-lg w-full h-9 transition-all
            ${isFocused ? "outline-1 outline-blue-500" : "outline-none"}
          `}>
          <UnitStepperButton
            content="–"
            className={`rounded-l-lg  ${isHoveringInputOnly ? "bg-neutral-700" : ""}`}
            disabled={isDisabledDecrement}
            tooltipContent={isDisabledDecrement ? "Value must be greater than 0" : ""}
            onMouseDown={handleDecrement}
          />
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            aria-label="Unit value"
            className={`flex-1 w-full text-center text-xs h-full text-white outline-none border-none select-text appearance-none p-0 ${
              isHoveringInputOnly ? "bg-neutral-700" : ""
            }`}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={() => setIsFocused(true)}
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
          />
          <UnitStepperButton
            content="+"
            className={`rounded-r-lg ${isHoveringInputOnly ? "bg-neutral-700" : ""}`}
            disabled={isDisabledIncrement}
            tooltipContent={isDisabledIncrement ? "Value must smaller than 100" : ""}
            onMouseDown={handleIncrement}
          />
        </div>
      </div>
    </div>
  );
};

export default UnitStepperCard;
