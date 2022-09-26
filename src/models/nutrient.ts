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
