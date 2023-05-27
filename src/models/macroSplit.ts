// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { isPercent } from "../utils/utils";

export interface IMacroSplit {
  Calories: number;
  Protein: number;
  Carbohydrate: number;
  Fat: number;
}

export default class MacroSplit implements IMacroSplit {
  readonly Calories: number;
  readonly Protein: number;
  readonly Carbohydrate: number;
  readonly Fat: number;

  constructor(
    Calories: number,
    Protein: number,
    Carbohydrate: number,
    Fat: number
  ) {
    MacroSplit.validate(Calories, Protein, Carbohydrate, Fat);
    this.Calories = Calories;
    this.Protein = Protein;
    this.Carbohydrate = Carbohydrate;
    this.Fat = Fat;
  }

  static from(macroSplit: IMacroSplit): MacroSplit {
    return this.fromObject(macroSplit);
  }

  static fromObject(object: any): MacroSplit {
    const { Calories, Protein, Carbohydrate, Fat } = object;
    return new MacroSplit(Calories, Protein, Carbohydrate, Fat);
  }

  static validate(Calories: any, Protein: any, Carbohydrate: any, Fat: any) {
    if (!Number.isFinite(Calories)) {
      throw `Calories must be a valid number. Got '${Calories}'`;
    }
    if (!Number.isFinite(Protein) || !isPercent(Protein)) {
      throw `Protein must be a valid percentage. Got '${Protein}'`;
    }
    if (!Number.isFinite(Carbohydrate) || !isPercent(Carbohydrate)) {
      throw `Carbohydrate must be a valid percentage. Got '${Carbohydrate}'`;
    }
    if (!Number.isFinite(Fat) || !isPercent(Fat)) {
      throw `Fat must be a valid percentage. Got '${Fat}'`;
    }
    const sum = Protein + Carbohydrate + Fat;
    if (sum !== 100) {
      throw `Sum of protein, carbhydrate and fat must equal 100. Got '${sum}'`;
    }
  }
}
