// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import MacroSplit from "./macroSplit";
import type { IMacroSplit } from "./macroSplit";

export interface IUserGoals {
  profile_id: number;
  year: number;
  month: number;
  day: number;
  macroSplit: IMacroSplit;
}

export default class UserGoals implements IUserGoals {
  readonly profile_id: number;
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly macroSplit: MacroSplit;

  constructor(
    profile_id: number,
    year: number,
    month: number,
    day: number,
    macroSplit: IMacroSplit
  ) {
    UserGoals.validate(profile_id, year, month, day, macroSplit);
    this.profile_id = profile_id;
    this.year = year;
    this.month = month;
    this.day = day;
    this.macroSplit = MacroSplit.from(macroSplit);
  }

  static from(userGoals: IUserGoals): UserGoals {
    return this.fromObject(userGoals);
  }

  static fromObject(object: any): UserGoals {
    const { profile_id, year, month, day, macroSplit } = object;
    return new UserGoals(profile_id, year, month, day, macroSplit);
  }

  static validate(
    profile_id: any,
    year: any,
    month: any,
    day: any,
    macroSplit: any
  ) {
    if (!Number.isInteger(year) || year < 0) {
      throw `Year must be a positive integer. Got '${year}'`;
    }
    if (!Number.isInteger(month) || month < 0 || month > 11) {
      throw `Month must be a valid Month number. Got '${month}'`;
    }
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      throw `Day must be an integer in range of 1-31. Got '${day}'`;
    }
    if (!Number.isInteger(profile_id)) {
      throw `Profile ID must be a valid integer. Got '${profile_id}'`;
    }
    const { Calories, Protein, Carbohydrate, Fat } = macroSplit;
    MacroSplit.validate(Calories, Protein, Carbohydrate, Fat);
  }
}
