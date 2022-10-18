// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

/// This is a temporary module that exports the legacy fmtAppInstance object,
/// that was used to hold the entire application state.

const fmtAppInstance = {
  //Instance - Db
  fmtDb: undefined,
  //Instance - Settings
  displaySettings: {
    showConsumableIdColumn: false,
  },
  promptSettings: {
    promptOnUnsavedFood: true,
    promptOnNoProfileCreated: true,
  },
  firstTimeScreenAutomatic: false,
  allowForeignNutrients: true,
  mealEntryMacroBarInPercent: false,
  macroAutoFill: "carb",
  //TODO - Default meals
  defaultMeals: ["Breakfast", "Early Snack", "Lunch", "Late Snack", "Dinner"],
  //Instance - State - Page
  pageState: {
    activeTab: null,
    activeDynamicScreens: {},
  },
  //Instance - State - Log
  today: null,
  currentDay: null,
  //Instance - State - function pointers
  eventFunctions: {},
  viewFoodAddIngredientFn: null,
  addRecipeAddIngredientFn: null,
  addRecipeSaveRecipeFn: null,
  editRecipeSaveRecipeFn: null,
  editRecipeAddIngredientFn: null,
  editRecipeDeleteFn: null,
  editIngredientDeleteFn: null,
  editIngredientUpdateFn: null,
  editIngredientServingKeyupFn: null,
  //Instance - User defined metrics
  unitsChart: null,
  // TODO - Rename this
  additionalNutrients: null,
  // Profile state
  currentProfile: undefined,
  currentProfileId: undefined,
  currentDayUserGoals: undefined,
};

export default fmtAppInstance;
