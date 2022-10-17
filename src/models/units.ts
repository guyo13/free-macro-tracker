// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { isNonNegativeNumber, isPositiveNumber } from "../utils/utils";

export type UnitChart = { [key: string]: IUnit };

export enum UnitType {
  Mass = "mass",
  Volume = "volume",
  Arbitrary = "arbitrary",
}

export interface IUnit {
  name: string;
  description: string;
  type: UnitType;
  value_in_grams: number;
  value_in_ml: number;
}

export default class Unit implements IUnit {
  readonly name: string;
  readonly description: string;
  readonly type: UnitType;
  readonly value_in_grams: number;
  readonly value_in_ml: number;

  constructor(
    name: string,
    description: string,
    type: UnitType,
    value_in_grams: number,
    value_in_ml: number
  ) {
    Unit.validate(name, description, type, value_in_grams, value_in_ml);
    this.name = name;
    this.description = description;
    this.type = type;
    this.value_in_grams = value_in_grams;
    this.value_in_ml = value_in_ml;
  }

  static from(unit: IUnit): Unit {
    return this.fromObject(unit);
  }

  static fromObject(object: any): Unit {
    const { name, description, type, value_in_grams, value_in_ml } = object;
    return new Unit(name, description, type, value_in_grams, value_in_ml);
  }

  static validate(
    name: any,
    _description: any,
    type: any,
    value_in_grams: any,
    value_in_ml: any
  ) {
    const isMass = isPositiveNumber(value_in_grams);
    const isVolume = isPositiveNumber(value_in_ml);
    if (!name) {
      throw "Unit name must not be empty.";
    }
    if (!isNonNegativeNumber(value_in_grams)) {
      throw `Invalid value in grams. Got '${value_in_grams}'`;
    }
    if (!isNonNegativeNumber(value_in_ml)) {
      throw `Invalid value in ml. Got '${value_in_ml}'`;
    }
    switch (type) {
      case UnitType.Mass:
        if (!isMass)
          throw `Mass unit must have a positive value in grams. Got '${value_in_grams}'`;
        if (isVolume)
          throw `Mass unit must not be convertible to ml. Got '${value_in_ml}'`;
        break;
      case UnitType.Volume:
        if (!isPositiveNumber(value_in_ml))
          throw `Volume unit must have a positive value in ml. Got '${value_in_ml}'`;
        if (isMass)
          throw `Volume unit must not be convertible to grams. Got '${value_in_grams}'`;
        break;
      case UnitType.Arbitrary:
        // TODO - Relax this constraint?
        if (isMass && isVolume) {
          throw "Arbitrary unit can't represent both volume and mass.";
        }
        break;
      default:
        throw `Invalid unit type. Got '${type}'`;
    }
  }
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
  convertibleUnits?: IUnit[];
}

// TODO - Simplify logic
export function areUnitsConvertible(
  targetUnit: IUnit,
  originUnit: IUnit
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
  targetUnit: IUnit,
  originUnit: IUnit
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
  inputUnit: IUnit,
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

export function createUnitChart(units: IUnit[]): UnitChart {
  const unitsChart: UnitChart = {};
  for (const unit of units) {
    unitsChart[unit.name] = unit;
  }
  return unitsChart;
}
