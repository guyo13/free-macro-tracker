import type { NutrientDefinition } from "../app/nutrient";
import { UnitType, type Unit } from "../app/units";
import type { IndexConfig } from "idb_wrapper.js";

export interface StoreConfig {
  readonly name: string;
  readonly keyPath: string | string[];
  readonly autoIncrement: boolean;
  readonly indices: IndexConfig[];
}

export type MigrationsV1 = {
  readonly BASE_UNIT_CHART_V1: Array<Unit>;
  readonly BASE_ADDITIONAL_NUTRIENTS_V1: Array<NutrientDefinition>;
  readonly STORES: { [key: string]: StoreConfig };
};

export const MIGRATIONS_V1: MigrationsV1 = Object.freeze({
  BASE_UNIT_CHART_V1: [
    {
      name: "oz",
      value_in_grams: 28.34952,
      description: "Ounce",
      type: UnitType.Mass,
      value_in_ml: 0,
    },
    {
      name: "lb",
      value_in_grams: 453.5924,
      description: "Pound",
      type: UnitType.Mass,
      value_in_ml: 0,
    },
    {
      name: "st",
      value_in_grams: 6350.293,
      description: "Stone",
      type: UnitType.Mass,
      value_in_ml: 0,
    },
    {
      name: "mcg",
      value_in_grams: 0.000001,
      description: "Microgram",
      type: UnitType.Mass,
      value_in_ml: 0,
    },
    {
      name: "mg",
      value_in_grams: 0.001,
      description: "Milligram",
      type: UnitType.Mass,
      value_in_ml: 0,
    },
    {
      name: "g",
      value_in_grams: 1,
      description: "Gram",
      type: UnitType.Mass,
      value_in_ml: 0,
    },
    {
      name: "kg",
      value_in_grams: 1000,
      description: "Kilogram",
      type: UnitType.Mass,
      value_in_ml: 0,
    },
    {
      name: "ml",
      value_in_grams: 0,
      description: "Millilitre",
      type: UnitType.Volume,
      value_in_ml: 1,
    },
    {
      name: "l",
      value_in_grams: 0,
      description: "Litre",
      type: UnitType.Volume,
      value_in_ml: 1000,
    },
    {
      name: "tsp",
      value_in_grams: 0,
      description: "Metric teaspoon",
      type: UnitType.Volume,
      value_in_ml: 5,
    },
    {
      name: "tbsp",
      value_in_grams: 0,
      description: "Metric tablespoon",
      type: UnitType.Volume,
      value_in_ml: 15,
    },
    {
      name: "fl_oz",
      value_in_grams: 0,
      description: "Fluid Ounce",
      type: UnitType.Volume,
      value_in_ml: 28.41306,
    },
    {
      name: "cup",
      value_in_grams: 0,
      description: "Metric Cup",
      type: UnitType.Volume,
      value_in_ml: 250,
    },
    {
      name: "us_cup",
      value_in_grams: 0,
      description: "US Cup",
      type: UnitType.Volume,
      value_in_ml: 240,
    },
    {
      name: "serving",
      value_in_grams: 0,
      description: "Serving",
      type: UnitType.Arbitrary,
      value_in_ml: 0,
    },
  ],
  BASE_ADDITIONAL_NUTRIENTS_V1: [
    {
      name: "Sugars",
      category: "Carbohydrates",
      default_unit: "g",
      help: "Total Sugars",
    },
    { name: "Fiber", category: "Carbohydrates", default_unit: "g" },
    {
      name: "Starch",
      category: "Carbohydrates",
      default_unit: "g",
      help: "Total Starch",
    },
    { name: "Glucose", category: "Carbohydrates", default_unit: "g" },
    { name: "Sucrose", category: "Carbohydrates", default_unit: "g" },
    { name: "Ribose", category: "Carbohydrates", default_unit: "g" },
    { name: "Amylose", category: "Carbohydrates", default_unit: "g" },
    { name: "Amylopectin", category: "Carbohydrates", default_unit: "g" },
    { name: "Maltose", category: "Carbohydrates", default_unit: "g" },
    { name: "Galactose", category: "Carbohydrates", default_unit: "g" },
    { name: "Fructose", category: "Carbohydrates", default_unit: "g" },
    { name: "Lactose", category: "Carbohydrates", default_unit: "g" },
    {
      name: "Saturated Fats",
      category: "Fats",
      default_unit: "g",
      help: "Total",
    },
    {
      name: "Monounsaturated Fats",
      category: "Fats",
      default_unit: "g",
      help: "Total",
    },
    {
      name: "Polyunsaturated Fats",
      category: "Fats",
      default_unit: "g",
      help: "Total",
    },
    { name: "Omega-3", category: "Fats", default_unit: "g" },
    { name: "Omega-6", category: "Fats", default_unit: "g" },
    { name: "Trans Fats", category: "Fats", default_unit: "g" },
    { name: "Cholesterol", category: "Sterols", default_unit: "mg" },
    { name: "Calcium", category: "Minerals", default_unit: "mg" },
    { name: "Sodium", category: "Minerals", default_unit: "mg" },
    { name: "Potassium", category: "Minerals", default_unit: "mg" },
    { name: "Phosphorus", category: "Minerals", default_unit: "mg" },
    { name: "Magnesium", category: "Minerals", default_unit: "mg" },
    { name: "Chloride", category: "Minerals", default_unit: "mg" },
    { name: "Sulfur", category: "Minerals", default_unit: "mg" },
    { name: "Vitamin A", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin C", category: "Vitamins", default_unit: "mg" },
    { name: "Vitamin E", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin K", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin D", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin B1", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin B2", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin B3", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin B5", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin B6", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin B7", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin B9", category: "Vitamins", default_unit: "mcg" },
    { name: "Vitamin B12", category: "Vitamins", default_unit: "mcg" },
    { name: "Choline", category: "Vitamins", default_unit: "mcg" },
    { name: "Iron", category: "Trace Minerals", default_unit: "mg" },
    { name: "Zinc", category: "Trace Minerals", default_unit: "mg" },
    { name: "Selenium", category: "Trace Minerals", default_unit: "mcg" },
    { name: "Iodine", category: "Trace Minerals", default_unit: "mcg" },
    { name: "Copper", category: "Trace Minerals", default_unit: "mg" },
    { name: "Manganese", category: "Trace Minerals", default_unit: "mg" },
    { name: "Fluoride", category: "Trace Minerals", default_unit: "mcg" },
    { name: "Cobalt", category: "Trace Minerals", default_unit: "mcg" },
    { name: "Molybdenum", category: "Trace Minerals", default_unit: "mcg" },
    { name: "Alanine", category: "Amino Acids", default_unit: "mg" },
    { name: "Arginine", category: "Amino Acids", default_unit: "mg" },
    {
      name: "Aspartic acid",
      category: "Amino Acids",
      default_unit: "mg",
      help: "Aspartate",
    },
    { name: "Asparagine", category: "Amino Acids", default_unit: "mg" },
    { name: "Cysteine", category: "Amino Acids", default_unit: "mg" },
    {
      name: "Glutamic acid",
      category: "Amino Acids",
      default_unit: "mg",
      help: "Glutamate",
    },
    { name: "Glutamine", category: "Amino Acids", default_unit: "mg" },
    { name: "Glycine", category: "Amino Acids", default_unit: "mg" },
    { name: "Histidine", category: "Amino Acids", default_unit: "mg" },
    { name: "Isoleucine", category: "Amino Acids", default_unit: "mg" },
    { name: "Leucine", category: "Amino Acids", default_unit: "mg" },
    { name: "Lysine", category: "Amino Acids", default_unit: "mg" },
    { name: "Methionine", category: "Amino Acids", default_unit: "mg" },
    { name: "Phenylalanine", category: "Amino Acids", default_unit: "mg" },
    { name: "Proline", category: "Amino Acids", default_unit: "mg" },
    { name: "Serine", category: "Amino Acids", default_unit: "mg" },
    { name: "Threonine", category: "Amino Acids", default_unit: "mg" },
    { name: "Tryptophan", category: "Amino Acids", default_unit: "mg" },
    { name: "Tyrosine", category: "Amino Acids", default_unit: "mg" },
    { name: "Valine", category: "Amino Acids", default_unit: "mg" },
    { name: "Water", category: "Other", default_unit: "g" },
    { name: "Ash", category: "Other", default_unit: "g" },
    { name: "Alcohol", category: "Other", default_unit: "g" },
  ],
  STORES: {
    fmt_meal_entries: {
      name: "fmt_meal_entries",
      keyPath: "entry_id",
      autoIncrement: true,
      indices: [
        {
          name: "profile_id_date_index",
          kp: ["profile_id", "year", "month", "day"],
          options: { unique: false },
        },
      ],
    },
    fmt_foods: {
      name: "fmt_foods",
      keyPath: "food_id",
      autoIncrement: true,
      indices: [
        { name: "food_name_index", kp: "foodName", options: { unique: false } },
        {
          name: "food_brand_index",
          kp: "foodBrand",
          options: { unique: false },
        },
      ],
    },
    fmt_recipes: {
      name: "fmt_recipes",
      keyPath: "recipe_id",
      autoIncrement: true,
      indices: [
        {
          name: "recipe_name_index",
          kp: "recipeName",
          options: { unique: false },
        },
      ],
    },
    fmt_profiles: {
      name: "fmt_profiles",
      keyPath: "profile_id",
      autoIncrement: false,
      indices: [],
    },
    fmt_units: {
      name: "fmt_units",
      keyPath: "name",
      autoIncrement: false,
      indices: [],
    },
    fmt_nutrients: {
      name: "fmt_nutrients",
      keyPath: ["category", "name"],
      autoIncrement: false,
      indices: [],
    },
    fmt_user_settings: {
      name: "fmt_user_settings",
      keyPath: "profile_id",
      autoIncrement: false,
      indices: [],
    },
    fmt_user_goals: {
      name: "fmt_user_goals",
      keyPath: ["profile_id", "year", "month", "day"],
      autoIncrement: false,
      indices: [],
    },
  },
});

// TODO - Replace with idb_wrapper.js implementation
function createIndexes(objectStore: IDBObjectStore, indexesObj: IndexConfig[]) {
  for (const indexConfig of Object.values(indexesObj)) {
    try {
      const { name, kp, options } = indexConfig;
      objectStore.createIndex(name, kp, options);
    } catch (error) {
      console.error(error);
      console.log(indexesObj);
    }
  }
}

// TODO - Refactor IDBWrapper
export function initializeStore(
  indexedDB: IDBDatabase,
  storeConfig: StoreConfig
): IDBObjectStore {
  const storeObject = indexedDB.createObjectStore(storeConfig.name, {
    keyPath: storeConfig.keyPath,
    autoIncrement: storeConfig.autoIncrement,
  });
  createIndexes(storeObject, storeConfig.indices);
  return storeObject;
}

export function prepareDBv1(indexedDB: IDBDatabase) {
  console.debug("Preparing DB V1.");
  if (!indexedDB) {
    console.error("indexedDB must not be null.");
    return;
  }
  initializeStore(indexedDB, MIGRATIONS_V1.STORES.fmt_meal_entries);
  initializeStore(indexedDB, MIGRATIONS_V1.STORES.fmt_foods);
  initializeStore(indexedDB, MIGRATIONS_V1.STORES.fmt_recipes);
  initializeStore(indexedDB, MIGRATIONS_V1.STORES.fmt_profiles);

  const unitStore = initializeStore(indexedDB, MIGRATIONS_V1.STORES.fmt_units);
  for (const unit of MIGRATIONS_V1.BASE_UNIT_CHART_V1) {
    console.debug(`Adding Unit entry: ${JSON.stringify(unit)}`);
    unitStore.add(unit);
  }

  const nutrientStore = initializeStore(
    indexedDB,
    MIGRATIONS_V1.STORES.fmt_nutrients
  );
  for (const nutrient of MIGRATIONS_V1.BASE_ADDITIONAL_NUTRIENTS_V1) {
    console.debug(
      `Inserting Additional Nutrient entry: ${JSON.stringify(nutrient)}`
    );
    nutrientStore.add(nutrient);
  }

  initializeStore(indexedDB, MIGRATIONS_V1.STORES.fmt_user_settings);
  initializeStore(indexedDB, MIGRATIONS_V1.STORES.fmt_user_goals);
  console.debug("Initialized DB V1.");
}