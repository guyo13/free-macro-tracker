export const fmtAppGlobals: any = {};
//Globals - Links
fmtAppGlobals.projectURL = "https://github.com/guyo13/free-macro-tracker";
//Globals - DB
fmtAppGlobals.FMT_DB_CURSOR_DIRS = ["next", "nextunique", "prev", "prevunique"];
fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE = "fmt_meal_entries";
fmtAppGlobals.FMT_DB_FOODS_STORE = "fmt_foods";
fmtAppGlobals.FMT_DB_RECIPES_STORE = "fmt_recipes";
fmtAppGlobals.FMT_DB_PROFILES_STORE = "fmt_profiles";
fmtAppGlobals.FMT_DB_UNITS_STORE = "fmt_units";
fmtAppGlobals.FMT_DB_NUTRIENTS_STORE = "fmt_nutrients";
fmtAppGlobals.FMT_DB_USER_SETTINGS_STORE = "fmt_user_settings";
fmtAppGlobals.FMT_DB_USER_GOALS_STORE = "fmt_user_goals";

//Globals - Page
fmtAppGlobals.tabIds = [
  "goto-overview",
  "goto-foods",
  "goto-profile",
  "goto-settings",
];
fmtAppGlobals.dynamicScreenIds = [
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
];
fmtAppGlobals.overlaysIds = [
  "fmt-app-load-overlay",
  "fmt-app-first-time-overlay",
  "fmt-app-nav-overlay",
];
fmtAppGlobals.consumableItemScreenStaticFieldsDescriptional = ["name", "brand"];
fmtAppGlobals.consumableItemScreenStaticFieldsNutirtional = [
  "calories",
  "proteins",
  "carbohydrates",
  "fats",
];
fmtAppGlobals.dateDivIDs = [
  "overview-date-day-large",
  "overview-date-day-small",
];
fmtAppGlobals.maxDynamicScreens = 1000;
//Globals - Units
fmtAppGlobals.supportedBodyweightUnits = ["Kg", "Lbs"];
fmtAppGlobals.supportedHeightUnits = ["Cm", "Inch"];
fmtAppGlobals.sexes = ["Male", "Female"];
fmtAppGlobals.supportedActivityLevels = [
  "Sedentary",
  "Light",
  "Moderate",
  "High",
  "Very High",
  "Custom",
];
fmtAppGlobals.activityLevelsMultipliers = {
  Sedentary: 1.2,
  Light: 1.375,
  Moderate: 1.55,
  High: 1.725,
  "Very High": 1.9,
};
fmtAppGlobals.supportedMacroUnits = ["kCal", "%", "g"];
fmtAppGlobals.macroNames = ["protein", "carbohydrate", "fat"];
fmtAppGlobals.supportedUnitTypes = ["mass", "volume", "arbitrary"];
//Globals - UI - Default
fmtAppGlobals.defaultAlertScroll = { top: 0, left: 0, behavior: "smooth" };
fmtAppGlobals.inputScreensQualifiers = [
  "food",
  "consumable",
  "recipe",
  "ingredient",
];
fmtAppGlobals.consumableTypes = [
  "Food Item",
  "Meal Entry",
  "Recipe Item",
  "Ingredient Item",
];
fmtAppGlobals.strings = {
  tdeeTooltip: "Total daily calories burned including exercise.",
  bmrTooltip:
    "Basal Metabloic Rate. Daily calories burned without any activity.",
};

export const DEFAULT_ROUNDING_PRECISION = 1;
export const NUTRIENT_ROUNDING_PRECISION = 4;
export const FMT_DB_NAME = "fmt";
export const FMT_DB_VER = 1;
export const OVERVIEW_DATE_FORMAT = "MMM do yyyy";
// FIXME - Temporary, until we change state to be stored inside the component
export const PREVIOUS_UNIT_ATTR = "aria-roledescription";
