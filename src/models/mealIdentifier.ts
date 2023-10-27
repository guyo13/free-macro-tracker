// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { isNullOrEmptyString, isString } from "../utils/utils";

export interface IMealIdentifier {
  profile_id: number;
  meal_year: number;
  meal_month: number;
  meal_day: number;
  meal_name: string;
}

export default class MealIdentifier implements IMealIdentifier {
  readonly profile_id: number;
  readonly meal_year: number;
  readonly meal_month: number;
  readonly meal_day: number;
  readonly meal_name: string;

  constructor(
    profile_id: number,
    meal_year: number,
    meal_month: number,
    meal_day: number,
    meal_name: string
  ) {
    MealIdentifier.validate(
      profile_id,
      meal_year,
      meal_month,
      meal_day,
      meal_name
    );
    this.profile_id = profile_id;
    this.meal_year = meal_year;
    this.meal_month = meal_month;
    this.meal_day = meal_day;
    this.meal_name = meal_name;
  }

  static from(mealIdentifier: IMealIdentifier): MealIdentifier {
    return this.fromObject(mealIdentifier);
  }

  static fromObject(object): MealIdentifier {
    const { profile_id, meal_year, meal_month, meal_day, meal_name } = object;
    return new MealIdentifier(
      profile_id,
      meal_year,
      meal_month,
      meal_day,
      meal_name
    );
  }

  static validate(profile_id, meal_year, meal_month, meal_day, meal_name) {
    if (!Number.isInteger(meal_year) || meal_year < 0) {
      throw `Meal Year must be a positive integer. Got '${meal_year}'`;
    }
    if (!Number.isInteger(meal_month) || meal_month < 0 || meal_month > 11) {
      throw `Meal Month must be a valid Month number. Got '${meal_month}'`;
    }
    if (!Number.isInteger(meal_day) || meal_day < 1 || meal_day > 31) {
      throw `Meal Day must be an integer in range of 1-31. Got '${meal_day}'`;
    }
    if (!Number.isInteger(profile_id)) {
      throw `Profile ID must be a valid integer. Got '${profile_id}'`;
    }
    if (isNullOrEmptyString(meal_name) || !isString(meal_name)) {
      throw `Meal Name must not be null or empty string. Got '${meal_name}'`;
    }
  }
}
