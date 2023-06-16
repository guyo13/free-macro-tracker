// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

export const fmtAppGlobals = {
  //Globals - Links
  projectURL: "https://github.com/guyo13/free-macro-tracker",
  //Globals - DB
  FMT_DB_CURSOR_DIRS: ["next", "nextunique", "prev", "prevunique"],
  FMT_DB_MEAL_ENTRIES_STORE: "fmt_meal_entries",
  FMT_DB_FOODS_STORE: "fmt_foods",
  FMT_DB_RECIPES_STORE: "fmt_recipes",
  FMT_DB_PROFILES_STORE: "fmt_profiles",
  FMT_DB_UNITS_STORE: "fmt_units",
  FMT_DB_NUTRIENTS_STORE: "fmt_nutrients",
  FMT_DB_USER_SETTINGS_STORE: "fmt_user_settings",
  FMT_DB_USER_GOALS_STORE: "fmt_user_goals",
  //Globals - Page
  tabIds: ["goto-overview", "goto-foods", "goto-profile", "goto-settings"],
  dynamicScreenIds: [
    "add-food-screen",
    "edit-food-screen",
    "view-food-screen",
    "add-recipe-screen",
    "view-recipe-screen",
    "edit-recipe-screen",
    "edit-ingredient-screen",
    "add-to-recipe-screen",
    "add-to-meal-screen",
    "edit-meal-entry-screen",
  ],
  overlaysIds: [
    "fmt-app-load-overlay",
    "fmt-app-first-time-overlay",
    "fmt-app-nav-overlay",
  ],
  consumableItemScreenStaticFieldsDescriptional: ["name", "brand"],
  consumableItemScreenStaticFieldsNutirtional: [
    "calories",
    "proteins",
    "carbohydrates",
    "fats",
  ],
  dateDivIDs: ["overview-date-day-large", "overview-date-day-small"],
  maxDynamicScreens: 1000,
  //Globals - Units
  supportedBodyweightUnits: ["Kg", "Lbs"],
  supportedHeightUnits: ["Cm", "Inch"],
  sexes: ["Male", "Female"],
  supportedActivityLevels: [
    "Sedentary",
    "Light",
    "Moderate",
    "High",
    "Very High",
    "Custom",
  ],
  activityLevelsMultipliers: {
    Sedentary: 1.2,
    Light: 1.375,
    Moderate: 1.55,
    High: 1.725,
    "Very High": 1.9,
  },
  supportedMacroUnits: ["kCal", "%", "g"],
  macroNames: ["protein", "carbohydrate", "fat"],
  supportedUnitTypes: ["mass", "volume", "arbitrary"],
  //Globals - UI - Default
  defaultAlertScroll: { top: 0, left: 0, behavior: "smooth" },
  inputScreensQualifiers: ["food", "consumable", "recipe", "ingredient"],
  consumableTypes: [
    "Food Item",
    "Meal Entry",
    "Recipe Item",
    "Ingredient Item",
  ],
  strings: {
    tdeeTooltip: "Total daily calories burned including exercise.",
    bmrTooltip:
      "Basal Metabloic Rate. Daily calories burned without any activity.",
  },
};

export const DEFAULT_ROUNDING_PRECISION = 1;
export const NUTRIENT_ROUNDING_PRECISION = 4;
export const OVERVIEW_DATE_FORMAT = "MMM do yyyy";
// FIXME - Temporary, until we change state to be stored inside the component
export const PREVIOUS_UNIT_ATTR = "aria-roledescription";
