// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import type { IMealIdentifier } from "./mealIdentifier";
import type IDBRecord from "./record";
import {
  type RecordId,
  validateDateString,
  validateRecordId,
  validateTzMinutes,
} from "./record";
import MealIdentifier from "./mealIdentifier";
import { validateConsumable } from "./consumable";
import { isValid as isValidConsumableType } from "../types/consumableType";

export interface IMealEntry extends IDBRecord, IMealIdentifier {
  entry_id?: RecordId;
  profile_id: number;
  year: number;
  month: number;
  day: number;
  mealName: string;
  consumable_id: number;
  consumableName: string;
  consumableBrand: string;
  consumableType: string;
  serving: number;
  units: string;
  nutritionalValue: object; //TODO
}

export default class MealEntry implements IMealEntry {
  readonly entry_id?: RecordId;
  readonly lastModified: string;
  readonly tzMinutes: number;
  readonly profile_id: number;
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly mealName: string;
  readonly consumable_id: number;
  readonly consumableName: string;
  readonly consumableBrand: string;
  readonly consumableType: string;
  readonly serving: number;
  readonly units: string;
  readonly nutritionalValue: object; //TODO

  constructor(
    profile_id: number,
    year: number,
    month: number,
    day: number,
    mealName: string,
    consumable_id: number,
    consumableName: string,
    consumableBrand: string,
    consumableType: string,
    serving: number,
    units: string,
    nutritionalValue: object,
    entry_id?: RecordId,
    lastModified?: string,
    tzMinutes?: number
  ) {
    MealEntry.validate(
      profile_id,
      year,
      month,
      day,
      mealName,
      consumable_id,
      consumableName,
      consumableBrand,
      consumableType,
      serving,
      units,
      nutritionalValue,
      entry_id,
      lastModified,
      tzMinutes
    );
    this.profile_id = profile_id;
    this.year = year;
    this.month = month;
    this.day = day;
    this.mealName = mealName;
    this.consumable_id = consumable_id;
    this.consumableName = consumableName;
    this.consumableBrand = consumableBrand;
    this.consumableType = consumableType;
    this.serving = serving;
    this.units = units;
    this.nutritionalValue = nutritionalValue;
    this.entry_id = entry_id;
    this.lastModified = lastModified;
    this.tzMinutes = tzMinutes;
  }

  get id(): RecordId {
    return this.entry_id;
  }

  get meal_year(): number {
    return this.year;
  }

  get meal_month(): number {
    return this.month;
  }

  get meal_day(): number {
    return this.day;
  }

  get meal_name(): string {
    return this.mealName;
  }

  static from(mealEntry: IMealEntry): MealEntry {
    return this.fromObject(mealEntry);
  }

  static fromObject(object): MealEntry {
    const {
      profile_id,
      year,
      month,
      day,
      mealName,
      consumable_id,
      consumableName,
      consumableBrand,
      consumableType,
      serving,
      units,
      nutritionalValue,
      entry_id,
      lastModified,
      tzMinutes,
    } = object;
    return new MealEntry(
      profile_id,
      year,
      month,
      day,
      mealName,
      consumable_id,
      consumableName,
      consumableBrand,
      consumableType,
      serving,
      units,
      nutritionalValue,
      entry_id,
      lastModified,
      tzMinutes
    );
  }

  static validate(
    profile_id,
    year,
    month,
    day,
    mealName,
    consumable_id,
    consumableName,
    consumableBrand,
    consumableType,
    serving,
    units,
    nutritionalValue,
    entry_id,
    lastModified,
    tzMinutes
  ) {
    MealIdentifier.validate(profile_id, year, month, day, mealName);
    validateDateString(lastModified);
    validateTzMinutes(tzMinutes);
    validateRecordId(consumable_id);
    validateConsumable(
      consumableName,
      consumableBrand,
      serving,
      units,
      nutritionalValue
    );

    if (!isValidConsumableType(consumableType)) {
      throw `Invalid consumable type. Got '${consumableType}'`;
    }
    if (entry_id) {
      validateRecordId(entry_id);
    }
  }
}
