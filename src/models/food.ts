// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { ConsumableType, validateConsumable } from "./consumable";
import type IConsumable from "./consumable";
import type { INutritionalValue } from "./nutrient";
import { validateRecord, type RecordId } from "./record";

export interface IFood extends IConsumable {}

export default class Food implements IFood {
  readonly food_id: RecordId;
  readonly foodName: string;
  readonly foodBrand: string;
  readonly referenceServing: number;
  readonly units: string;
  readonly nutritionalValue: INutritionalValue;
  readonly lastModified: string;
  readonly tzMinutes: number;
  readonly type: ConsumableType = ConsumableType.Food;

  constructor(
    id: RecordId,
    name: string,
    brand: string,
    referenceServing: number,
    units: string,
    nutritionalValue: INutritionalValue,
    lastModified: string,
    tzMinutes: number
  ) {
    Food.validate(
      id,
      name,
      brand,
      referenceServing,
      units,
      nutritionalValue,
      lastModified,
      tzMinutes
    );

    this.food_id = id;
    this.foodName = name;
    this.foodBrand = brand;
    this.referenceServing = referenceServing;
    this.units = units;
    this.nutritionalValue = nutritionalValue;
    this.lastModified = lastModified;
    this.tzMinutes = tzMinutes;
  }

  get id(): RecordId {
    return this.food_id;
  }

  get name(): string {
    return this.foodName;
  }

  get brand(): string {
    return this.foodBrand;
  }

  static fromObject(object: any): Food {
    const {
      food_id: id,
      foodName: name,
      foodBrand: brand,
      referenceServing,
      units,
      nutritionalValue,
      lastModified,
      tzMinutes,
    } = object;
    return new Food(
      id,
      name,
      brand,
      referenceServing,
      units,
      nutritionalValue,
      lastModified,
      tzMinutes
    );
  }

  static validate(
    id: any,
    name: any,
    brand: any,
    referenceServing: any,
    units: any,
    nutritionalValue: any,
    lastModified: any,
    tzMinutes: any
  ) {
    validateRecord(id, lastModified, tzMinutes);
    validateConsumable(name, brand, referenceServing, units, nutritionalValue);
  }
}
