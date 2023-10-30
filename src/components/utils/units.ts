import type { IUnit } from "../../models/units";

export function makeUnitOptions(units?: IUnit[]) {
  return (
    units?.map((unit) => ({
      name: unit.description,
      value: unit.name,
    })) ?? []
  );
}
