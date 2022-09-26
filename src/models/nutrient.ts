export interface NutrientData {
  name: string;
  amount: number;
  unit: string;
}

export interface NutrientDefinition {
  name: string;
  category: string;
  default_unit: string;
  help?: string;
}

export interface NutritionalValue {
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  additionalNutrients: AdditionalNutrients;
}

// TODO - rename it to something more clear
export type AdditionalNutrients = {
  [key: string]: Array<NutrientData>;
};
