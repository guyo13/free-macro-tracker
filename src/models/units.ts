export enum UnitType {
  Mass = "mass",
  Volume = "volume",
  Arbitrary = "arbitrary",
}

export type UnitChart = { [key: string]: Unit };

export interface Unit {
  readonly name: string;
  readonly description: string;
  readonly type: UnitType;
  readonly value_in_grams: number; // TODO - change to camel case and migrate db
  readonly value_in_ml: number;
}

export interface UnitsConvertibleResult {
  isConvertible?: boolean;
  type?: UnitType;
}

export interface UnitsConvertionResult extends UnitsConvertibleResult {
  error?: string;
  unitMultiplier?: number;
}

export interface ConvertibleUnitsResult {
  error?: string;
  convertibleUnits?: Unit[];
}

// TODO - Simplify logic
export function areUnitsConvertible(
  targetUnit: Unit,
  originUnit: Unit
): UnitsConvertibleResult {
  const {
    type: targetType,
    value_in_grams: targetInGr,
    value_in_ml: targetInMl,
  } = targetUnit;
  const {
    type: originType,
    value_in_grams: originInGr,
    value_in_ml: originInMl,
  } = originUnit;

  if (targetType !== UnitType.Arbitrary && targetType === originType) {
    return { isConvertible: true, type: targetType };
  } else if (
    targetType === UnitType.Arbitrary &&
    originType === UnitType.Mass
  ) {
    return { isConvertible: targetInGr > 0, type: UnitType.Mass };
  } else if (
    targetType === UnitType.Mass &&
    originType === UnitType.Arbitrary
  ) {
    return { isConvertible: originInGr > 0, type: UnitType.Mass };
  } else if (
    targetType === UnitType.Arbitrary &&
    originType === UnitType.Volume
  ) {
    return { isConvertible: targetInMl > 0, type: UnitType.Volume };
  } else if (
    targetType === UnitType.Volume &&
    originType === UnitType.Arbitrary
  ) {
    return { isConvertible: originInMl > 0, type: UnitType.Volume };
  } else if (
    targetType === UnitType.Arbitrary &&
    originType === UnitType.Arbitrary
  ) {
    if (targetInMl > 0 && originInMl > 0) {
      return { isConvertible: true, type: UnitType.Volume };
    } else if (targetInGr > 0 && originInGr > 0) {
      return { isConvertible: true, type: UnitType.Mass };
    }
  }
  return { isConvertible: false, type: null };
}

/// Returns the ratio between `originUnit` and `targetUnit` real values.
export function convertUnits(
  targetUnit: Unit,
  originUnit: Unit
): UnitsConvertionResult {
  const { isConvertible, type: convertionType } = areUnitsConvertible(
    targetUnit,
    originUnit
  );
  if (!isConvertible) {
    return {
      error: `Unit ${originUnit.description} is incompatible with ${targetUnit.description}`,
    };
  }

  let unitMultiplier: number;
  switch (convertionType) {
    case "mass":
      unitMultiplier = originUnit.value_in_grams / targetUnit.value_in_grams;
      break;
    case "volume":
      unitMultiplier = originUnit.value_in_ml / targetUnit.value_in_ml;
      break;
  }
  return { isConvertible, type: convertionType, unitMultiplier };
}

export function convertUnitsByName(
  targetUnitName: string,
  originUnitName: string,
  unitsChart: UnitChart
): UnitsConvertionResult {
  if (!unitsChart) {
    return { error: "Error - No Units loaded" };
  }
  const targetUnit = unitsChart[targetUnitName];
  const originUnit = unitsChart[originUnitName];
  if (!targetUnit || !originUnit) {
    return {
      error: `Error - Unkown units '${originUnitName}' '${targetUnitName}'`,
    };
  }
  return convertUnits(targetUnit, originUnit);
}

export function findConvertibleUnits(
  inputUnit: Unit,
  unitsChart: UnitChart
): ConvertibleUnitsResult {
  const convertibleUnits = Object.values(unitsChart).filter(
    (targetUnit) => areUnitsConvertible(inputUnit, targetUnit).isConvertible
  );
  return { convertibleUnits };
}

export function findConvertibleUnitsByName(
  unitName: string,
  unitsChart: UnitChart
): ConvertibleUnitsResult {
  const unit = unitsChart[unitName];
  if (!unit) {
    return { error: `Unit '${unitName}' not in unitsChart` };
  }
  return findConvertibleUnits(unit, unitsChart);
}
