// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { isNullOrEmptyString, isString } from "../utils/utils";
import type { INutrientDefinition } from "./nutrient";

export default class NutrientDefinition implements INutrientDefinition {
  readonly name: string;
  readonly category: string;
  readonly default_unit: string;
  readonly help?: string;

  constructor(
    name: string,
    category: string,
    default_unit: string,
    help: string | null
  ) {
    NutrientDefinition.validate(name, category, default_unit, help);
    this.name = name;
    this.category = category;
    this.default_unit = default_unit;
    if (help) {
      this.help = help;
    }
  }

  static from(nutrientDefinition: INutrientDefinition): NutrientDefinition {
    return this.fromObject(nutrientDefinition);
  }

  static fromObject(object: any): NutrientDefinition {
    const { name, category, default_unit, help } = object;
    return new this(name, category, default_unit, help);
  }

  static validate(name: any, category: any, default_unit: any, help: any) {
    if (isNullOrEmptyString(name) || !isString(name)) {
      throw "Nutrient name must not be empty";
    }
    if (isNullOrEmptyString(category) || !isString(category)) {
      throw "Nutrient category must not be empty";
    }
    if (isNullOrEmptyString(default_unit) || !isString(default_unit)) {
      throw "Nutrient default_unit must not be empty";
    }
    if (help && !isString(help)) {
      throw "Invalid nutrient help text";
    }
  }
}
