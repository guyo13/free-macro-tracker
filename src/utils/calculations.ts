// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { convertUnitsByName, type UnitChart } from "../models/units";
import {
  BodyHeightUnits,
  BodyWeightUnits,
  UserGender,
} from "../models/userProfile";
import { isNumber } from "./utils";

const LBS_KG_RATIO = 2.2;
const INCH_CM_RATIO = 2.54;

export interface ConsumableRatioResult {
  error?: string;
  multiplier?: number;
  convertedValue?: number;
}

export function calculateConsumableRatio(
  referenceValue: any, //FIXME - change to number
  referenceUnitName: string,
  inputValue: any, //FIXME - change to number
  inputUnitName: string,
  unitsChart: UnitChart
): ConsumableRatioResult {
  const result = {};
  if (!unitsChart) {
    return { error: "Error - No Units loaded" };
  }

  if (!(inputUnitName in unitsChart)) {
    return { error: `Invalid or unknown units '${inputUnitName}'` };
  }
  if (!(referenceUnitName in unitsChart)) {
    return { error: `Invalid or unknown units '${referenceUnitName}'` };
  }
  // TODO - Remove after applying validation inside the ui component
  if (!isNumber(inputValue)) {
    return { error: `Invalid value to convert '${inputValue}'` };
  }
  if (!isNumber(referenceValue)) {
    return { error: `Invalid reference value '${referenceValue}'` };
  }

  // TODO - Remove redundant casts
  inputValue = Number(inputValue);
  referenceValue = Number(referenceValue);

  if (inputUnitName === referenceUnitName) {
    return {
      multiplier: inputValue / referenceValue,
      convertedValue: inputValue,
    };
  }
  const unitConvertRes = convertUnitsByName(
    referenceUnitName,
    inputUnitName,
    unitsChart
  );
  if (unitConvertRes.error) {
    return { error: unitConvertRes.error };
  }

  const convertedValue = inputValue * unitConvertRes.unitMultiplier;
  return {
    multiplier: convertedValue / referenceValue,
    convertedValue: convertedValue,
  };
}

export function convertBodyWeightToKg(
  bodyWeight: number,
  unit: BodyWeightUnits
) {
  switch (unit) {
    case BodyWeightUnits.Kg:
      return bodyWeight;
    case BodyWeightUnits.Lbs:
      return bodyWeight / LBS_KG_RATIO;
  }
}

export function convertHeightToCm(height: number, unit: BodyHeightUnits) {
  switch (unit) {
    case BodyHeightUnits.Cm:
      return height;
    case BodyHeightUnits.Inch:
      return height * INCH_CM_RATIO;
  }
}

export function mifflinStJeorMale(
  weightKg: number,
  heightCm: number,
  ageYears: number
): number {
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  return bmr;
}

export function mifflinStJeorFemale(
  weightKg: number,
  heightCm: number,
  ageYears: number
): number {
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  return bmr;
}

export function mifflinStJeor(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  sex: UserGender
): number {
  switch (sex) {
    case UserGender.Male:
      return mifflinStJeorMale(weightKg, heightCm, ageYears);
    case UserGender.Female:
      return mifflinStJeorFemale(weightKg, heightCm, ageYears);
    default:
      return -1;
  }
}

export function katchMcArdle(weightKg: number, bodyfatReal: number): number {
  if (bodyfatReal > 0 && bodyfatReal < 1) {
    let bmr = 370 + 21.6 * (1 - bodyfatReal) * weightKg;
    return bmr;
  } else {
    return -1;
  }
}
