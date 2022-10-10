// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

export interface INutrientRecord {
  name: string;
  amount: number;
  unit: string;
}

export interface INutrientDefinition {
  name: string;
  category: string;
  default_unit: string;
  help?: string;
}

export interface INutritionalValue {
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  additionalNutrients: AdditionalNutrients;
}

// TODO - rename it to something more clear
export type AdditionalNutrients = {
  [key: string]: INutrientRecord[];
};
