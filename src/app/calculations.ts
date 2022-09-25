import { convertUnitsByName, type UnitChart } from "./units";
import { isNumber } from "../utils/utils";

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
