import { isPositiveNumber } from "../utils/utils";
import type { INutritionalValue } from "./nutrient";
import type IDBRecord from "./record";

export enum ConsumableType {
  // TODO - Add compatibility with previous "Food/Recipe Item" enum values
  Food = 1,
  Recipe = 2,
}

export function validateConsumable(
  name: any,
  _brand: any,
  referenceServing: any,
  units: any,
  nutritionalValue: any
) {
  if (!name) {
    throw "Name must not be empty.";
  }
  if (!isPositiveNumber(referenceServing)) {
    throw `Reference serving must be positive number. Got '${referenceServing}'`;
  }
  if (!units) {
    throw "Units must be specified.";
  }
  if (!nutritionalValue) {
    throw "Nutritional value must not be empty.";
  }
  // TODO - Validate nutritional value!
}

export default interface IConsumable extends IDBRecord {
  name: string;
  brand: string;
  type: ConsumableType;
  referenceServing: number;
  units: string;
  nutritionalValue: INutritionalValue;
}
