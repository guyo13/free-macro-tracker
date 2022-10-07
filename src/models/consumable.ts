import type { INutritionalValue } from "./nutrient";
import type IDBRecord from "./record";

export enum ConsumableType {
  // TODO - Add compatibility with previous "Food/Recipe Item" enum values
  Food = 1,
  Recipe = 2,
}

export default interface IConsumable extends IDBRecord {
  name: string;
  brand: string;
  type: ConsumableType;
  referenceServing: number;
  units: string;
  nutritionalValue: INutritionalValue;
}
