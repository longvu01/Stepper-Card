export enum Unit {
  PIXEL = "px",
  PERCENT = "%",
}

export type UnitType = (typeof Unit)[keyof typeof Unit];
