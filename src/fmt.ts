// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import {
  fmtAppGlobals,
  DEFAULT_ROUNDING_PRECISION,
  NUTRIENT_ROUNDING_PRECISION,
  OVERVIEW_DATE_FORMAT,
  PREVIOUS_UNIT_ATTR,
} from "./app/globals";
import fmtAppInstance from "./app/instance";
import { default as FMTPlatform, FMTPlatformType } from "./app/platform";
import {
  isDate,
  isSameDay,
  isFunction,
  isNumber,
  isPercent,
  isString,
  roundedToFixed,
} from "./utils/utils";
import {
  calculateConsumableRatio,
  katchMcArdle,
  mifflinStJeor,
} from "./utils/calculations";
import {
  convertUnitsByName,
  findConvertibleUnitsByName,
  type IUnit,
  type UnitChart,
} from "./models/units";
import type {
  AdditionalNutrients,
  INutrientDefinition,
  INutritionalValue,
} from "./models/nutrient";

import { format as formatDate } from "date-fns";
import { IDBTransactionModes } from "idb_wrapper.js";
import type { IUserGoals } from "./models/userGoals";
import type { RecordId } from "./models/record";
import type { IMealIdentifier } from "./models/mealIdentifier";
import type { IMacroSplit } from "./models/macroSplit";
import UserProfile from "./models/userProfile";

// TODO - Temporary - until this is migrated to its own store
export const platformInterface = new FMTPlatform();

//Globals - Export
var fmtAppExport;

//Functions
//Functions - Generic
function appendChildren(DOMElement, childrenArray) {
  for (let k = 0; k < childrenArray.length; k++) {
    DOMElement.appendChild(childrenArray[k]);
  }
}

function isInput(elem) {
  return elem.tagName.toLowerCase() == "input";
}
function taskWaitUntil(onendFn, endconditionFn, intervalMs) {
  intervalMs = intervalMs || 50;
  if (!(typeof endconditionFn === "function")) return;
  let intervalObj;
  intervalObj = setInterval(function () {
    if (endconditionFn()) {
      clearInterval(intervalObj);
      if (typeof onendFn === "function") {
        onendFn();
      }
    }
  }, intervalMs);
}
function getEmptyArrayEndCondition(array) {
  return function () {
    return array.length < 1;
  };
}
function getOnEndRemoveFirstFromArrayAndExec(globalArray, elem, fn) {
  return function () {
    const idx = globalArray.indexOf(elem);
    if (idx >= 0) {
      globalArray.splice(idx, 1);
    }
    if (typeof fn === "function") {
      fn();
    }
  };
}
function FMTCreateEmptyAdditionalNutrients(): AdditionalNutrients {
  const additional = fmtAppInstance.additionalNutrients;
  const additionalNutrients: AdditionalNutrients = {};
  for (const category in additional) {
    additionalNutrients[category] = additional[category].map((nutriObj) => ({
      name: nutriObj.name,
      amount: 0,
      unit: nutriObj.default_unit,
    }));
  }
  return additionalNutrients;
}
function FMTCreateEmptyNutritionalValue(
  withAdditionalNutrients: boolean
): INutritionalValue {
  const nutritionalValue = {
    calories: 0,
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
    additionalNutrients: withAdditionalNutrients
      ? FMTCreateEmptyAdditionalNutrients()
      : {},
  };
  return nutritionalValue;
}
function FMTSumAdditionalNutrients(
  additionalNutrientsSum: AdditionalNutrients,
  additionalNutrientsObj: AdditionalNutrients,
  unitsChart
) {
  unitsChart = unitsChart || fmtAppInstance.unitsChart;
  const categories = Object.keys(additionalNutrientsObj);
  categories.forEach((category) => {
    if (!Array.isArray(additionalNutrientsSum[category])) {
      additionalNutrientsSum[category] = [];
    }
    additionalNutrientsObj[category].forEach((addiNutriObj) => {
      const idx = indexesOfObject(
        additionalNutrientsSum[category],
        "name",
        addiNutriObj.name
      );
      let isConvertible = false;
      let l = 0;
      while (l < idx.length && !isConvertible) {
        const existingNutri = additionalNutrientsSum[category][idx[l]];
        const convRes = convertUnitsByName(
          existingNutri.unit,
          addiNutriObj.unit,
          unitsChart
        );
        isConvertible = convRes.isConvertible;
        if (isConvertible) {
          //Convert in direction of "target" to "reference", multiply by multiplier
          existingNutri.amount += addiNutriObj.amount * convRes.unitMultiplier;
        }
        l++;
      }
      if (!isConvertible) {
        //Insert Non convertible unit of same name after the last index found or at end
        const insertIndex =
          idx.length < 1
            ? additionalNutrientsSum[category].length
            : idx[idx.length - 1] + 1;
        additionalNutrientsSum[category].splice(
          insertIndex,
          0,
          Object.assign({}, addiNutriObj)
        );
      }
    });
  });
}
function indexesOfObject(array, key, value) {
  let idx = [];
  array.forEach((item, i) => {
    if (item[key] === value) {
      idx.push(i);
    }
  });
  return idx;
}
function indexesOfObjectMulti(array, obj) {
  let idx = [];
  array.forEach((item, i) => {
    for (const k in obj) {
      if (item[k] !== obj[k]) {
        return;
      }
    }
    idx.push(i);
  });
  return idx;
}
function _FMTSumNutritionalValues(
  nutritionalValue,
  nutritionalValuesArray,
  unitsChart
) {
  unitsChart = unitsChart || fmtAppInstance.unitsChart;
  nutritionalValuesArray.forEach((nutriValueObj) => {
    nutritionalValue.calories += nutriValueObj.calories;
    nutritionalValue.proteins += nutriValueObj.proteins;
    nutritionalValue.carbohydrates += nutriValueObj.carbohydrates;
    nutritionalValue.fats += nutriValueObj.fats;
    if ("additionalNutrients" in nutriValueObj) {
      FMTSumAdditionalNutrients(
        nutritionalValue.additionalNutrients,
        nutriValueObj.additionalNutrients,
        unitsChart
      );
    }
  });
  return nutritionalValue;
}
function FMTSumNutritionalValues(nutritionalValuesArray, unitsChart) {
  unitsChart = unitsChart || fmtAppInstance.unitsChart;
  const nutritionalValue = FMTCreateEmptyNutritionalValue(false);
  return _FMTSumNutritionalValues(
    nutritionalValue,
    nutritionalValuesArray,
    unitsChart
  );
}
function FMTSumIngredients(ingredients, unitsChart) {
  unitsChart = unitsChart || fmtAppInstance.unitsChart;
  const nutriValueArr = [];
  if (Array.isArray(ingredients)) {
    ingredients.forEach((item) => {
      nutriValueArr.push(item.nutritionalValue);
    });
  }
  return FMTSumNutritionalValues(nutriValueArr, unitsChart);
}

function _removeChildren(element, className) {
  if (element) {
    const members = element.getElementsByClassName(className);
    while (members.length > 0) {
      element.removeChild(members[0]);
    }
  }
}
function removeChildren(elementId, className) {
  const element = document.getElementById(elementId);
  _removeChildren(element, className);
}

//Functions - DB
function getObjectStore(store_name, mode) {
  if (!fmtAppInstance.fmtDb) {
    console.error("fmt DB null reference");
    return;
  }
  var tx = fmtAppInstance.fmtDb.transaction(store_name, mode);
  return tx.objectStore(store_name);
}

function getIndex(store_name, indexName) {
  const objectStore = getObjectStore(store_name, IDBTransactionModes.Readonly);
  const index = objectStore.index(indexName);
  return index;
}

//Functions - DB - Export
function FMTStringifyRemoveNewlines(k, v) {
  if (typeof v === "string") {
    return v.replace(/\n/g, "");
  } else return v;
}
function FMTExportToJSON(data, onsuccessFn, stringifyReplacerFn, filename) {
  if (platformInterface.hasPlatformInterface) {
    const stringified = JSON.stringify(data, stringifyReplacerFn);
    platformInterface.FMTExportData(stringified, filename);
  } else {
    FMTExportToJSONBlob(data, onsuccessFn, stringifyReplacerFn);
  }
}
function FMTExportToJSONBlob(data, onsuccessFn, stringifyReplacerFn) {
  if (fmtAppExport != null) {
    window.URL.revokeObjectURL(fmtAppExport);
  }
  const stringified = JSON.stringify(data, stringifyReplacerFn);
  let blob = new Blob([stringified], { type: "application/json" });
  fmtAppExport = window.URL.createObjectURL(blob);
  if (typeof onsuccessFn == "function") {
    onsuccessFn();
  }
}
function FMTDataToJSONArray(exportFn) {
  let records = [];
  let errors = [];
  if (!(typeof exportFn === "function")) {
    return;
  }

  const onIterRecipesSuccFn = function (ev) {
    let cursor = ev.target.result;
    if (cursor) {
      const record = cursor.value;
      record["__db_table_name__"] = fmtAppGlobals.FMT_DB_RECIPES_STORE;
      records.push(record);
      cursor.continue();
    } else {
      //Finalize Export (TODO Export User Settings after implementation)
      if (errors.length > 0) {
        for (let k = 0; k < errors.length; k++) console.error(errors[k]);
      }
      exportFn(records);
    }
  };

  const onReadUnitsSuccFn = function (e) {
    const units = e.target.result;
    if (units && Array.isArray(units)) {
      for (let k = 0; k < units.length; k++) {
        const record = units[k];
        record["__db_table_name__"] = fmtAppGlobals.FMT_DB_UNITS_STORE;
        records.push(record);
      }
    }
    FMTIterateRecipes(onIterRecipesSuccFn, function (err) {
      errors.push(err);
    });
  };
  const onReadNutriSuccFn = function (e) {
    const nutri = e.target.result;
    if (nutri && Array.isArray(nutri)) {
      for (let k = 0; k < nutri.length; k++) {
        const record = nutri[k];
        record["__db_table_name__"] = fmtAppGlobals.FMT_DB_NUTRIENTS_STORE;
        records.push(record);
      }
    }
    //Export Units
    FMTReadAllUnits(onReadUnitsSuccFn, function (err) {
      errors.push(err);
    });
  };
  const onIterFoodsSuccFn = function (ev) {
    let cursor = ev.target.result;
    if (cursor) {
      const record = cursor.value;
      record["__db_table_name__"] = fmtAppGlobals.FMT_DB_FOODS_STORE;
      records.push(record);
      cursor.continue();
    } else {
      //Export Nutrients
      FMTReadAllNutrients(onReadNutriSuccFn, function (err) {
        errors.push(err);
      });
    }
  };
  const onQueryMealEntriesSuccFn = function (ev) {
    let cursor = ev.target.result;
    if (cursor) {
      const record = cursor.value;
      record["__db_table_name__"] = fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE;
      records.push(record);
      cursor.continue();
    } else {
      //Export Foods
      FMTIterateFoods(onIterFoodsSuccFn, function (err) {
        errors.push(err);
      });
    }
  };
  const onQueryUserGoalsSuccFn = function (ev) {
    let cursor = ev.target.result;
    if (cursor) {
      const record = cursor.value;
      record["__db_table_name__"] = fmtAppGlobals.FMT_DB_USER_GOALS_STORE;
      records.push(record);
      cursor.continue();
    } else {
      //Export Meal Entries
      const mealEntriesQueryOpts = {
        queryType: "lowerBound",
        lowerOpen: false,
      };
      FMTQueryMealEntriesByProfileAndDate(
        -Infinity,
        -Infinity,
        -Infinity,
        -Infinity,
        onQueryMealEntriesSuccFn,
        function (err) {
          errors.push(err);
        },
        mealEntriesQueryOpts
      );
    }
  };
  const onAllProfileReadFn = function (e) {
    //Export profiles
    const profileEntries = e.target.result;
    if (profileEntries && profileEntries.length > 0) {
      for (let i = 0; i < profileEntries.length; i++) {
        const record = profileEntries[i];
        record["__db_table_name__"] = fmtAppGlobals.FMT_DB_PROFILES_STORE;
        records.push(record);
      }
    }
    //Export User Goals
    const userGoalsQueryOpts = { queryType: "lowerBound", lowerOpen: false };
    FMTQueryUserGoalsByProfileAndDate(
      -Infinity,
      -Infinity,
      -Infinity,
      -Infinity,
      onQueryUserGoalsSuccFn,
      function (err) {
        errors.push(err);
      },
      userGoalsQueryOpts
    );
  };
  FMTReadAllProfiles(onAllProfileReadFn, function (err) {
    errors.push(err);
    for (const e in errors) {
      console.error(errors[e]);
    }
  });
}
function FMTDataToStructuredJSON(exportFn) {
  let records = {};
  records[fmtAppGlobals.FMT_DB_UNITS_STORE] = [];
  records[fmtAppGlobals.FMT_DB_NUTRIENTS_STORE] = [];
  records[fmtAppGlobals.FMT_DB_FOODS_STORE] = [];
  records[fmtAppGlobals.FMT_DB_RECIPES_STORE] = [];
  records[fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE] = {};
  records[fmtAppGlobals.FMT_DB_USER_GOALS_STORE] = {};
  records[fmtAppGlobals.FMT_DB_PROFILES_STORE] = [];
  let errors = [];
  if (!(typeof exportFn === "function")) {
    return;
  }

  const onIterRecipesSuccFn = function (ev) {
    let cursor = ev.target.result;
    if (cursor) {
      const record = cursor.value;
      records[fmtAppGlobals.FMT_DB_RECIPES_STORE].push(record);
      cursor.continue();
    } else {
      //Finalize Export (TODO Export User Settings after implementation)
      if (errors.length > 0) {
        for (let k = 0; k < errors.length; k++) console.error(errors[k]);
      }
      exportFn(records);
    }
  };

  const onReadUnitsSuccFn = function (e) {
    const units = e.target.result;
    if (units && Array.isArray(units)) {
      for (let k = 0; k < units.length; k++) {
        const record = units[k];
        records[fmtAppGlobals.FMT_DB_UNITS_STORE].push(record);
      }
    }
    FMTIterateRecipes(onIterRecipesSuccFn, function (err) {
      errors.push(err);
    });
  };
  const onReadNutriSuccFn = function (e) {
    const nutri = e.target.result;
    if (nutri && Array.isArray(nutri)) {
      for (let k = 0; k < nutri.length; k++) {
        const record = nutri[k];
        records[fmtAppGlobals.FMT_DB_NUTRIENTS_STORE].push(record);
      }
    }
    //Export Units
    FMTReadAllUnits(onReadUnitsSuccFn, function (err) {
      errors.push(err);
    });
  };
  const onIterFoodsSuccFn = function (ev) {
    let cursor = ev.target.result;
    if (cursor) {
      const record = cursor.value;
      records[fmtAppGlobals.FMT_DB_FOODS_STORE].push(record);
      cursor.continue();
    } else {
      //Export Nutrients
      FMTReadAllNutrients(onReadNutriSuccFn, function (err) {
        errors.push(err);
      });
    }
  };
  const onQueryMealEntriesSuccFn = function (ev) {
    let cursor = ev.target.result;
    if (cursor) {
      const record = cursor.value;
      if (
        !records[fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE][record.profile_id]
      ) {
        records[fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE][record.profile_id] =
          [];
      }
      records[fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE][record.profile_id].push(
        record
      );
      cursor.continue();
    } else {
      //Export Foods
      FMTIterateFoods(onIterFoodsSuccFn, function (err) {
        errors.push(err);
      });
    }
  };
  const onQueryUserGoalsSuccFn = function (ev) {
    let cursor = ev.target.result;
    if (cursor) {
      const record = cursor.value;
      if (!records[fmtAppGlobals.FMT_DB_USER_GOALS_STORE][record.profile_id]) {
        records[fmtAppGlobals.FMT_DB_USER_GOALS_STORE][record.profile_id] = [];
      }
      records[fmtAppGlobals.FMT_DB_USER_GOALS_STORE][record.profile_id].push(
        record
      );
      cursor.continue();
    } else {
      //Export Meal Entries
      const mealEntriesQueryOpts = {
        queryType: "lowerBound",
        lowerOpen: false,
      };
      FMTQueryMealEntriesByProfileAndDate(
        -Infinity,
        -Infinity,
        -Infinity,
        -Infinity,
        onQueryMealEntriesSuccFn,
        function (err) {
          errors.push(err);
        },
        mealEntriesQueryOpts
      );
    }
  };
  const onAllProfileReadFn = function (e) {
    //Export profiles
    const profileEntries = e.target.result;
    if (profileEntries && profileEntries.length > 0) {
      for (let i = 0; i < profileEntries.length; i++) {
        const record = profileEntries[i];
        records[fmtAppGlobals.FMT_DB_PROFILES_STORE].push(record);
      }
    }
    //Export User Goals
    const userGoalsQueryOpts = { queryType: "lowerBound", lowerOpen: false };
    FMTQueryUserGoalsByProfileAndDate(
      -Infinity,
      -Infinity,
      -Infinity,
      -Infinity,
      onQueryUserGoalsSuccFn,
      function (err) {
        errors.push(err);
      },
      userGoalsQueryOpts
    );
  };
  FMTReadAllProfiles(onAllProfileReadFn, function (err) {
    errors.push(err);
    for (const e in errors) {
      console.error(errors[e]);
    }
  });
}

//Functions - DB - Import
function FMTImportData(jsonString) {
  try {
    FMTImportFromStructuredJSON(jsonString);
  } catch (err) {
    console.error(err);
    FMTShowAlert(
      "settings-alerts",
      "danger",
      "Error while importing. Data is corrupted!"
    );
  }
}

function FMTImportRecordsSeq(
  recordsObj,
  indexes,
  objectStoreName,
  successIterFn,
  errIterFn,
  importMethod,
  isVerbose
) {
  //Success and Error iter functions get as arguments - (event, recordsObj, indexes, objectStoreName, successIterFn, errIterFn, importMethod, isVerbose)
  importMethod = importMethod || "put";
  if (!Array.isArray(indexes) || indexes.length < 1) return;
  const objectStore = getObjectStore(
    objectStoreName,
    IDBTransactionModes.Readwrite
  );
  if (!objectStore) return;
  const idx = indexes[0];
  const record = recordsObj[idx];
  errIterFn = isFunction(errIterFn)
    ? errIterFn
    : function (e) {
        indexes.shift();
        if (isVerbose === true) {
          console.error(`Failed Adding Record to ${objectStoreName}, ${e}`);
        }
        FMTImportRecordsSeq(
          recordsObj,
          indexes,
          objectStoreName,
          successIterFn,
          errIterFn,
          importMethod,
          isVerbose
        );
      };
  successIterFn = isFunction(successIterFn)
    ? successIterFn
    : function (e) {
        indexes.shift();
        if (isVerbose === true) {
          console.debug(
            `Added Record to ${objectStoreName}, ${e.target.result}`
          );
        }
        FMTImportRecordsSeq(
          recordsObj,
          indexes,
          objectStoreName,
          successIterFn,
          errIterFn,
          importMethod,
          isVerbose
        );
      };
  let importReq;
  switch (importMethod) {
    case "add":
      importReq = objectStore.add(record);
      break;
    case "put":
    default:
      importReq = objectStore.put(record);
      break;
  }
  importReq.onsuccess = successIterFn;
  importReq.onerror = errIterFn;
}
function FMTImportTables(dbTables: any, jsonData: any, verbose?: any) {
  if (dbTables.length < 1) return;
  const dbTableName = dbTables[0]; //.shift();

  let keys, endCond, recordsObj, onEnd, iterSuccess, iterError;
  onEnd = getOnEndRemoveFirstFromArrayAndExec(
    dbTables,
    dbTableName,
    function () {
      //dbTables.shift();
      FMTImportTables(dbTables, jsonData);
    }
  );
  switch (dbTableName) {
    case fmtAppGlobals.FMT_DB_UNITS_STORE:
    case fmtAppGlobals.FMT_DB_NUTRIENTS_STORE:
    case fmtAppGlobals.FMT_DB_FOODS_STORE:
    case fmtAppGlobals.FMT_DB_RECIPES_STORE:
    case fmtAppGlobals.FMT_DB_PROFILES_STORE:
      //These are arrays of records
      recordsObj = jsonData[dbTableName];
      keys = Object.keys(recordsObj);
      endCond = getEmptyArrayEndCondition(keys);
      FMTImportRecordsSeq(
        recordsObj,
        keys,
        dbTableName,
        iterSuccess,
        iterError,
        "put",
        verbose
      );
      taskWaitUntil(onEnd, endCond, 100);
      break;
    case fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE:
    case fmtAppGlobals.FMT_DB_USER_GOALS_STORE:
      //profileEntriesContainer are objects with profile_ids as keys and arrays of records as values
      const profileEntriesContainer = jsonData[dbTableName];
      keys = Object.keys(profileEntriesContainer);
      endCond = getEmptyArrayEndCondition(keys);

      const onNextProfile = function () {
        if (!Array.isArray(keys) || keys.length < 1) return;
        let currentProfile_id = keys[0];
        recordsObj = profileEntriesContainer[currentProfile_id];
        let recordKeys = Object.keys(recordsObj);
        const iterProfilesEndCond = getEmptyArrayEndCondition(recordKeys);
        FMTImportRecordsSeq(
          recordsObj,
          recordKeys,
          dbTableName,
          iterSuccess,
          iterError,
          "put",
          verbose
        );
        //Wait for current profile entries
        taskWaitUntil(
          function () {
            keys.shift();
            onNextProfile();
          },
          iterProfilesEndCond,
          100
        );
      };
      //Wait for all profiles
      taskWaitUntil(onEnd, endCond, 110 * keys.length);
      onNextProfile();
      break;
    default:
      if (verbose === true) {
        console.warn(
          `Unrecognized DB Table name ${dbTableName} in import data. ignoring`
        );
      }
      dbTables.shift();
      return setTimeout(() => {
        FMTImportTables(dbTables, jsonData);
      }, 50);
  }
}
function FMTImportFromStructuredJSON(
  jsonString: any,
  jsonParseReviverFn?: any,
  onEnd?: any,
  excludeTables?: any
) {
  let jsonData = JSON.parse(jsonString, jsonParseReviverFn);
  let dbTables = Object.keys(jsonData);
  if (Array.isArray(excludeTables)) {
    dbTables = dbTables.filter((table) => excludeTables.indexOf(table) < 0);
  }
  const endCondition = function () {
    return dbTables.length < 1;
  };
  if (!isFunction(onEnd)) {
    onEnd = function () {
      console.log("Finished Import!");
      FMTLoadUnits(function () {
        FMTLoadAdditionalNutrients(function () {
          FMTLoadProfile(
            1,
            //onloaded
            function () {
              pageController.showOverview(true);
              FMTShowAlert(
                "overview-alerts",
                "success",
                "Data Imported Successfully!"
              );
            },
            //onNoProfile
            function () {
              console.warn("No user Profile could be loaded after Import");
              FMTShowAlert(
                "settings-alerts",
                "success",
                "Data Imported Successfully. But no user profile found."
              );
            }
          );
        });
      });
    };
  }

  taskWaitUntil(onEnd, endCondition, 500);
  FMTImportTables(dbTables, jsonData);
}

//Functions - Validation

// TODO - Remove after migrating to svelte components
function FMTIsValidId(id) {
  return isNumber(id) && Number.isInteger(Number(id));
}

// TODO - Remove
function FMTValidateNutritionalValue(
  nutritionalValueObj: any,
  unitsChart: UnitChart,
  options?: { compact?: boolean }
): { error?: string; nutritionalValue?: INutritionalValue } {
  if (unitsChart == null) {
    unitsChart = fmtAppInstance.unitsChart;
  }

  const isCompact = options?.compact ?? false;

  if (!isNumber(nutritionalValueObj.calories)) {
    return {
      error: `Calories must be a valid number (got ${nutritionalValueObj.calories}`,
    };
  }

  if (!isNumber(nutritionalValueObj.proteins)) {
    return {
      error: `Proteins must be a valid number (got ${nutritionalValueObj.proteins}`,
    };
  }

  if (!isNumber(nutritionalValueObj.carbohydrates)) {
    return {
      error: `Carbohydrates must be a valid number (got ${nutritionalValueObj.carbohydrates}`,
    };
  }

  if (!isNumber(nutritionalValueObj.fats)) {
    return {
      error: `fats must be a valid number (got ${nutritionalValueObj.fats}`,
    };
  }
  const nutritionalValue = {
    calories: Number(nutritionalValueObj.calories),
    proteins: Number(nutritionalValueObj.proteins),
    carbohydrates: Number(nutritionalValueObj.carbohydrates),
    fats: Number(nutritionalValueObj.fats),
    additionalNutrients: {},
  };

  let additionalNutrients = nutritionalValueObj.additionalNutrients;
  if (additionalNutrients != null) {
    for (const nutrientCategoryName in additionalNutrients) {
      const nutrientsInCat = additionalNutrients[nutrientCategoryName];
      if (Array.isArray(nutrientsInCat) && nutrientsInCat.length > 0) {
        const validatedNutrientsInCat = [];
        for (const j in nutrientsInCat) {
          const nutrient = nutrientsInCat[j];
          if (nutrient.name == null || nutrient.name === "") {
            return {
              error: `Nutrient in Category "${nutrientCategoryName}" has empty name`,
            };
          }
          if (!isNumber(nutrient.amount)) {
            return {
              error: `Nutrient "${nutrient.name}" (Category ${nutrientCategoryName}) has invalid value "${nutrient.amount}"`,
            };
          }
          if (
            !fmtAppInstance.allowForeignNutrients &&
            !(nutrient.unit in unitsChart)
          ) {
            return {
              error: `Nutrient "${nutrient.name}" (Category ${nutrientCategoryName}) has unknown or invalid unit "${nutrient.unit}"`,
            };
          }
          const validatedNutrient = {
            name: nutrient.name,
            amount: Number(nutrient.amount),
            unit: nutrient.unit,
          };
          if (!(isCompact && validatedNutrient.amount == 0)) {
            validatedNutrientsInCat.push(validatedNutrient);
          }
        }
        if (validatedNutrientsInCat.length > 0) {
          nutritionalValue.additionalNutrients[nutrientCategoryName] =
            validatedNutrientsInCat;
        }
      }
    }
  }

  return { nutritionalValue };
}

// TODO - Remove and use Food class
function FMTValidateFoodObject(
  foodObj: any,
  unitsChart: UnitChart
): {
  error?: string;
  food?: {
    foodName: string;
    foodBrand?: string;
    referenceServing: number;
    units: string;
    lastModified: string;
    tzMinutes: number;
    nutritionalValue: INutritionalValue;
    food_id?: RecordId;
  };
} {
  const _funcName = "FMTValidateFoodObject";
  if (foodObj.foodName == null || foodObj.foodName === "") {
    console.debug(`[${_funcName}] - null foodName`);
    return { food: null, error: "Food Description must not be empty" };
  }
  if (
    !isNumber(foodObj.referenceServing) ||
    Number(foodObj.referenceServing) <= 0
  ) {
    console.debug(`[${_funcName}] - referenceServing is not a positive number`);
    return { food: null, error: "Serving must be positive number" };
  }
  if (foodObj.units == null) {
    console.debug(`[${_funcName}] - null units`);
    return { food: null, error: "Invalid units" };
  }
  if (foodObj.nutritionalValue == null) {
    console.debug(`[${_funcName}] - null nutritionalValue`);
    return { food: null, error: "Nutritional Value must not be empty" };
  }
  const nutriValueValidateRes = FMTValidateNutritionalValue(
    foodObj.nutritionalValue,
    unitsChart
  );
  if (
    nutriValueValidateRes.nutritionalValue == null ||
    nutriValueValidateRes.error != null
  ) {
    return { food: null, error: nutriValueValidateRes.error };
  }
  const lastModified = foodObj.lastModified;
  const tzMinutes = foodObj.tzMinutes;
  const food = {
    foodName: foodObj.foodName,
    foodBrand: foodObj.foodBrand,
    referenceServing: Number(foodObj.referenceServing),
    units: foodObj.units,
    lastModified:
      lastModified != null && isDate(new Date(lastModified))
        ? lastModified
        : undefined,
    tzMinutes: tzMinutes != null && isNumber(tzMinutes) ? tzMinutes : undefined,
    nutritionalValue: nutriValueValidateRes.nutritionalValue,
  };

  return { food, error: null };
}

// TODO - Remove and use Unit class
function FMTValidateUnitObject(unitObj): IUnit {
  /*unitObj {name, value_in_grams, description}*/
  const _fnName = "FMTValidateUnitObject";
  const unit = {
    name: null,
    type: null,
    value_in_grams: 0,
    value_in_ml: 0,
    description: null,
  };

  if (unitObj.name == null || unitObj.name === "") {
    console.debug(`[${_fnName}] - unitObj.name is null or empty string`);
    return;
  }
  unit.name = unitObj.name;

  if (fmtAppGlobals.supportedUnitTypes.indexOf(unitObj.type) < 0) {
    console.debug(`[${_fnName}] - Invalid unitObj.type (${unitObj.type})`);
    return;
  }
  unit.type = unitObj.type;

  switch (unitObj.type) {
    case "mass":
      if (!isNumber(unitObj.value_in_grams)) {
        console.debug(
          `[${_fnName}] - unitObj.value_in_grams is not a valid number`
        );
        return;
      }
      unit.value_in_grams = unitObj.value_in_grams;
      unit.value_in_ml = 0;
      break;
    case "volume":
      if (!isNumber(unitObj.value_in_ml)) {
        console.debug(
          `[${_fnName}] - unitObj.value_in_ml is not a valid number`
        );
        return;
      }
      unit.value_in_ml = unitObj.value_in_ml;
      unit.value_in_grams = 0;
      break;
    case "arbitrary":
      if (isNumber(unitObj.value_in_ml) && isNumber(unitObj.value_in_gram)) {
        console.debug(
          `[${_fnName}] - Arbitrary Unit can't represent both volume and mass!`
        );
        return;
      } else if (isNumber(unitObj.value_in_ml)) {
        unit.value_in_ml = unitObj.value_in_ml;
        unit.value_in_grams = 0;
      } else if (isNumber(unitObj.value_in_grams)) {
        unit.value_in_grams = unitObj.value_in_grams;
        unit.value_in_ml = 0;
      } else {
        unit.value_in_ml = 0;
        unit.value_in_grams = 0;
      }
      break;
    default:
      console.error(`[${_fnName}] - Unsupported Unit type "${unitObj.type}"`);
      return;
  }

  unit.description = unitObj.description;
  return unit;
}

// TODO - Remove and use NutrientDefinition class
function FMTValidateNutrientObject(nutrientObj: any): INutrientDefinition {
  /*nutrientObj {name,category,default_unit,help}*/
  const _fnName = "FMTValidateNutrientObject";
  if (nutrientObj.name == null || nutrientObj.name === "") {
    console.debug(`[${_fnName}] - nutrientObj.name is null or empty string`);
    return;
  }
  if (nutrientObj.category == null || nutrientObj.category === "") {
    console.debug(
      `[${_fnName}] - nutrientObj.category is null or empty string`
    );
    return;
  }
  if (nutrientObj.default_unit == null || nutrientObj.default_unit === "") {
    console.debug(
      `[${_fnName}] - nutrientObj.default_unit is null or empty string`
    );
    return;
  }
  return {
    name: nutrientObj.name,
    category: nutrientObj.category,
    default_unit: nutrientObj.default_unit,
    help: nutrientObj.help,
  };
}

// TODO - Remove and use MacroSplit class
function FMTValidateMacroSplit(macroSplitObj): {
  error?: string;
  macroSplit?: IMacroSplit;
} {
  if (
    macroSplitObj == null ||
    (macroSplitObj.Calories == null &&
      macroSplitObj.Protein == null &&
      macroSplitObj.Carbohydrate == null &&
      macroSplitObj.Fat == null)
  ) {
    return {};
  }
  if (macroSplitObj.Calories != null && !isNumber(macroSplitObj.Calories)) {
    return { error: `Invalid Calories ${macroSplitObj.Calories}` };
  }
  if (macroSplitObj.Protein != null && !isPercent(macroSplitObj.Protein)) {
    return { error: `Invalid Protein ${macroSplitObj.Protein}` };
  }
  if (
    macroSplitObj.Carbohydrate != null &&
    !isPercent(macroSplitObj.Carbohydrate)
  ) {
    return { error: `Invalid Carbohydrate ${macroSplitObj.Carbohydrate}` };
  }
  if (macroSplitObj.Fat != null && !isPercent(macroSplitObj.Fat)) {
    return { error: `Invalid Fat ${macroSplitObj.Fat}` };
  } else {
    const sum =
      Number(macroSplitObj.Protein) +
      Number(macroSplitObj.Carbohydrate) +
      Number(macroSplitObj.Fat);
    if (sum === 100) {
      return {
        macroSplit: {
          Calories: Number(macroSplitObj.Calories),
          Protein: Number(macroSplitObj.Protein),
          Carbohydrate: Number(macroSplitObj.Carbohydrate),
          Fat: Number(macroSplitObj.Fat),
        },
      };
    } else {
      const percentDiff = 100 - sum;
      const calorieDiff = (percentDiff / 100) * macroSplitObj.Calories;
      const moreOrLess = calorieDiff > 0 ? "more" : "less";
      const gProtOrCarb = roundedToFixed(calorieDiff / 4, 2);
      const gFat = roundedToFixed(calorieDiff / 9, 2);
      return {
        error: `The sum of Protein, Carbohydrate and Fat Percentages must equal 100, current sum : ${sum}.
            (Thats ${gProtOrCarb} grams ${moreOrLess} of Carbs or Proteins or ${gFat} grams ${moreOrLess} of Fat)`,
      };
    }
  }
}

function FMTValidateMealEntry(mealEntryObj): {
  error?: string;
  mealEntry?: any;
} {
  if (
    !isNumber(mealEntryObj.profile_id) ||
    !Number.isInteger(Number(mealEntryObj.profile_id))
  ) {
    return {
      error: `Profile id must be an integer, got (${mealEntryObj.profile_id})`,
    };
  }
  if (
    !isDate(new Date(mealEntryObj.year, mealEntryObj.month, mealEntryObj.day))
  ) {
    return {
      error: `Year Month and Day must be valid integers, got (${mealEntryObj.year}, ${mealEntryObj.month}, ${mealEntryObj.day})`,
    };
  }
  if (mealEntryObj.mealName == null || mealEntryObj.mealName === "") {
    return {
      error: `Meal Name must not be null or empty string (got ${mealEntryObj.mealName})`,
    };
  }
  if (
    !!mealEntryObj.lastModified &&
    !isDate(new Date(mealEntryObj.lastModified))
  ) {
    return {
      error: `'lastModified ' value must be valid Date (got ${mealEntryObj.lastModified})`,
    };
  }
  if (
    mealEntryObj.tzMinutes !== undefined &&
    !Number.isInteger(mealEntryObj.tzMinutes)
  ) {
    return { error: `Invalid timezone ${mealEntryObj.tzMinutes}` };
  }
  if (
    !isNumber(mealEntryObj.consumable_id) ||
    !Number.isInteger(Number(mealEntryObj.consumable_id))
  ) {
    return {
      error: `Consumable id must be an integer, got (${mealEntryObj.consumable_id})`,
    };
  }
  if (
    mealEntryObj.consumableName == null ||
    mealEntryObj.consumableName === ""
  ) {
    return {
      error: `Consumable Name  must not be null or empty string (got ${mealEntryObj.consumableName})`,
    };
  }
  if (!isNumber(mealEntryObj.serving) || Number(mealEntryObj.serving) <= 0) {
    return {
      error: `Serving must be a positive number (got ${mealEntryObj.serving})`,
    };
  }
  if (mealEntryObj.units == null || mealEntryObj.units === "") {
    return { error: `Units must not be null` };
  }
  if (mealEntryObj.nutritionalValue == null) {
    return { error: `Nutritional Value must not be empty` };
  }
  const nutriValueValidateRes = FMTValidateNutritionalValue(
    mealEntryObj.nutritionalValue,
    fmtAppInstance.unitsChart
  );
  if (
    nutriValueValidateRes.nutritionalValue == null ||
    nutriValueValidateRes.error != null
  ) {
    return { error: nutriValueValidateRes.error };
  }

  const mealEntry = {
    profile_id: Number(mealEntryObj.profile_id),
    year: Number(mealEntryObj.year),
    month: Number(mealEntryObj.month),
    day: Number(mealEntryObj.day),
    mealName: mealEntryObj.mealName,
    lastModified: mealEntryObj.lastModified,
    tzMinutes: mealEntryObj.tzMinutes,
    consumable_id: Number(mealEntryObj.consumable_id),
    consumableName: mealEntryObj.consumableName,
    consumableBrand: mealEntryObj.consumableBrand,
    consumableType: mealEntryObj.consumableType || "",
    serving: mealEntryObj.serving,
    units: mealEntryObj.units,
    nutritionalValue: nutriValueValidateRes.nutritionalValue,
    entry_id: mealEntryObj.entry_id,
  };

  return { mealEntry };
}

// TODO - Remove and use MealIdentifier class
function FMTValidateMealIdentifier(mealIdentifierObj): {
  error?: string;
  mealIdentifier?: IMealIdentifier;
} {
  if (
    !isNumber(mealIdentifierObj.meal_year) ||
    !Number.isInteger(Number(mealIdentifierObj.meal_year)) ||
    !(Number(mealIdentifierObj.meal_year) > 0)
  ) {
    return {
      error: `Meal Year must be a positive integer. Got (${mealIdentifierObj.meal_year})`,
    };
  }
  if (
    !isNumber(mealIdentifierObj.meal_month) ||
    !Number.isInteger(Number(mealIdentifierObj.meal_month)) ||
    !(
      Number(mealIdentifierObj.meal_month) >= 0 &&
      Number(mealIdentifierObj.meal_month) < 12
    )
  ) {
    return {
      error: `Meal Month must be a valid Month number. Got (${mealIdentifierObj.meal_month})`,
    };
  }
  if (
    !isNumber(mealIdentifierObj.meal_day) ||
    !Number.isInteger(Number(mealIdentifierObj.meal_day)) ||
    !(
      Number(mealIdentifierObj.meal_day) > 0 &&
      Number(mealIdentifierObj.meal_day) < 32
    )
  ) {
    return {
      error: `Meal Day must be an integer in range of 1-31. Got (${mealIdentifierObj.meal_day})`,
    };
  }
  if (
    !isNumber(mealIdentifierObj.profile_id) ||
    !Number.isInteger(Number(mealIdentifierObj.profile_id))
  ) {
    return {
      error: `Profile ID must be a valid integer. Got (${mealIdentifierObj.profile_id})`,
    };
  }

  const mealIdentifier = {
    meal_year: Number(mealIdentifierObj.meal_year),
    meal_month: Number(mealIdentifierObj.meal_month),
    meal_day: Number(mealIdentifierObj.meal_day),
    profile_id: Number(mealIdentifierObj.profile_id),
    meal_name: mealIdentifierObj.meal_name || null,
  };

  return { mealIdentifier };
}

// TODO - Remove and use UserGoals class
function FMTValidateUserGoals(userGoalsObj): {
  error?: string;
  userGoals?: IUserGoals;
} {
  //Validate profile_id, year, month, day as a meal Identifier Object will null Meal Name
  const mealIdentifierObj = {
    meal_year: userGoalsObj.year,
    meal_month: userGoalsObj.month,
    meal_day: userGoalsObj.day,
    profile_id: userGoalsObj.profile_id,
  };
  const mealIdentifierValidate = FMTValidateMealIdentifier(mealIdentifierObj);
  if (
    mealIdentifierValidate.mealIdentifier == null ||
    mealIdentifierValidate.error != null
  ) {
    return { error: mealIdentifierValidate.error };
  }
  const userGoals = {
    year: mealIdentifierValidate.mealIdentifier.meal_year,
    month: mealIdentifierValidate.mealIdentifier.meal_month,
    day: mealIdentifierValidate.mealIdentifier.meal_day,
    profile_id: mealIdentifierValidate.mealIdentifier.profile_id,
  };

  const macroSplitValidate = FMTValidateMacroSplit(userGoalsObj.macroSplit);
  if (
    macroSplitValidate.macroSplit == null ||
    macroSplitValidate.error != null
  ) {
    return { error: macroSplitValidate.error };
  }

  //TODO mealSplit and microSplit
  return {
    userGoals: { ...userGoals, macroSplit: macroSplitValidate.macroSplit },
  };
}

function FMTValidateRecipeObject(
  recipeObj,
  unitsChart
): { error?: string; recipe?: any } {
  unitsChart = unitsChart || fmtAppInstance.unitsChart;
  if (recipeObj.recipeName == null || recipeObj.recipeName === "") {
    return { error: "Recipe Name must not be empty" };
  }
  if (
    !isNumber(recipeObj.referenceServing) ||
    Number(recipeObj.referenceServing) <= 0
  ) {
    return { error: "Serving must be positive number" };
  }
  if (recipeObj.units == null) {
    return { error: "Invalid units" };
  }
  if (
    !(Array.isArray(recipeObj.ingredients) && recipeObj.ingredients.length > 0)
  ) {
    return { error: "You must have at least one ingredient!" };
  }

  const nutriValuesArr = [];
  const ingredients = [];
  const preparationSteps = [];

  recipeObj.ingredients.forEach((item, i) => {
    const validateIngredient = FMTValidateFoodObject(
      item,
      fmtAppInstance.unitsChart
    );
    if (validateIngredient.error != null || validateIngredient.food == null) {
      const error = `Ingredient number ${
        i + 1
      } is invalid or corrupted. Please remove it`;
      return { error };
    }
    ingredients.push(validateIngredient.food);
    nutriValuesArr.push(validateIngredient.food.nutritionalValue);
  });
  const nutritionalValue = FMTSumNutritionalValues(nutriValuesArr, unitsChart);

  if (Array.isArray(recipeObj.preparationSteps)) {
    for (let p = 0; p < recipeObj.preparationSteps.length; p++) {
      const step = recipeObj.preparationSteps[p];
      if (step) {
        preparationSteps.push(step.toString());
      }
    }
  }

  const recipe = {
    recipeName: recipeObj.recipeName,
    referenceServing: Number(recipeObj.referenceServing),
    units: recipeObj.units,
    tzMinutes: recipeObj.tzMinutes,
    lastModified: recipeObj.lastModified,
    recipeCreator: isString(recipeObj.recipeCreator) && recipeObj.recipeCreator,
    recipeDescription:
      isString(recipeObj.recipeDescription) && recipeObj.recipeDescription,
    website: isString(recipeObj.website) && recipeObj.website,
    videoUrl: isString(recipeObj.videoUrl) && recipeObj.videoUrl,
    nutritionalValue,
    preparationSteps,
  };

  return { recipe };
}

//Functions - DB - Meal Entries
function FMTAddMealEntry(mealEntryObj, onsuccessFn, onerrorFn) {
  const res = FMTValidateMealEntry(mealEntryObj);
  if (res.error != null || res.mealEntry == null) {
    onerrorFn =
      onerrorFn ||
      function () {
        console.error(res.error);
      };
    return onerrorFn();
  }
  let mealEntry = res.mealEntry;
  const date = new Date();
  mealEntry.lastModified = date.toISOString();
  mealEntry.tzMinutes = date.getTimezoneOffset();
  let mealEntriesStore = getObjectStore(
    fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE,
    IDBTransactionModes.Readwrite
  );
  let addRequest = mealEntriesStore.add(mealEntry);
  addRequest.onerror = onerrorFn;
  addRequest.onsuccess = onsuccessFn;
}
function FMTUpdateMealEntry(entry_id, mealEntryObj, onsuccessFn, onerrorFn) {
  mealEntryObj.entry_id = entry_id;
  const res = FMTValidateMealEntry(mealEntryObj);
  if (res.error != null || res.mealEntry == null) {
    onerrorFn =
      onerrorFn ||
      function (error) {
        console.error(error);
      };
    return onerrorFn(res.error);
  }
  let mealEntry = res.mealEntry;
  const date = new Date();
  mealEntry.lastModified = date.toISOString();
  mealEntry.tzMinutes = date.getTimezoneOffset();
  let mealEntriesStore = getObjectStore(
    fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE,
    IDBTransactionModes.Readwrite
  );
  let updateRequest = mealEntriesStore.put(mealEntry);
  updateRequest.onerror = onerrorFn;
  updateRequest.onsuccess = onsuccessFn;
}
function FMTRemoveMealEntry(entry_id, onsuccessFn, onerrorFn) {
  let mealEntriesStore = getObjectStore(
    fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE,
    IDBTransactionModes.Readwrite
  );
  let deleteRequest = mealEntriesStore.delete(entry_id);
  deleteRequest.onerror = onerrorFn;
  deleteRequest.onsuccess = onsuccessFn;
}
function FMTQueryMealEntriesByProfileAndDate(
  profile_id,
  year,
  month,
  day,
  onsuccessFn,
  onerrorFn,
  options
) {
  /*options{"queryType": "only"|"bound"|"lowerBound"|"upperBound",
  "lowerOpen":false|true, "upperOpen":false|true, "yYear":int, "yMonth":int, "yDay":int,
  "yProfileId": int", "direction": "next"|"nextunique"|"prev"|"prevunique"}*/
  if (!options) {
    options = { queryType: "only" };
  }
  options.lowerOpen =
    options.lowerOpen == undefined ? false : options.lowerOpen;
  options.upperOpen =
    options.upperOpen == undefined ? false : options.upperOpen;
  options.yYear = options.yYear == undefined ? year : options.yYear;
  options.yMonth = options.yMonth == undefined ? month : options.yMonth;
  options.yDay = options.yDay == undefined ? day : options.yDay;
  options.yProfileId =
    options.yProfileId == undefined ? profile_id : options.yProfileId;
  options.direction =
    fmtAppGlobals.FMT_DB_CURSOR_DIRS.indexOf(options.direction) < 0
      ? "next"
      : options.direction;

  //TODO validate year month day
  let keyRange = null;
  switch (options.queryType) {
    //Doesn't make a lot of sense to use either upperBound or lowerBound because we will then
    //retreive meal entries that belong to other users (via differing profile_ids)
    // It is included for completeness
    case "upperBound":
      keyRange = IDBKeyRange.upperBound(
        [profile_id, year, month, day],
        options.upperOpen
      );
      break;
    case "lowerBound":
      keyRange = IDBKeyRange.lowerBound(
        [profile_id, year, month, day],
        options.lowerOpen
      );
      break;
    case "bound":
      keyRange = IDBKeyRange.bound(
        [profile_id, year, month, day],
        [options.yProfileId, options.yYear, options.yMonth, options.yDay],
        options.lowerOpen,
        options.upperOpen
      );
      break;
    case "only":
      keyRange = IDBKeyRange.only([profile_id, year, month, day]);
      break;
    default:
      break;
  }
  onsuccessFn =
    onsuccessFn ||
    function () {
      console.debug(
        "[FMTQueryMealEntriesByProfileAndDate] onsuccess - ",
        keyRange,
        options
      );
    };
  onerrorFn =
    onerrorFn ||
    function () {
      console.debug(
        "[FMTQueryMealEntriesByProfileAndDate] onerror - ",
        keyRange,
        options
      );
    };
  const pid_date_index = getIndex(
    fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE,
    "profile_id_date_index"
  );
  const cursorRequest = pid_date_index.openCursor(keyRange, options.direction);
  cursorRequest.onerror = onerrorFn;
  cursorRequest.onsuccess = onsuccessFn;
}
function FMTReadMealEntry(entry_id, onsuccessFn, onerrorFn) {
  const _fnName = "FMTReadMealEntry";
  onsuccessFn =
    onsuccessFn ||
    function (e) {
      console.debug(`[${_fnName}] onsuccess - `, entry_id, e);
    };
  onerrorFn =
    onerrorFn ||
    function (e) {
      console.debug(`[${_fnName}] onerror - `, entry_id, e);
    };
  const mealEntriesStore = getObjectStore(
    fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE,
    IDBTransactionModes.Readonly
  );
  const getRequest = mealEntriesStore.get(entry_id);
  getRequest.onerror = onerrorFn;
  getRequest.onsuccess = onsuccessFn;
}

//Functions - DB - Profile
// TODO - Delete
function FMTReadProfile(profileId, onsuccessFn, onerrorFn) {
  if (isNaN(profileId)) {
    const msg = `Invalid profile_id ${profileId}`;
    onerrorFn =
      onerrorFn ||
      function () {
        console.error(msg);
      };
    return onerrorFn(msg);
  }
  let profileStore = getObjectStore(
    fmtAppGlobals.FMT_DB_PROFILES_STORE,
    IDBTransactionModes.Readonly
  );
  let getRequest = profileStore.get(profileId);
  getRequest.onerror =
    onerrorFn ||
    function () {
      console.error(`Failed getting Profile id ${profileId}`);
    };
  getRequest.onsuccess = onsuccessFn;
}
// TODO - Delete
function FMTReadAllProfiles(onsuccessFn, onerrorFn) {
  let profileStore = getObjectStore(
    fmtAppGlobals.FMT_DB_PROFILES_STORE,
    IDBTransactionModes.Readonly
  );
  let getRequest = profileStore.getAll();
  getRequest.onerror = onerrorFn;
  getRequest.onsuccess = onsuccessFn;
}
// TODO - Delete
function FMTUpdateProfile(profileId, profileObj, onsuccessFn, onerrorFn) {
  profileObj.profile_id = profileId;
  let result;
  try {
    result = UserProfile.fromObject(profileObj, new Date());
  } catch (err) {
    onerrorFn =
      onerrorFn ||
      function () {
        console.error(err);
      };
    return onerrorFn(err);
  }
  const profile = result;
  let profileStore = getObjectStore(
    fmtAppGlobals.FMT_DB_PROFILES_STORE,
    IDBTransactionModes.Readwrite
  );
  let updateRequest = profileStore.put(profile);
  updateRequest.onerror =
    onerrorFn ||
    function () {
      console.error(`Failed updating Profile id ${profileId}`);
    };
  updateRequest.onsuccess = function (event) {
    onsuccessFn =
      onsuccessFn ||
      function () {
        console.debug(`Success updating Profile id ${profileId}`);
      };
    onsuccessFn(event, profile);
  };
}

//Functions - DB - Foods
function FMTReadFood(foodId, onsuccessFn, onerrorFn) {
  let foodStore = getObjectStore(
    fmtAppGlobals.FMT_DB_FOODS_STORE,
    IDBTransactionModes.Readonly
  );
  let getRequest = foodStore.get(foodId);
  getRequest.onerror = onerrorFn;
  getRequest.onsuccess = onsuccessFn;
}
function FMTReadAllFoods(onsuccessFn, onerrorFn) {
  let foodStore = getObjectStore(
    fmtAppGlobals.FMT_DB_FOODS_STORE,
    IDBTransactionModes.Readonly
  );
  let getRequest = foodStore.getAll();
  getRequest.onerror = onerrorFn;
  getRequest.onsuccess = onsuccessFn;
}
function FMTIterateFoods(onsuccessFn, onerrorFn) {
  /*onsuccessFn must implement success function accessing the cursor*/
  onerrorFn =
    onerrorFn ||
    function (e) {
      console.error(`[FMTIterateFoods] - ${e}`);
    };
  let foodStore = getObjectStore(
    fmtAppGlobals.FMT_DB_FOODS_STORE,
    IDBTransactionModes.Readonly
  );
  let getRequest = foodStore.openCursor();
  getRequest.onerror = onerrorFn;
  getRequest.onsuccess = onsuccessFn;
}
function FMTAddFood(foodObj, unitsChart, onsuccessFn, onerrorFn) {
  const _fnName = "FMTAddFood";
  unitsChart = unitsChart || fmtAppInstance.unitsChart;
  const result = FMTValidateFoodObject(foodObj, unitsChart);
  const food = result.food;
  if (food != null && result.error == null) {
    let date = new Date();
    food.lastModified = date.toISOString();
    food.tzMinutes = date.getTimezoneOffset();
    let foodStore = getObjectStore(
      fmtAppGlobals.FMT_DB_FOODS_STORE,
      IDBTransactionModes.Readwrite
    );
    let addRequest = foodStore.add(food);
    addRequest.onerror =
      onerrorFn ||
      function () {
        console.debug(
          `[${_fnName}] - failed adding food object - ${JSON.stringify(food)}`
        );
      };
    addRequest.onsuccess =
      function (e) {
        onsuccessFn(e, food);
      } ||
      function () {
        console.debug(
          `[${_fnName}] - food object added successfully ${JSON.stringify(
            food
          )}`
        );
      };
  } else {
    onerrorFn =
      onerrorFn ||
      function () {
        console.debug(
          `[${_fnName}] - food object validation failed - ${JSON.stringify(
            foodObj
          )}`
        );
      };
    onerrorFn(result.error);
  }
}
function FMTUpdateFood(foodId, foodObj, unitsChart, onsuccessFn, onerrorFn) {
  const _fnName = "FMTUpdateFood";
  unitsChart = unitsChart || fmtAppInstance.unitsChart;
  const result = FMTValidateFoodObject(foodObj, unitsChart);
  const food = result.food;
  if (food != null && result.error == null) {
    let date = new Date();
    food.lastModified = date.toISOString();
    food.tzMinutes = date.getTimezoneOffset();
    food.food_id = foodId;
    let foodStore = getObjectStore(
      fmtAppGlobals.FMT_DB_FOODS_STORE,
      IDBTransactionModes.Readwrite
    );
    let addRequest = foodStore.put(food);
    addRequest.onerror =
      onerrorFn ||
      function () {
        console.debug(
          `[${_fnName}] - failed updating food object - ${JSON.stringify(food)}`
        );
      };
    addRequest.onsuccess =
      function (e) {
        onsuccessFn(e, food);
      } ||
      function () {
        console.debug(
          `[${_fnName}] - food object updated successfully ${JSON.stringify(
            food
          )}`
        );
      };
  } else {
    onerrorFn =
      onerrorFn ||
      function () {
        console.debug(
          `[${_fnName}] - food object validation failed - ${JSON.stringify(
            foodObj
          )}`
        );
      };
    onerrorFn(result.error);
  }
}
function FMTDeleteFood(foodId, onsuccessFn, onerrorFn) {
  const _fnName = "FMTDeleteFood";
  let foodStore = getObjectStore(
    fmtAppGlobals.FMT_DB_FOODS_STORE,
    IDBTransactionModes.Readwrite
  );
  let delRequest = foodStore.delete(foodId);
  delRequest.onerror =
    onerrorFn ||
    function (e) {
      console.debug(
        `[${_fnName}] - failed deleting food object ${JSON.stringify(
          e.target.result
        )}`
      );
    };
  delRequest.onsuccess =
    onsuccessFn ||
    function (e) {
      console.debug(
        `[${_fnName}] - food object deleted successfully ${JSON.stringify(
          e.target.result
        )}`
      );
    };
}

//Functions - DB - Recipes
function FMTReadRecipe(recipeId, onsuccessFn, onerrorFn) {
  let recipeStore = getObjectStore(
    fmtAppGlobals.FMT_DB_RECIPES_STORE,
    IDBTransactionModes.Readonly
  );
  let getRequest = recipeStore.get(recipeId);
  getRequest.onerror = onerrorFn;
  getRequest.onsuccess = onsuccessFn;
}
function FMTReadAllRecipes(onsuccessFn, onerrorFn) {
  let recipeStore = getObjectStore(
    fmtAppGlobals.FMT_DB_RECIPES_STORE,
    IDBTransactionModes.Readonly
  );
  let getRequest = recipeStore.getAll();
  getRequest.onerror = onerrorFn;
  getRequest.onsuccess = onsuccessFn;
}
function FMTIterateRecipes(onsuccessFn, onerrorFn) {
  let recipeStore = getObjectStore(
    fmtAppGlobals.FMT_DB_RECIPES_STORE,
    IDBTransactionModes.Readonly
  );
  let cursorRequest = recipeStore.openCursor();
  cursorRequest.onerror = onerrorFn;
  cursorRequest.onsuccess = onsuccessFn;
}
function FMTAddRecipe(recipeObj, onsuccessFn, onerrorFn, unitsChart) {
  const _fnName = "FMTAddRecipe";
  unitsChart = unitsChart || fmtAppInstance.unitsChart;
  const result = FMTValidateRecipeObject(recipeObj, unitsChart);
  const recipe = result.recipe;
  if (recipe != null && result.error == null) {
    let date = new Date();
    recipe.lastModified = date.toISOString();
    recipe.tzMinutes = date.getTimezoneOffset();
    const _onerror = isFunction(onerrorFn)
      ? function (e) {
          onerrorFn(e, recipe);
        }
      : function () {
          console.debug(
            `[${_fnName}] - failed adding recipe object - ${JSON.stringify(
              recipe
            )}`
          );
        };
    const _onsuccess = isFunction(onsuccessFn)
      ? function (e) {
          recipe.recipe_id = e.target.result;
          onsuccessFn(e, recipe);
        }
      : function () {
          console.debug(
            `[${_fnName}] - recipe object added successfully ${JSON.stringify(
              recipe
            )}`
          );
        };
    let recipeStore = getObjectStore(
      fmtAppGlobals.FMT_DB_RECIPES_STORE,
      IDBTransactionModes.Readwrite
    );
    let addRequest = recipeStore.add(recipe);
    addRequest.onerror = _onerror;
    addRequest.onsuccess = _onsuccess;
  } else {
    onerrorFn =
      onerrorFn ||
      function () {
        console.debug(
          `[${_fnName}] - recipe object validation failed - ${JSON.stringify(
            recipeObj
          )}`
        );
      };
    onerrorFn(result.error, recipeObj);
  }
}
function FMTUpdateRecipe(
  recipeId,
  recipeObj,
  onsuccessFn,
  onerrorFn,
  unitsChart
) {
  const _fnName = "FMTUpdateRecipe";
  unitsChart = unitsChart || fmtAppInstance.unitsChart;
  const result = FMTValidateRecipeObject(recipeObj, unitsChart);
  const recipe = result.recipe;
  if (recipe != null && result.error == null) {
    let date = new Date();
    recipe.lastModified = date.toISOString();
    recipe.tzMinutes = date.getTimezoneOffset();
    recipe.recipe_id = recipeId;
    const _onerror = isFunction(onerrorFn)
      ? function (e) {
          onerrorFn(e, recipe);
        }
      : function () {
          console.debug(
            `[${_fnName}] - failed updating recipe object - ${JSON.stringify(
              recipe
            )}`
          );
        };
    const _onsuccess = isFunction(onsuccessFn)
      ? function (e) {
          onsuccessFn(e, recipe);
        }
      : function () {
          console.debug(
            `[${_fnName}] - recipe object updated successfully ${JSON.stringify(
              recipe
            )}`
          );
        };
    let recipeStore = getObjectStore(
      fmtAppGlobals.FMT_DB_RECIPES_STORE,
      IDBTransactionModes.Readwrite
    );
    let putRequest = recipeStore.put(recipe);
    putRequest.onerror = _onerror;
    putRequest.onsuccess = _onsuccess;
  } else {
    onerrorFn =
      onerrorFn ||
      function () {
        console.debug(
          `[${_fnName}] - recipe object validation failed - ${JSON.stringify(
            recipeObj
          )}`
        );
      };
    onerrorFn(result.error, recipeObj);
  }
}
function FMTDeleteRecipe(recipeId, onsuccessFn, onerrorFn) {
  const _fnName = "FMTDeleteRecipe";
  let recipeStore = getObjectStore(
    fmtAppGlobals.FMT_DB_RECIPES_STORE,
    IDBTransactionModes.Readwrite
  );
  let delRequest = recipeStore.delete(recipeId);
  delRequest.onerror =
    onerrorFn ||
    function (e) {
      console.debug(
        `[${_fnName}] - failed deleting recipe object ${JSON.stringify(
          e.target.result
        )}`
      );
    };
  delRequest.onsuccess =
    onsuccessFn ||
    function (e) {
      console.debug(
        `[${_fnName}] - recipe object deleted successfully ${JSON.stringify(
          e.target.result
        )}`
      );
    };
}

//Functions - DB - Nutrients
// TODO - Delete
function FMTReadAllNutrients(onsuccessFn, onerrorFn) {
  let nutrientStore = getObjectStore(
    fmtAppGlobals.FMT_DB_NUTRIENTS_STORE,
    IDBTransactionModes.Readonly
  );
  let readRequest = nutrientStore.getAll();
  readRequest.onsuccess =
    onsuccessFn ||
    function (e) {
      console.debug(`[FMTReadAllNutrients.onsuccess] - ${JSON.stringify(e)}`);
    };
  readRequest.onerror =
    onerrorFn ||
    function (e) {
      console.debug(`[FMTReadAllNutrients.onerror] - ${JSON.stringify(e)}`);
    };
}
function FMTIterateNutrients(onsuccessFn, onerrorFn) {
  /*onsuccessFn must implement success function accessing the cursor*/
  let nutrientStore = getObjectStore(
    fmtAppGlobals.FMT_DB_NUTRIENTS_STORE,
    IDBTransactionModes.Readonly
  );
  let readRequest = nutrientStore.openCursor();
  readRequest.onsuccess =
    onsuccessFn ||
    function (e) {
      console.debug(`[FMTIterateNutrients.onsuccess] - ${JSON.stringify(e)}`);
    };
  readRequest.onerror =
    onerrorFn ||
    function (e) {
      console.debug(`[FMTIterateNutrients.onerror] - ${JSON.stringify(e)}`);
    };
}

//Functions - DB - Units
// TODO - Remove and use repository method
function FMTReadAllUnits(onsuccessFn, onerrorFn) {
  let unitStore = getObjectStore(
    fmtAppGlobals.FMT_DB_UNITS_STORE,
    IDBTransactionModes.Readonly
  );
  let readRequest = unitStore.getAll();
  readRequest.onsuccess =
    onsuccessFn || console.debug(`Successfully read all units`);
  readRequest.onerror = onerrorFn || console.debug(`Failed reading all units`);
}
function FMTIterateUnits(onsuccessFn, onerrorFn) {
  let unitStore = getObjectStore(
    fmtAppGlobals.FMT_DB_UNITS_STORE,
    IDBTransactionModes.Readonly
  );
  let readRequest = unitStore.openCursor();
  readRequest.onsuccess =
    onsuccessFn || console.debug(`Successfully iterate unit`);
  readRequest.onerror = onerrorFn || console.debug(`Failed units iteration`);
}

//Functions - DB - User Goals
function FMTAddUserGoalEntry(userGoalsObj, onsuccessFn, onerrorFn) {
  const userGoalsValidate = FMTValidateUserGoals(userGoalsObj);
  if (userGoalsValidate.userGoals == null || userGoalsValidate.error != null) {
    onerrorFn =
      onerrorFn ||
      function () {
        console.error(userGoalsValidate.error);
      };
    return onerrorFn();
  }
  const userGoalsStore = getObjectStore(
    fmtAppGlobals.FMT_DB_USER_GOALS_STORE,
    IDBTransactionModes.Readwrite
  );
  const addRequest = userGoalsStore.add(userGoalsValidate.userGoals);
  addRequest.onsuccess = onsuccessFn;
  addRequest.onerror =
    onerrorFn ||
    function (e) {
      console.error("failed adding user goal entry", e);
    };
}
function FMTUpdateUserGoalEntry(
  profile_id: RecordId,
  year: number,
  month: number,
  day: number,
  userGoalsDataObj: IUserGoals,
  onsuccessFn: any,
  onerrorFn?: any
) {
  userGoalsDataObj;
  userGoalsDataObj.year = year;
  userGoalsDataObj.month = month;
  userGoalsDataObj.day = day;
  userGoalsDataObj.profile_id = profile_id;
  const userGoalsValidate = FMTValidateUserGoals(userGoalsDataObj);
  if (userGoalsValidate.userGoals == null || userGoalsValidate.error != null) {
    onerrorFn =
      onerrorFn ||
      function () {
        console.error(userGoalsValidate.error);
      };
    onerrorFn();
  }
  const userGoalsStore = getObjectStore(
    fmtAppGlobals.FMT_DB_USER_GOALS_STORE,
    IDBTransactionModes.Readwrite
  );
  const putRequest = userGoalsStore.put(userGoalsValidate.userGoals);
  putRequest.onsuccess = onsuccessFn;
  putRequest.onerror = onerrorFn;
}
function FMTReadUserGoalEntry(
  profile_id,
  year,
  month,
  day,
  onsuccessFn,
  onerrorFn
) {
  const userGoalsStore = getObjectStore(
    fmtAppGlobals.FMT_DB_USER_GOALS_STORE,
    IDBTransactionModes.Readonly
  );
  const getRequest = userGoalsStore.get([profile_id, year, month, day]);
  getRequest.onsuccess = onsuccessFn;
  getRequest.onerror = onerrorFn;
}
function FMTQueryUserGoalsByProfileAndDate(
  profile_id,
  year,
  month,
  day,
  onsuccessFn,
  onerrorFn,
  options
) {
  const _fnName = "FMTQueryUserGoalsByProfileAndDate";
  if (!options) {
    options = { queryType: "only" };
  }
  options.lowerOpen =
    options.lowerOpen == undefined ? false : options.lowerOpen;
  options.upperOpen =
    options.upperOpen == undefined ? false : options.upperOpen;
  options.yYear = options.yYear == undefined ? year : options.yYear;
  options.yMonth = options.yMonth == undefined ? month : options.yMonth;
  options.yDay = options.yDay == undefined ? day : options.yDay;
  options.yProfileId =
    options.yProfileId == undefined ? profile_id : options.yProfileId;
  options.direction =
    fmtAppGlobals.FMT_DB_CURSOR_DIRS.indexOf(options.direction) < 0
      ? "next"
      : options.direction;
  options.queryType =
    options.queryType == undefined ? "only" : options.queryType;

  //TODO validate year month day
  let keyRange = null;
  switch (options.queryType) {
    case "upperBound":
      keyRange = IDBKeyRange.upperBound(
        [profile_id, year, month, day],
        options.upperOpen
      );
      break;
    case "lowerBound":
      keyRange = IDBKeyRange.lowerBound(
        [profile_id, year, month, day],
        options.lowerOpen
      );
      break;
    case "bound":
      keyRange = IDBKeyRange.bound(
        [profile_id, year, month, day],
        [options.yProfileId, options.yYear, options.yMonth, options.yDay],
        options.lowerOpen,
        options.upperOpen
      );
      break;
    case "only":
    default:
      keyRange = IDBKeyRange.only([profile_id, year, month, day]);
      break;
  }
  onsuccessFn =
    onsuccessFn ||
    function () {
      console.debug(`[${_fnName}] onsuccess - `, keyRange, options);
    };
  onerrorFn =
    onerrorFn ||
    function () {
      console.debug(`[${_fnName}] onerror - `, keyRange, options);
    };
  const userGoalsStore = getObjectStore(
    fmtAppGlobals.FMT_DB_USER_GOALS_STORE,
    IDBTransactionModes.Readonly
  );
  const cursorRequest = userGoalsStore.openCursor(keyRange, options.direction);
  cursorRequest.onerror = onerrorFn;
  cursorRequest.onsuccess = onsuccessFn;
}

//Functions - UI - Generic
function FMTShowAlert(divId, alertLevel, msg, scrollOptions = undefined) {
  // Use Platform Interface if available
  if (platformInterface.hasPlatformInterface) {
    platformInterface.FMTShowAlert(msg, alertLevel);
  } else {
    let alertDiv = document.getElementById(divId);
    let alertElem = `<div class="alert alert-${alertLevel} col-11 col-lg-8 mb-1 alert-dismissible fade show" role="alert">${msg}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
    alertDiv.innerHTML = alertElem;
    if (scrollOptions) {
      window.scroll(scrollOptions);
    }
    setTimeout(() => {
      let _ = document.getElementById(divId).getElementsByTagName("button");
      if (_.length > 0) _[0].click();
    }, 5000);
  }
}
// Shows a Snackbar on mobile platform or Alert on web
function FMTShowAlertBar(msg, divId, alertLevel) {
  if (platformInterface.hasPlatformInterface) {
    platformInterface.FMTShowAlertBar(msg);
  } else {
    FMTShowAlert(divId, alertLevel, msg);
  }
}
function _FMTDropdownToggleValue(elem, text, attributes, skipEvent) {
  if (elem) {
    elem.innerHTML = text;
    let attributeNames = Object.keys(attributes);
    for (let j = 0; j < attributeNames.length; j++) {
      let attrName = attributeNames[j];
      let attrValue = attributes[attrName];
      elem.setAttribute(attrName, attrValue);
    }
    if (!skipEvent) {
      elem.dispatchEvent(new Event("unitChanged"));
    }
  }
}
function FMTDropdownToggleValue(targetDivId, text, attributes, skipEvent) {
  let elem = document.getElementById(targetDivId);
  _FMTDropdownToggleValue(elem, text, attributes, skipEvent);
}
function FMTShowPrompt(divId, alertLevel, msg, scrollOptions, oncompleteFn) {
  /*oncompleteFn - User defined functions that takes a boolean based on if user
   * clicked "Yes" or "No"
   */
  if (platformInterface.hasPlatformInterface) {
    platformInterface.userPromptPlatformCallback = function (res) {
      oncompleteFn(res);
      platformInterface.userPromptPlatformCallback = null;
    };
    platformInterface.FMTShowPrompt(msg, alertLevel);
  } else {
    let alertDiv = document.getElementById(divId);
    let alertElem = `<div class="alert alert-${alertLevel} alert-dismissible fade show row col-11 col-lg-8" role="alert">
    <div class="col">
    <span>${msg}</span>
    </div>
    <div class="w-100"></div>
    <div class="col input-group mt-2 d-flex justify-content-around">
        <button type="button" class="btn btn-outline-dark" id="__${divId}__yes" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">Yes</span></button>
        <button type="button" class="btn btn-outline-dark" id="__${divId}__no" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">No</span></button>
    </div>
</div>`;
    alertDiv.innerHTML = alertElem;
    if (scrollOptions) {
      window.scroll(scrollOptions);
    }
    if (oncompleteFn) {
      $(`#__${divId}__yes`).click(function () {
        oncompleteFn(true);
      });
      $(`#__${divId}__no`).click(function () {
        oncompleteFn(false);
      });
    }
  }
}
function FMTUICreateTextArea(
  type,
  labelText,
  placeholder,
  id,
  readonly,
  containerClasses,
  textareaClasses
) {
  switch (type) {
    case "input":
    case "textarea":
      break;
    default:
      return;
  }
  const column = document.createElement("div");
  // column.classList.add("col-12", "col-lg-8");
  if (Array.isArray(containerClasses)) {
    containerClasses.forEach((cls) => {
      column.classList.add(cls);
    });
  }
  const form = document.createElement("div");
  form.classList.add("form__group", "d-flex", "fmt-align-end");
  const textarea = document.createElement(type);
  textarea.classList.add("form__field");
  textarea.setAttribute("type", "text");
  if (Array.isArray(textareaClasses)) {
    textareaClasses.forEach((cls) => {
      textarea.classList.add(cls);
    });
  }
  const label = document.createElement("label");
  label.classList.add("form__label");
  if (placeholder) {
    textarea.setAttribute("placeholder", placeholder);
  }
  if (id) {
    textarea.setAttribute("id", id);
    label.setAttribute("for", id);
  }
  if (readonly === true) {
    textarea.setAttribute("readonly", "true");
  }
  form.appendChild(textarea);
  if (labelText) {
    label.innerHTML = labelText;
    form.appendChild(label);
  }
  column.appendChild(form);
  return column;
}
//Functions - UI - Profile
function FMTConvertMacro(macroName, unit, value, calories) {
  const result = {};
  let kcal, percent, gram;
  const factor = macroName === "fat" ? 9 : 4;
  if (isNumber(value) && Number(value) >= 0) {
    value = Number(value);
    calories =
      isNumber(calories) && Number(calories) >= 0
        ? Number(calories)
        : undefined;
    switch (unit) {
      case "%":
        if (isPercent(value)) {
          percent = Number(roundedToFixed(value, DEFAULT_ROUNDING_PRECISION));
          if (calories) {
            kcal = (calories * percent) / 100;
            gram = kcal / factor;
            kcal = Math.round(kcal);
            gram = Math.round(gram);
          }
        }
        break;
      case "g":
        gram = Math.round(value);
        kcal = gram * factor;
        if (!!calories && calories > 0) {
          percent = Number(
            roundedToFixed((kcal / calories) * 100, DEFAULT_ROUNDING_PRECISION)
          );
        }
        kcal = Math.round(kcal);
        break;
      case "kCal":
        kcal = Math.round(value);
        gram = Math.round(kcal / factor);
        if (!!calories && calories > 0) {
          percent = Number(
            roundedToFixed((kcal / calories) * 100, DEFAULT_ROUNDING_PRECISION)
          );
        }
        break;
    }
    result["%"] = percent;
    result["g"] = gram;
    result["kCal"] = kcal;
  }
  return result;
}
function FMTProfileStorePreviousSelection(e) {
  const previousOpt = e.currentTarget.value;
  // FIXME - Don't store state in DOM attributes!
  e.currentTarget.setAttribute(PREVIOUS_UNIT_ATTR, previousOpt);
}
function FMTProfileSelectActivityLevel(
  activityLevel,
  multiplierDivId,
  levelDivId
) {
  const DOMActiveLevel = document.getElementById(levelDivId);
  const DOMActiveLevelMult = document.getElementById(multiplierDivId);
  if (fmtAppGlobals.supportedActivityLevels.indexOf(activityLevel) < 0) {
    // @ts-ignore
    DOMActiveLevel.value = "";
    DOMActiveLevel.setAttribute("level", "");
    // @ts-ignore
    DOMActiveLevelMult.value = "";
    DOMActiveLevelMult.setAttribute("readonly", "true");
    return;
  }
  // @ts-ignore
  DOMActiveLevel.value = activityLevel;
  DOMActiveLevel.setAttribute("level", activityLevel);
  if (activityLevel === "Custom") {
    DOMActiveLevelMult.removeAttribute("readonly");
    DOMActiveLevelMult.classList.remove("d-none");
    DOMActiveLevelMult.focus();
  } else {
    // @ts-ignore
    DOMActiveLevelMult.value =
      fmtAppGlobals.activityLevelsMultipliers[activityLevel];
    DOMActiveLevelMult.classList.remove("d-none");
    DOMActiveLevelMult.setAttribute("readonly", "true");
  }
}
function FMTProfileSelectSex(sex, divId) {
  const DOMSex = document.getElementById(divId);
  // @ts-ignore
  DOMSex.value = sex;
  DOMSex.setAttribute("sex", sex);
}
function FMTSetProfileMacroValue(
  unit,
  macroValueDiv,
  convertedValueDiv,
  convertedValues
) {
  // Sets the value and alternate values in the relevant Macro row
  const gram = convertedValues["g"];
  const percent = convertedValues["%"];
  const kcal = convertedValues["kCal"];
  switch (unit) {
    case "%":
      macroValueDiv.value = percent;
      if (gram) {
        convertedValueDiv.innerHTML = `${gram}g`;
      }
      if (kcal) {
        convertedValueDiv.innerHTML += `/${kcal}kCal`;
      }
      break;
    case "g":
      macroValueDiv.value = gram;
      if (kcal) {
        convertedValueDiv.innerHTML = `${kcal}kCal`;
      }
      if (percent) {
        convertedValueDiv.innerHTML += `/${percent}%`;
      }
      break;
    case "kCal":
      macroValueDiv.value = kcal;
      if (gram) {
        convertedValueDiv.innerHTML = `${gram}g`;
      }
      if (percent) {
        convertedValueDiv.innerHTML += `/${percent}%`;
      }
      break;
  }
}
function FMTProfileSelectMacroUnits(
  e,
  macroName,
  macroValueDivId,
  convertedValueDivId,
  caloriesDivId
) {
  /* "e" is jQuery Event, or an object containing a currentTarget
   ** key with value being the DOM element of the Unit select element
   */
  const newUnit = e.currentTarget.value;
  // FIXME - Don't store state in DOM attributes!
  const prevUnit = e.currentTarget.getAttribute(PREVIOUS_UNIT_ATTR);
  const macroValueDiv = document.getElementById(macroValueDivId);
  const convertedValueDiv = document.getElementById(convertedValueDivId);
  const caloriesDiv = document.getElementById(caloriesDivId);
  if (
    macroValueDiv == null ||
    convertedValueDiv == null ||
    caloriesDiv == null
  ) {
    return;
  }
  if (fmtAppGlobals.macroNames.indexOf(macroName) < 0) {
    console.error(`Unsupported Macro ${macroName}`);
    return;
  }
  if (fmtAppGlobals.supportedMacroUnits.indexOf(newUnit) < 0) {
    convertedValueDiv.innerHTML = "";
    macroValueDiv.innerHTML = "";
    console.error(`Unsupported units ${newUnit} for Macro`);
    return;
  }
  // @ts-ignore
  const calories = isNumber(caloriesDiv.value) ? Number(caloriesDiv.value) : 0;
  // @ts-ignore
  const value = isNumber(macroValueDiv.value)
    ? // @ts-ignore
      Number(macroValueDiv.value)
    : NaN;
  // @ts-ignore
  if (macroValueDiv.value == undefined || macroValueDiv.value == "") {
    convertedValueDiv.innerHTML = "";
    return;
  } else if (isNaN(value)) {
    convertedValueDiv.innerHTML = "";
    macroValueDiv.innerHTML = "";
    console.error(`Macro value is not a valid number`);
    return;
  }
  const convert = FMTConvertMacro(macroName, prevUnit, value, calories);
  FMTSetProfileMacroValue(newUnit, macroValueDiv, convertedValueDiv, convert);
}
function FMTUpdateProfileForm(profileId, onsuccessFn, onerrorFn) {
  if (isNaN(profileId)) {
    throw TypeError(`Invalid profile_id ${profileId}`);
  }
  document.getElementById("profile-alerts").innerHTML = "";
  let profile = {
    profile_id: profileId,
    // @ts-ignore
    name: document.getElementById("profile-name").value || null,
    // @ts-ignore
    bodyWeight: Number(document.getElementById("profile-weight").value),
    bodyWeightUnits: document.getElementById(
      "profile-weight-units"
      // @ts-ignore
    ).value,
    // @ts-ignore
    height: Number(document.getElementById("profile-height").value),
    // @ts-ignore
    heightUnits: document.getElementById("profile-height-units").value,
    // @ts-ignore
    age: Number(document.getElementById("profile-age").value),
    // @ts-ignore
    sex: document.getElementById("profile-sex").getAttribute("sex"),
    // @ts-ignore
    bodyfat: Number(document.getElementById("profile-bodyfat").value) || null,
    // @ts-ignore
    activityLevel: document
      .getElementById("profile-active-level")
      .getAttribute("level"),
    activityMultiplier: Number(
      document.getElementById(
        "profile-activity-mult"
        // @ts-ignore
      ).value
    ),
    formula: "Mifflin-St Jeor",
    macroSplit: null,
  };
  document
    .getElementById("profile-activity-mult")
    .setAttribute("readonly", "true");

  FMTReadProfile(
    profileId,
    function (e) {
      let res = e.target.result || {};
      profile.macroSplit = res?.macroSplit || null;
      console.debug(res);
      console.debug(profile);
      const onProfileUpdatedFn = function (event, updatedProfile) {
        fmtAppInstance.currentProfile = updatedProfile;
        console.debug(fmtAppInstance.currentProfile);
        if (onsuccessFn) {
          onsuccessFn(event, updatedProfile);
        }
      };
      FMTUpdateProfile(profileId, profile, onProfileUpdatedFn, onerrorFn);
    },
    onerrorFn
  );
}
function FMTFillMacro(baseID, nutrient, calories) {
  // Fills the macro specified by [nutrient] into macro form field
  // DOM structure idefntified by [baseID] and based on [calories]
  // Returns the converted values for [nutrient]
  if (calories <= 0) {
    console.warn("Calories must be greater than 0 to fill macroes");
    return;
  }
  let fatInput = document.getElementById(`${baseID}-fat`);
  let carbInput = document.getElementById(`${baseID}-carb`);
  let proteinInput = document.getElementById(`${baseID}-protein`);
  if (!(fatInput && carbInput && proteinInput)) {
    console.warn(`Couldn't find all required macroes inputs. Skipping.`);
    return;
  }
  // @ts-ignore
  let fat = isNumber(fatInput.value) ? Number(fatInput.value) : 0;
  // @ts-ignore
  let carb = isNumber(carbInput.value) ? Number(carbInput.value) : 0;
  // @ts-ignore
  let protein = isNumber(proteinInput.value) ? Number(proteinInput.value) : 0;
  // @ts-ignore
  let fatUnit = document.getElementById(`${baseID}-fat-units-select`).value;
  // @ts-ignore
  let carbUnit = document.getElementById(`${baseID}-carb-units-select`).value;
  let proteinUnit = document.getElementById(
    `${baseID}-protein-units-select`
    // @ts-ignore
  ).value;

  let fats, carbs, proteins;
  let percentFat, percentCarb, percentProtein;
  let diff;
  let resultsDiv = document.getElementById(`${baseID}-${nutrient}-result`);
  switch (nutrient) {
    case "protein":
      fats = FMTConvertMacro("fat", fatUnit, fat, calories);
      percentFat = fats["%"];
      carbs = FMTConvertMacro("carb", carbUnit, carb, calories);
      percentCarb = carbs["%"];
      diff = 100 - percentCarb - percentFat;
      percentProtein = diff >= 0 ? diff : 0;
      proteins = FMTConvertMacro("protein", "%", percentProtein, calories);
      FMTSetProfileMacroValue(proteinUnit, proteinInput, resultsDiv, proteins);
      return proteins;
    case "carb":
      fats = FMTConvertMacro("fat", fatUnit, fat, calories);
      percentFat = fats["%"];
      proteins = FMTConvertMacro("protein", proteinUnit, protein, calories);
      percentProtein = proteins["%"];
      diff = 100 - percentProtein - percentFat;
      percentCarb = diff >= 0 ? diff : 0;
      carbs = FMTConvertMacro("carb", "%", percentCarb, calories);
      FMTSetProfileMacroValue(carbUnit, carbInput, resultsDiv, carbs);
      return carbs;
    case "fat":
      carbs = FMTConvertMacro("carb", carbUnit, carb, calories);
      percentCarb = carbs["%"];
      proteins = FMTConvertMacro("protein", proteinUnit, protein, calories);
      percentProtein = proteins["%"];
      diff = 100 - percentProtein - percentCarb;
      percentFat = diff >= 0 ? diff : 0;
      fats = FMTConvertMacro("fat", "%", percentFat, calories);
      FMTSetProfileMacroValue(fatUnit, fatInput, resultsDiv, fats);
      return fats;
    default:
      console.warn(`Unknown nutrient ${nutrient}`);
  }
}
function FMTUpdateMacroesForm(profileId, onsuccessFn, onerrorFn) {
  if (isNaN(profileId)) {
    const msg = `Invalid profile_id ${profileId}`;
    onerrorFn = isFunction(onerrorFn)
      ? onerrorFn
      : function () {
          console.error(msg);
        };
    return onerrorFn(msg);
  }
  document.getElementById("profile-alerts").innerHTML = "";
  // @ts-ignore
  const proteinVal = document.getElementById("profile-macro-protein").value;
  // @ts-ignore
  const carbVal = document.getElementById("profile-macro-carb").value;
  // @ts-ignore
  const fatVal = document.getElementById("profile-macro-fat").value;
  // @ts-ignore
  const caloriesVal = document.getElementById("profile-daily-calories").value;
  const pSelect = document.getElementById("profile-macro-protein-units-select");
  const cSelect = document.getElementById("profile-macro-carb-units-select");
  const fSelect = document.getElementById("profile-macro-fat-units-select");
  const macroSplit = {
    Calories: caloriesVal,
    // FIXME - allow saving macroes in grams or kcal
    // @ts-ignore
    Protein: FMTConvertMacro("protein", pSelect.value, proteinVal, caloriesVal)[
      "%"
    ],
    Carbohydrate: FMTConvertMacro(
      "carbohydrate",
      // @ts-ignore
      cSelect.value,
      carbVal,
      caloriesVal
    )["%"],
    // @ts-ignore
    Fat: FMTConvertMacro("fat", fSelect.value, fatVal, caloriesVal)["%"],
  };
  let sum = macroSplit.Protein + macroSplit.Carbohydrate + macroSplit.Fat;
  if (sum != 100) {
    // Autofill based on settings
    // TODO - prompt user ?
    const conv = FMTFillMacro(
      "profile-macro",
      fmtAppInstance.macroAutoFill,
      macroSplit.Calories
    );
    // FIXME - Allow user to select different default macro
    macroSplit.Carbohydrate = conv["%"];
  }
  let readAndUpdateOperation = () => {
    FMTReadProfile(
      profileId,
      function (e) {
        let profile = e.target.result;
        console.debug(profile);
        if (profile === undefined) {
          let msg = `Profile with ID ${profileId} does not exist yet. Please create it first by filling in your Personal details and then click "Save Personal Details"`;
          onerrorFn ||
            function () {
              console.error(`${msg}`);
            };
          return onerrorFn(msg);
        }
        profile.macroSplit = macroSplit;
        const onProfileUpdatedFn = function (event, updatedProfile) {
          fmtAppInstance.currentProfile = updatedProfile;
          FMTReadUserGoalEntry(
            fmtAppInstance.currentProfileId,
            fmtAppInstance.today.getFullYear(),
            fmtAppInstance.today.getMonth(),
            fmtAppInstance.today.getDate(),
            function (res) {
              let userGoals: IUserGoals = res.target.result;
              if (userGoals) {
                userGoals.macroSplit = profile.macroSplit;
                FMTUpdateUserGoalEntry(
                  userGoals.profile_id,
                  userGoals.year,
                  userGoals.month,
                  userGoals.day,
                  userGoals,
                  onsuccessFn
                );
              } else {
                if (isFunction(onsuccessFn)) onsuccessFn(event, updatedProfile);
              }
            },
            function () {
              console.error(
                `Failed reading User Goals for ${fmtAppInstance.today}`
              );
            }
          );
        };
        FMTUpdateProfile(profileId, profile, onProfileUpdatedFn, onerrorFn);
      },
      onerrorFn
    );
  };
  readAndUpdateOperation();
}
function FMTDisplayProfile(profileId) {
  const onerrorFn = function () {
    console.error(`Failed getting Profile id ${profileId}`);
  };
  FMTReadProfile(
    profileId,
    function (e) {
      // On Success
      let profile = e.target.result;
      console.debug(`Loaded Profile: ${JSON.stringify(profile)}`);
      if (profile === undefined) {
        return;
      }
      if (profile.name) {
        // @ts-ignore
        document.getElementById("profile-name").value = profile.name;
      }
      // @ts-ignore
      document.getElementById("profile-weight").value = profile.bodyWeight;
      // @ts-ignore
      document.getElementById("profile-weight-units").value =
        profile.bodyWeightUnits;
      // @ts-ignore
      document.getElementById("profile-height").value = profile.height;
      // @ts-ignore
      document.getElementById("profile-height-units").value =
        profile.heightUnits;
      // @ts-ignore
      document.getElementById("profile-age").value = profile.age;
      // @ts-ignore
      document.getElementById("profile-sex").value = profile.sex;
      // @ts-ignore
      document.getElementById("profile-sex-select").value = profile.sex;
      document.getElementById("profile-sex").setAttribute("sex", profile.sex);
      if (!isNaN(profile.bodyfat)) {
        // @ts-ignore
        document.getElementById("profile-bodyfat").value = profile.bodyfat;
      }
      // @ts-ignore
      document.getElementById("profile-active-level").value =
        profile.activityLevel;
      document
        .getElementById("profile-active-level")
        .setAttribute("level", profile.activityLevel);
      // @ts-ignore
      document.getElementById("profile-activity-select").value =
        profile.activityLevel;
      const activityMultiplier = document.getElementById(
        "profile-activity-mult"
      );
      // @ts-ignore
      activityMultiplier.value = profile.activityMultiplier;
      activityMultiplier.setAttribute("readonly", "true");
      activityMultiplier.classList.remove("d-none");
      let bmr = Math.round(profile.bmr);
      let tdee = Math.round(profile.tdee);
      document
        .getElementById("profile-bmr")
        .setAttribute("value", bmr.toString());
      document.getElementById("profile-bmr").innerHTML = `${bmr} Kcal/Day`;
      document
        .getElementById("profile-tdee")
        .setAttribute("value", tdee.toString());
      document.getElementById("profile-tdee").innerHTML = `${tdee} Kcal/Day*`;
      document
        .getElementById("profile-formula")
        .setAttribute("value", profile.formula);
      document.getElementById(
        "profile-formula"
      ).innerHTML = `* According to ${profile.formula} formula`;
      // Set Macro fields
      let macroSplit = profile.macroSplit;
      if (macroSplit) {
        // Set saved macro split
        // @ts-ignore
        document.getElementById("profile-daily-calories").value =
          macroSplit.Calories || "";
        // @ts-ignore
        document.getElementById("profile-macro-protein").value =
          macroSplit.Protein || "";
        // @ts-ignore
        document.getElementById("profile-macro-carb").value =
          macroSplit.Carbohydrate || "";
        // @ts-ignore
        document.getElementById("profile-macro-fat").value =
          macroSplit.Fat || "";
      }
      const pSelect = document.getElementById(
        "profile-macro-protein-units-select"
      );
      const cSelect = document.getElementById(
        "profile-macro-carb-units-select"
      );
      const fSelect = document.getElementById("profile-macro-fat-units-select");
      // @ts-ignore
      pSelect.value = "%";
      // @ts-ignore
      cSelect.value = "%";
      // @ts-ignore
      fSelect.value = "%";
      // FIXME - Don't store state in DOM attributes!
      pSelect.setAttribute(PREVIOUS_UNIT_ATTR, "%");
      cSelect.setAttribute(PREVIOUS_UNIT_ATTR, "%");
      fSelect.setAttribute(PREVIOUS_UNIT_ATTR, "%");
      let _e = { currentTarget: pSelect };
      FMTProfileSelectMacroUnits(
        _e,
        "protein",
        "profile-macro-protein",
        "profile-macro-protein-result",
        "profile-daily-calories"
      );
      FMTProfileStorePreviousSelection(_e);
      _e.currentTarget = cSelect;
      FMTProfileSelectMacroUnits(
        _e,
        "carbohydrate",
        "profile-macro-carb",
        "profile-macro-carb-result",
        "profile-daily-calories"
      );
      FMTProfileStorePreviousSelection(_e);
      _e.currentTarget = fSelect;
      FMTProfileSelectMacroUnits(
        _e,
        "fat",
        "profile-macro-fat",
        "profile-macro-fat-result",
        "profile-daily-calories"
      );
      FMTProfileStorePreviousSelection(_e);
    },
    onerrorFn
  );
}

//Functions - UI - Units
function FMTCreateUnitSelectMenu(
  baseName,
  targetDiv,
  unitsChart,
  defaultUnitName,
  readonly,
  prefix,
  unitFilerFn,
  firesEvent
) {
  const _fnName = "FMTCreateUnitSelectMenu";
  if (targetDiv) {
    let selectId = `${baseName}${prefix ? `-${prefix}` : ""}-unit-select`;
    let select = document.getElementById(selectId);
    if (select) {
      select.parentElement.removeChild(select);
    }
    select = document.createElement("select");
    //Add Classes
    select.classList.add("custom-select", "fmt-select", "fmt-center-text");
    select.setAttribute("id", selectId);
    if (!readonly) {
      //Populate options
      let unitNames = Object.keys(unitsChart);
      if (isFunction(unitFilerFn)) {
        unitNames = unitNames.filter(unitFilerFn);
      }
      for (let j = 0; j < unitNames.length; j++) {
        let unitName = unitNames[j];
        let unit = unitsChart[unitName];
        if (!unit) {
          console.warn(
            `[${_fnName}] - ${unitName} couldn't be found in units chart`
          );
          continue;
        }
        const option = document.createElement("option");
        option.innerHTML = unit.description;
        option.setAttribute("value", unitName);
        select.appendChild(option);
      }
      if (firesEvent) {
        select.addEventListener("change", function (ev) {
          ev.currentTarget.dispatchEvent(new Event("unitChanged"));
        });
      }
    } else {
      const unit = unitsChart[defaultUnitName];
      if (unit) {
        const option = document.createElement("option");
        option.innerHTML = unit.description;
        option.setAttribute("value", defaultUnitName);
        select.appendChild(option);
      }
      select.classList.add("fmt-select-noexpand");
    }
    if (!!defaultUnitName && defaultUnitName in unitsChart) {
      // @ts-ignore
      select.value = defaultUnitName;
    }
    targetDiv.appendChild(select);
  } else {
    console.warn(
      `[${_fnName}] - Requested dropdown menu creation with base name ${baseName} in inexisting target Div ${targetDiv}`
    );
  }
}

//Functions - UI - Consumables (Food Items, Recipe Items, Meal Entries)
function FMTCreateNutrientCategoryHeading(category, targetDivID) {
  const headingElements = [];
  const spacer = document.createElement("div");
  spacer.classList.add("w-100");
  headingElements.push(spacer);
  const headingCont = document.createElement("div");
  headingCont.classList.add("input-group", "mb-1");
  const h5 = document.createElement("h5");
  h5.innerHTML = category;
  headingCont.appendChild(h5);
  headingElements.push(headingCont);
  const targetDiv = document.getElementById(targetDivID);
  appendChildren(targetDiv, headingElements);
}
function FMTCreateAdditionalNutrientWithUnitsInput(
  baseID,
  targetDivID,
  nutriObj,
  category,
  unitsChart,
  readonly,
  defaultUnit,
  prefix,
  unitFilterFn,
  value
) {
  defaultUnit = defaultUnit || nutriObj.default_unit;
  const normalizedCategory = category.replace(/ /g, "_");
  const normalizedNutriName = nutriObj.name.replace(/ /g, "_");
  const placeholder = nutriObj.help != null ? `(${nutriObj.help})` : "";
  const nutriBaseId = `${baseID}-${normalizedCategory}-${normalizedNutriName}${
    prefix ? `-${prefix}` : ""
  }`;
  const nutriId = `${nutriBaseId}-input`;

  //Containers
  const columnContainerDiv = document.createElement("div");
  columnContainerDiv.classList.add("mb-1");
  const formGroupDiv = document.createElement("div");
  formGroupDiv.classList.add("form__group", "d-flex");
  formGroupDiv.setAttribute("id", nutriBaseId);

  //Input
  const inputField = document.createElement("input");
  inputField.classList.add("form__field", "fmt-add-nutri");
  inputField.setAttribute("id", nutriId);
  inputField.setAttribute("type", "number");
  inputField.setAttribute("placeholder", placeholder);
  inputField.setAttribute("nutrient-name", nutriObj.name);
  inputField.setAttribute("nutrient-category", category);
  if (readonly) {
    inputField.setAttribute("readonly", "true");
  }
  if (isNumber(value)) {
    inputField.value = value;
  }
  //Label
  const label = document.createElement("label");
  label.classList.add("form__label");
  label.innerHTML = `${nutriObj.name}`;
  label.setAttribute("for", nutriId);

  //Append Elements
  formGroupDiv.appendChild(inputField);
  formGroupDiv.appendChild(label);
  columnContainerDiv.appendChild(formGroupDiv);
  //Append to target div if exists
  const targetDiv = document.getElementById(targetDivID);
  if (targetDiv) {
    targetDiv.appendChild(columnContainerDiv);
  }
  FMTCreateUnitSelectMenu(
    nutriBaseId,
    formGroupDiv,
    unitsChart,
    defaultUnit,
    readonly,
    undefined,
    unitFilterFn,
    true
  );
  return nutriBaseId;
}
function FMTCreateConsumablesTableRowElement(
  consumableObj,
  objectType,
  idProp,
  nameProp,
  brandProp,
  eventListeners
) {
  let consumableRow = document.createElement("tr");
  consumableRow.setAttribute(idProp, consumableObj[idProp]);
  consumableRow.classList.add("fmt-consumable-table-row");
  consumableRow.innerHTML = `<th scope="row" class="fmt-consumable-id-cell ${
    fmtAppInstance.displaySettings.showConsumableIdColumn ? "" : "d-none"
  }">${consumableObj[idProp]}</th><td class= "fmt-consumable-name-cell">${
    consumableObj[nameProp]
  }</td>${
    consumableObj[brandProp] != null
      ? `<td class="fmt-consumable-brand-cell">${consumableObj[brandProp]}</td>`
      : '<td class="fmt-consumable-brand-cell"></td>'
  }`;
  const events = Object.keys(eventListeners);
  for (let k = 0; k < events.length; k++) {
    const eventName = events[k];
    const _func = eventListeners[eventName];
    if (isFunction(_func)) {
      consumableRow.addEventListener(eventName, (e) => {
        _func(e, objectType);
      });
    }
  }
  return consumableRow;
}
function FMTDisplayConsumableTable(
  baseID,
  qualifier,
  objectType,
  onsuccessFn,
  onerrorFn,
  eventListeners
) {
  const targetDiv = document.getElementById(baseID);
  if (!targetDiv) {
    console.warn(
      `[FMTDisplayConsumableTable] - targetDiv (ID = ${baseID}) doesn't exist`
    );
    if (onerrorFn) {
      onerrorFn();
    }
  }
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    console.error(`Invalid qualifier ${qualifier}`);
    return;
  }
  if (fmtAppGlobals.consumableTypes.indexOf(objectType) < 0) {
    console.error(`Invalid Object Type ${objectType}`);
    return;
  }
  let idProp, nameProp, brandProp, dbFunc;
  switch (objectType) {
    case "Food Item":
      idProp = "food_id";
      nameProp = "foodName";
      brandProp = "foodBrand";
      dbFunc = FMTIterateFoods;
      break;
    case "Recipe Item":
      idProp = "recipe_id";
      nameProp = "recipeName";
      brandProp = "recipeCreator";
      dbFunc = FMTIterateRecipes;
      break;
    case "Meal Entry":
    default:
      return;
  }
  const consumableTableBodyID = `${baseID}-${qualifier}-table-body`;
  let consumableTableBody = document.getElementById(consumableTableBodyID);
  if (consumableTableBody == null) {
    console.warn(
      `Consumable table not found (${consumableTableBodyID}). Skipping`,
      new Error().stack
    );
    return;
  }
  consumableTableBody.innerHTML = "";

  if (fmtAppInstance.eventFunctions[consumableTableBodyID] == undefined) {
    fmtAppInstance.eventFunctions[consumableTableBodyID] = {};
  }
  //Clear previous Event Listeners (Javascript API is horrible. Why can't I get/remove all previous attached events?)
  if (
    fmtAppInstance.eventFunctions[consumableTableBodyID]
      .consumablesTableOnConsumableAdded != null
  ) {
    consumableTableBody.removeEventListener(
      "onConsumableAdded",
      fmtAppInstance.eventFunctions[consumableTableBodyID]
        .consumablesTableOnConsumableAdded
    );
  }
  if (
    fmtAppInstance.eventFunctions[consumableTableBodyID]
      .consumablesTableOnConsumableDeleted != null
  ) {
    consumableTableBody.removeEventListener(
      "onConsumableDeleted",
      fmtAppInstance.eventFunctions[consumableTableBodyID]
        .consumablesTableOnConsumableDeleted
    );
  }
  if (
    fmtAppInstance.eventFunctions[consumableTableBodyID]
      .consumablesTableOnConsumableEdit != null
  ) {
    consumableTableBody.removeEventListener(
      "onConsumableEdited",
      fmtAppInstance.eventFunctions[consumableTableBodyID]
        .consumablesTableOnConsumableEdit
    );
  }

  fmtAppInstance.eventFunctions[
    consumableTableBodyID
  ].consumablesTableOnConsumableAdded = function (event) {
    const newConsumableRow = FMTCreateConsumablesTableRowElement(
      event.consumableObj,
      objectType,
      idProp,
      nameProp,
      brandProp,
      eventListeners
    );
    consumableTableBody.appendChild(newConsumableRow);
  };
  fmtAppInstance.eventFunctions[
    consumableTableBodyID
  ].consumablesTableOnConsumableDeleted = function (event) {
    const consumableRows = consumableTableBody.getElementsByClassName(
      "fmt-consumable-table-row"
    );
    for (let i = 0; i < consumableRows.length; i++) {
      const tableRow = consumableRows[i];
      if (tableRow.getAttribute(idProp) === `${event[idProp]}`) {
        tableRow.parentNode.removeChild(tableRow);
        return;
      }
    }
    console.warn(
      `onConsumableDeleted fired on ${consumableTableBody.id} but no matching table row found. event:`
    );
    console.warn(event);
  };
  fmtAppInstance.eventFunctions[
    consumableTableBodyID
  ].consumablesTableOnConsumableEdit = function (event) {
    const consumableRows = consumableTableBody.getElementsByClassName(
      "fmt-consumable-table-row"
    );
    for (let i = 0; i < consumableRows.length; i++) {
      const tableRow = consumableRows[i];
      if (tableRow.getAttribute(idProp) === `${event.consumableObj[idProp]}`) {
        tableRow.parentNode.removeChild(tableRow);
      }
    }
    const newConsumableRow = FMTCreateConsumablesTableRowElement(
      event.consumableObj,
      objectType,
      idProp,
      nameProp,
      brandProp,
      eventListeners
    );
    consumableTableBody.appendChild(newConsumableRow);
  };

  consumableTableBody.addEventListener(
    "onConsumableAdded",
    fmtAppInstance.eventFunctions[consumableTableBodyID]
      .consumablesTableOnConsumableAdded
  );
  consumableTableBody.addEventListener(
    "onConsumableDeleted",
    fmtAppInstance.eventFunctions[consumableTableBodyID]
      .consumablesTableOnConsumableDeleted
  );
  consumableTableBody.addEventListener(
    "onConsumableEdited",
    fmtAppInstance.eventFunctions[consumableTableBodyID]
      .consumablesTableOnConsumableEdit
  );

  dbFunc(function (e) {
    let cursor = e.target.result;
    if (cursor) {
      let record = cursor.value;
      const consumableRow = FMTCreateConsumablesTableRowElement(
        record,
        objectType,
        idProp,
        nameProp,
        brandProp,
        eventListeners
      );
      consumableTableBody.appendChild(consumableRow);
      cursor.continue();
    } else {
      onsuccessFn();
    }
  }, onerrorFn);
}
function FMTQueryConsumablesTable(baseID, qualifier, query) {
  let tbody = document.getElementById(`${baseID}-${qualifier}-table-body`);
  let tableRows = tbody.getElementsByClassName("fmt-consumable-table-row");
  if (query === "") {
    for (let i = 0; i < tableRows.length; i++) {
      let row = tableRows[i];
      row.classList.remove("d-none");
    }
  } else {
    query = query.toLowerCase();
    for (let i = 0; i < tableRows.length; i++) {
      let row = tableRows[i];
      let _nameCell = row.getElementsByClassName("fmt-consumable-name-cell");
      let _brandCell = row.getElementsByClassName("fmt-consumable-brand-cell");
      let consumableName = "";
      let consumableBrand = "";
      if (_nameCell.length > 0) {
        consumableName = _nameCell[0].innerHTML.toLowerCase();
      }
      if (_brandCell.length > 0) {
        consumableBrand = _brandCell[0].innerHTML.toLowerCase();
      }
      if (
        consumableName.indexOf(query) > -1 ||
        consumableBrand.indexOf(query) > -1
      ) {
        row.classList.remove("d-none");
      } else {
        row.classList.add("d-none");
      }
    }
  }
}
function FMTUIInitConsumableMenu(
  baseID,
  toggleQualifier,
  onsuccessFn,
  onerrorFn,
  events
) {
  FMTToggleFoodMenu(baseID, toggleQualifier);
  //Foods
  FMTDisplayConsumableTable(
    baseID,
    "food",
    "Food Item",
    onsuccessFn,
    onerrorFn,
    events
  );
  //Recipes
  FMTDisplayConsumableTable(
    baseID,
    "recipe",
    "Recipe Item",
    onsuccessFn,
    onerrorFn,
    events
  );
}
function FMTUICreateAdditionalNutrientsFromObj(
  baseScreenID,
  qualifier,
  additionalNutrientsObj,
  restrictNutrientUnit,
  unitsChart,
  readonly
) {
  const baseID = `${baseScreenID}-${qualifier}-addi`;
  const additionalNutriDivId = `${baseScreenID}-${qualifier}-additional`;
  for (const category in additionalNutrientsObj) {
    FMTCreateNutrientCategoryHeading(category, additionalNutriDivId);
    const normalizedCategory = category.replace(/ /g, "_");
    additionalNutrientsObj[category].forEach((nutrient) => {
      let prefix, unitFilterFn;
      const nutrientNameNormalized = nutrient.name.replace(/ /g, "_");
      const baseElementId = `${baseScreenID}-${qualifier}-addi-${normalizedCategory}-${nutrientNameNormalized}`;
      const inputElementId = `${baseElementId}-input`;
      if (document.getElementById(inputElementId) != null) {
        prefix = nutrient.unit;
      }
      if (restrictNutrientUnit) {
        const convertibleUnits = findConvertibleUnitsByName(
          nutrient.unit,
          unitsChart
        );
        const convertibleUnitsArray = !convertibleUnits.error
          ? convertibleUnits.convertibleUnits.map((unit) => unit.name)
          : [nutrient.unit];
        unitFilterFn = function (unitName) {
          if (convertibleUnitsArray.indexOf(unitName) >= 0) return true;
        };
      }
      FMTCreateAdditionalNutrientWithUnitsInput(
        baseID,
        additionalNutriDivId,
        nutrient,
        category,
        unitsChart,
        readonly,
        nutrient.unit,
        prefix,
        unitFilterFn,
        nutrient.amount || NaN
      );
    });
  }
}
function FMTUICreateAdditionalNutrientsFromChart(
  baseScreenID,
  readonly,
  qualifier
) {
  if (!fmtAppInstance.additionalNutrients) {
    return false;
  }
  qualifier = qualifier || "food";
  const unitsChart = fmtAppInstance.unitsChart;
  const additionalNutriDivId = `${baseScreenID}-${qualifier}-additional`;
  const additionalNutriDiv = document.getElementById(additionalNutriDivId);
  const categories = Object.keys(fmtAppInstance.additionalNutrients);
  const baseID = `${baseScreenID}-${qualifier}-addi`;
  for (let j = 0; j < categories.length; j++) {
    let category = categories[j];
    let nutrientsInCategory = fmtAppInstance.additionalNutrients[category];
    FMTCreateNutrientCategoryHeading(category, additionalNutriDivId);
    for (let k = 0; k < nutrientsInCategory.length; k++) {
      const nutri = nutrientsInCategory[k];
      const elements = FMTCreateAdditionalNutrientWithUnitsInput(
        baseID,
        additionalNutriDivId,
        nutri,
        category,
        unitsChart,
        readonly,
        nutri.default_unit,
        undefined,
        undefined,
        undefined
      );
    }
  }
  return true;
}
function FMTUIPopulateMacroes(
  baseScreenID,
  qualifier,
  nutritionalValue,
  multiplier,
  readonly
) {
  if (multiplier !== 0) {
    multiplier = multiplier || 1;
  }
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    console.error(`Invalid qualifier ${qualifier}`);
    return;
  }
  const idBase = `${baseScreenID}-${qualifier}`;
  const caloriesValue = Number(
    roundedToFixed(
      nutritionalValue.calories * multiplier,
      DEFAULT_ROUNDING_PRECISION
    )
  );
  const carbsValue = Number(
    roundedToFixed(
      nutritionalValue.carbohydrates * multiplier,
      DEFAULT_ROUNDING_PRECISION
    )
  );
  const proteinValue = Number(
    roundedToFixed(
      nutritionalValue.proteins * multiplier,
      DEFAULT_ROUNDING_PRECISION
    )
  );
  const fatValue = Number(
    roundedToFixed(
      nutritionalValue.fats * multiplier,
      DEFAULT_ROUNDING_PRECISION
    )
  );
  const _calories = document.getElementById(`${idBase}-calories`);
  const _carbs = document.getElementById(`${idBase}-carbohydrates`);
  const _proteins = document.getElementById(`${idBase}-proteins`);
  const _fats = document.getElementById(`${idBase}-fats`);
  // @ts-ignore
  _calories.value = caloriesValue;
  // @ts-ignore
  _carbs.value = carbsValue;
  // @ts-ignore
  _proteins.value = proteinValue;
  // @ts-ignore
  _fats.value = fatValue;
  /* When Macroes are not inputs */
  if (!isInput(_calories)) {
    _calories.innerHTML = caloriesValue.toString();
    _carbs.innerHTML = carbsValue.toString();
    _proteins.innerHTML = proteinValue.toString();
    _fats.innerHTML = fatValue.toString();
  }
  const readonlyFields =
    fmtAppGlobals.consumableItemScreenStaticFieldsNutirtional;
  if (readonly) {
    for (const j in readonlyFields) {
      document
        .getElementById(`${idBase}-${readonlyFields[j]}`)
        .setAttribute("readonly", "true");
    }
  }
}
function FMTUIPopulateNutritionalValue(
  baseScreenID,
  qualifier,
  nutritionalValue,
  multiplier,
  readonly,
  createAdditionalNutrients,
  restrictNutrientUnit
) {
  if (multiplier !== 0) {
    multiplier = multiplier || 1;
  }
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    console.error(`Invalid qualifier ${qualifier}`);
    return;
  }
  FMTUIPopulateMacroes(
    baseScreenID,
    qualifier,
    nutritionalValue,
    multiplier,
    readonly
  );
  if (nutritionalValue.additionalNutrients) {
    //Create and/or Populate Additional Nutrients values
    const idBase = `${baseScreenID}-${qualifier}`;
    const unitsChart = fmtAppInstance.unitsChart;
    const additionalNutriDivId = `${idBase}-additional`;
    const additionalNutriDiv = document.getElementById(additionalNutriDivId);
    const additionalNutrients = nutritionalValue.additionalNutrients;

    if (createAdditionalNutrients === true) {
      additionalNutriDiv.innerHTML = "";
      let emptyAdditionalNutrients = FMTCreateEmptyAdditionalNutrients();
      FMTSumAdditionalNutrients(
        additionalNutrients,
        emptyAdditionalNutrients,
        unitsChart
      );
      FMTUICreateAdditionalNutrientsFromObj(
        baseScreenID,
        qualifier,
        additionalNutrients,
        restrictNutrientUnit,
        unitsChart,
        readonly
      );
    } else {
      //Fill values only
      for (const category in additionalNutrients) {
        const nutrientsList = additionalNutrients[category];
        const normalizedCategory = category.replace(/ /g, "_");
        for (const i in nutrientsList) {
          const nutrient = nutrientsList[i];
          if (nutrient.amount == 0) {
            continue;
          }
          const nutrientNameNormalized = nutrient.name.replace(/ /g, "_");
          const baseElementId = `${idBase}-addi-${normalizedCategory}-${nutrientNameNormalized}`;
          const inputElementId = `${baseElementId}-input`;
          const selectId = `${baseElementId}-unit-select`;
          const baseElement = document.getElementById(baseElementId);
          const inputElement = document.getElementById(inputElementId);
          const select = document.getElementById(selectId);
          if (inputElement) {
            // @ts-ignore
            inputElement.value = nutrient.amount;
            // @ts-ignore
            select.value = nutrient.unit;
          } else {
            //TODO - Review if needed to Lazy Load inexisting nutrients/categories based on APP settings
            console.warn(`Could not find DOM element "${inputElementId}"`);
          }
        }
      }
    }
    //Iterate and manipulate fields as needed
    const addiNutrients =
      additionalNutriDiv.getElementsByClassName("fmt-add-nutri");
    //Apply multiplier
    if (multiplier !== 1) {
      for (let k = 0; k < addiNutrients.length; k++) {
        const _field = addiNutrients[k];
        //@ts-ignore
        if (isNumber(_field.value)) {
          //@ts-ignore
          _field.value = Number(
            roundedToFixed(
              //@ts-ignore
              _field.value * multiplier,
              NUTRIENT_ROUNDING_PRECISION
            )
          );
        }
      }
    }
  }
}
function FMTPopulateConsumableItemScreen(
  baseScreenID,
  optionsObj,
  qualifier,
  objectType,
  mealIdentifierObj,
  createAdditionalNutrients
): { error?: string; mealIdentifier?: IMealIdentifier } {
  //optionsObj {consumableId(int),readonly(bool),eventListenersObj}
  //evenListenerObj{"DOM ID1": {"event": fn},...,"DOM IDN": {"event": fn}}
  const result = {};
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    const error = `Invalid qualifier ${qualifier}`;
    console.error(error);
    return { error };
  }
  if (fmtAppGlobals.consumableTypes.indexOf(objectType) < 0) {
    const error = `Invalid Object Type ${objectType}`;
    console.error(error);
    return { error };
  }
  optionsObj = optionsObj || { readonly: false };
  let idProp;
  switch (objectType) {
    case "Food Item":
      idProp = "food_id";
      break;
    case "Meal Entry":
      idProp = "entry_id";
      break;
    case "Recipe Item":
      //TODO
      idProp = "recipe_id";
      break;
  }
  //Prepare Serving field - where user selects units and inputs amount
  const servingBaseName = `${baseScreenID}-${qualifier}-serving`;
  const servingTargetDivId = servingBaseName;
  const servingTargetDiv = document.getElementById(servingTargetDivId);
  const unitsChart = fmtAppInstance.unitsChart;
  const readonly = optionsObj.readonly || false;
  FMTCreateUnitSelectMenu(
    servingBaseName,
    servingTargetDiv,
    unitsChart,
    "g",
    readonly,
    undefined,
    undefined,
    true
  );

  //Validate and Add ID of consumable/entry (food_id, recipe_id, entry_id).
  const saveOrAddBtn = document.getElementById(`${baseScreenID}-save`);
  const delBtn = document.getElementById(`${baseScreenID}-delete`);
  const editBtn = document.getElementById(`${baseScreenID}-edit`);
  //TODO - write a function to validate the different IDs
  if (isNumber(optionsObj.consumableId)) {
    saveOrAddBtn.setAttribute(`${idProp}`, optionsObj.consumableId);
    if (delBtn) {
      delBtn.setAttribute(`${idProp}`, optionsObj.consumableId);
    }
    if (editBtn) {
      editBtn.setAttribute(`${idProp}`, optionsObj.consumableId);
    }
  }

  //Vaidate and handle Meal Identifier if present
  if (mealIdentifierObj) {
    const validateMealIdentifier = FMTValidateMealIdentifier(mealIdentifierObj);
    if (
      validateMealIdentifier.error != null ||
      validateMealIdentifier.mealIdentifier == null
    ) {
      //TODO handle error
      //@ts-ignore
      result.error = validateMealIdentifier.error;
    }
    const mealIdentifier = validateMealIdentifier.mealIdentifier;
    //Add to buttons
    if (saveOrAddBtn) {
      if (mealIdentifier.meal_name) {
        saveOrAddBtn.setAttribute("meal_name", mealIdentifier.meal_name);
      }
      saveOrAddBtn.setAttribute(
        "meal_year",
        mealIdentifier.meal_year.toString()
      );
      saveOrAddBtn.setAttribute(
        "meal_month",
        mealIdentifier.meal_month.toString()
      );
      saveOrAddBtn.setAttribute("meal_day", mealIdentifier.meal_day.toString());
      saveOrAddBtn.setAttribute(
        "profile_id",
        mealIdentifier.profile_id.toString()
      );
    }
  }

  //Create Input fields for Additional Nutrients and attach event listeners to elements passed in optionsObj
  if (createAdditionalNutrients) {
    const res = FMTUICreateAdditionalNutrientsFromChart(
      baseScreenID,
      readonly,
      qualifier
    );
    if (!res) {
      console.warn(
        `Failed adding additional nutrients fields to ${baseScreenID}`
      );
    }
  }
  //Attached event listeners if needed
  if (optionsObj.eventListenersObj) {
    for (const elemName in optionsObj.eventListenersObj) {
      const element = document.getElementById(elemName);
      if (element) {
        for (const eventName in optionsObj.eventListenersObj[elemName]) {
          element.addEventListener(
            eventName,
            optionsObj.eventListenersObj[elemName][eventName]
          );
        }
      }
    }
  }
  return result;
}
function FMTPopulateSavedValuesInConsumableItemScreen(
  baseScreenID,
  consumableItem,
  qualifier,
  objectType,
  multiplier,
  readonly,
  focusDivId,
  currentServingValue,
  currentServingUnits,
  headingPrefix,
  createAdditionalNutrients,
  restrictNutrientUnit
) {
  if (multiplier !== 0) {
    multiplier = multiplier || 1;
  }
  //TODO - write a function for this!
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    console.error(`Invalid qualifier ${qualifier}`);
    return;
  }
  if (fmtAppGlobals.consumableTypes.indexOf(objectType) < 0) {
    console.error(`Invalid Object Type ${objectType}`);
    return;
  }
  const idBase = `${baseScreenID}-${qualifier}`;
  const _funcName = "FMTPopulateSavedValuesInConsumableItemScreen";
  //FIXME - write a function that gets this done. and remove repetition everywhere
  let nameProp, brandProp, servingProp;
  switch (objectType) {
    case "Food Item":
    //FIXME
    case "Ingredient Item":
      nameProp = "foodName";
      brandProp = "foodBrand";
      servingProp = "referenceServing";
      break;
    case "Meal Entry":
      nameProp = "consumableName";
      brandProp = "consumableBrand";
      servingProp = "serving";
      break;
    case "Recipe Item":
      nameProp = "recipeName";
      brandProp = "recipeCreator";
      servingProp = "referenceServing";
      break;
  }
  // Set Naming properties
  document.getElementById(`${baseScreenID}-heading`).innerHTML = `${
    headingPrefix ? `${headingPrefix} - ` : ""
  }${consumableItem[nameProp]}`;
  // @ts-ignore
  document.getElementById(`${idBase}-name`).value = consumableItem[nameProp];
  // @ts-ignore
  document.getElementById(`${idBase}-brand`).value =
    consumableItem[brandProp] || "";
  // Set Serving properties
  if (
    !isNumber(currentServingValue) ||
    !(currentServingUnits in fmtAppInstance.unitsChart)
  ) {
    const servInElem = document.getElementById(`${idBase}-serving-input`);
    // @ts-ignore
    servInElem.value = consumableItem[servingProp];
    servInElem.setAttribute("reference_serving", consumableItem[servingProp]);
    servInElem.setAttribute("reference_serving_units", consumableItem.units);
    const select = document.getElementById(`${idBase}-serving-unit-select`);
    if (select) {
      // @ts-ignore
      select.value = consumableItem.units;
    }
  } //Else dont touch these fields and retain user input
  if (readonly) {
    const readonlyFields =
      fmtAppGlobals.consumableItemScreenStaticFieldsDescriptional;
    for (const j in readonlyFields) {
      document
        .getElementById(`${idBase}-${readonlyFields[j]}`)
        .setAttribute("readonly", "true");
    }
  }
  FMTUIPopulateNutritionalValue(
    baseScreenID,
    qualifier,
    consumableItem.nutritionalValue,
    multiplier,
    readonly,
    createAdditionalNutrients,
    restrictNutrientUnit
  );
  //Additinal object type specific tasks - Ugly FIXME
  switch (objectType) {
    case "Food Item":
      break;
    case "Meal Entry":
      // @ts-ignore
      document.getElementById(`${idBase}-type`).value =
        consumableItem.consumableType;
      break;
    case "Recipe Item":
      // @ts-ignore
      document.getElementById(`${idBase}-description`).value =
        consumableItem.recipeDescription || "";
      // @ts-ignore
      document.getElementById(`${idBase}-video-url`).value =
        consumableItem.videoUrl || "";
      // @ts-ignore
      document.getElementById(`${idBase}-website`).value =
        consumableItem.website || "";
      const prepStepContainerDiv = document.getElementById(
        `${idBase}-preparation-steps`
      );
      const ingredientsDiv = document.getElementById(`${idBase}-ingredients`);
      _removeChildren(prepStepContainerDiv, "fmt-recipe-step-cont");
      _removeChildren(ingredientsDiv, "fmt-recipe-ingredient-cont");
      consumableItem.preparationSteps.forEach((item, i) => {
        const col = FMTUICreateTextArea(
          "textarea",
          `Step ${i + 1}`,
          "Preparation Step",
          undefined,
          readonly,
          ["fmt-recipe-step-cont"],
          ["fmt-textarea"]
        );
        col.getElementsByTagName("textarea")[0].value = item;
        const addStepDelBtn = !readonly;
        FMTUIAddPreparationStep(
          prepStepContainerDiv,
          false,
          addStepDelBtn,
          col
        );
      });
      if (readonly) {
        consumableItem.ingredients.forEach((item) => {
          const col = FMTUICreateIngredient(item);
          const lastElement =
            ingredientsDiv.children[ingredientsDiv.children.length - 1];
          ingredientsDiv.insertBefore(col, lastElement);
        });
      } else {
        //Create with delete and edit buttons
        const onModified = () => {
          consumableItem.nutritionalValue = FMTSumIngredients(
            consumableItem.ingredients,
            fmtAppInstance.unitsChart
          );
          FMTUIPopulateNutritionalValue(
            baseScreenID,
            qualifier,
            consumableItem.nutritionalValue,
            1,
            true,
            true,
            false
          );
        };

        consumableItem.ingredients.forEach((item) => {
          const onEdit = (col, input) => {
            const onEdited = () => {
              onModified();
              input.value = `${item.foodName} ${item.referenceServing}/${item.units}`;
              input.setAttribute("food_id", item.food_id);
              input.setAttribute("referenceServing", item.referenceServing);
              input.setAttribute("units", item.units);
            };
            pageController.openEditIngredientDynamicScreen(
              consumableItem,
              item,
              1,
              true,
              undefined,
              undefined,
              onEdited
            );
          };

          const onDel = () => {
            const idx = indexesOfObjectMulti(consumableItem.ingredients, {
              food_id: item.food_id,
              referenceServing: item.referenceServing,
              units: item.units,
            });
            if (idx.length > 0) {
              console.debug(
                `Found ${idx.length} items matching for deletion, removing first`
              );
              consumableItem.ingredients.splice(idx[0], 1);
            }
            onModified();
          };

          FMTUIAddIngredient(item, ingredientsDiv, onDel, onEdit);
        });
        //// Call this again because nutritional value is a derivative of ingredients and cannot be set manually
        FMTUIPopulateNutritionalValue(
          baseScreenID,
          qualifier,
          consumableItem.nutritionalValue,
          multiplier,
          true,
          createAdditionalNutrients,
          restrictNutrientUnit
        );
      }
      break;
  }
  //Focus on an element - on keyup values updating function uses this
  if (focusDivId) {
    const fDiv = document.getElementById(focusDivId);
    if (fDiv) {
      fDiv.focus();
    }
  }
}
function FMTConsumableItemScreenShowMore(baseScreenID, qualifier) {
  qualifier = qualifier || "food";
  $(`#${baseScreenID}-more`).hide();
  $(`#${baseScreenID}-less`).removeClass("d-none");
  $(`#${baseScreenID}-less`).show();
  $(`#${baseScreenID}-${qualifier}-microes`).removeClass("d-none");
  $(`#${baseScreenID}-${qualifier}-microes`).show();
}
function FMTConsumableItemScreenShowLess(baseScreenID, qualifier) {
  qualifier = qualifier || "food";
  $(`#${baseScreenID}-less`).hide();
  if (!$(`#${baseScreenID}-less`).hasClass("d-none")) {
    $(`#${baseScreenID}-less`).addClass("d-none");
  }
  $(`#${baseScreenID}-more`).show();
  $(`#${baseScreenID}-${qualifier}-microes`).hide();
  if (!$(`#${baseScreenID}-${qualifier}-microes`).hasClass("d-none")) {
    $(`#${baseScreenID}-${qualifier}-microes`).addClass("d-none");
  }
}
function FMTClearViewConsumableItemScreen(baseScreenID, qualifier, objectType) {
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    console.error(`Invalid qualifier ${qualifier}`);
    return;
  }
  if (fmtAppGlobals.consumableTypes.indexOf(objectType) < 0) {
    console.error(`Invalid Object Type ${objectType}`);
    return;
  }
  //Clear screen
  FMTClearConsumableItemScreen(baseScreenID, qualifier, objectType);
  let idProp;
  switch (objectType) {
    case "Food Item":
    //FIXME when ingredient item will not nesecarrily be a food item
    case "Ingredient Item":
      idProp = "food_id";
      break;
    case "Meal Entry":
      idProp = "consumable_id";
      break;
    case "Recipe Item":
      idProp = "recipe_id";
      break;
  }
  //Clear Add to Meal/Update (save btn) properties present in this screen
  const saveBtn = document.getElementById(`${baseScreenID}-save`);
  saveBtn.removeAttribute(idProp);
  saveBtn.removeAttribute("meal_name");
  saveBtn.removeAttribute("meal_year");
  saveBtn.removeAttribute("meal_month");
  saveBtn.removeAttribute("meal_day");
  saveBtn.removeAttribute("profile_id");
  // @ts-ignore
  document.getElementById(`${baseScreenID}-meal-year`).value = "";
  // @ts-ignore
  document.getElementById(`${baseScreenID}-meal-month`).value = "";
  // @ts-ignore
  document.getElementById(`${baseScreenID}-meal-day`).value = "";
  // @ts-ignore
  document.getElementById(`${baseScreenID}-meal-name`).value = "";
  //Hide container of the above input fields
  document
    .getElementById(`${baseScreenID}-add-to-meal`)
    .classList.add("d-none");
}
function FMTClearConsumableItemScreen(
  baseScreenID: string,
  qualifier: string,
  objectType?: string
) {
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    console.error(`Invalid qualifier ${qualifier}`);
    return;
  }
  //Here objectType is optional
  if (!!objectType && fmtAppGlobals.consumableTypes.indexOf(objectType) < 0) {
    console.error(`Invalid Object Type ${objectType}`);
    return;
  }

  document.getElementById(`${baseScreenID}-alerts`).innerHTML = "";
  const _heading = document.getElementById(`${baseScreenID}-heading`);
  if (_heading) {
    _heading.innerHTML = "";
  }
  const _calories = document.getElementById(
    `${baseScreenID}-${qualifier}-calories`
  );
  const _proteins = document.getElementById(
    `${baseScreenID}-${qualifier}-proteins`
  );
  const _carbs = document.getElementById(
    `${baseScreenID}-${qualifier}-carbohydrates`
  );
  const _fats = document.getElementById(`${baseScreenID}-${qualifier}-fats`);
  // @ts-ignore
  document.getElementById(`${baseScreenID}-${qualifier}-name`).value = "";
  // @ts-ignore
  document.getElementById(`${baseScreenID}-${qualifier}-brand`).value = "";
  // @ts-ignore
  _calories.value = "";
  // @ts-ignore
  _proteins.value = "";
  // @ts-ignore
  _carbs.value = "";
  // @ts-ignore
  _fats.value = "";
  if (!isInput(_calories)) {
    _calories.innerHTML = "";
    _proteins.innerHTML = "";
    _carbs.innerHTML = "";
    _fats.innerHTML = "";
  }
  // @ts-ignore
  document.getElementById(`${baseScreenID}-${qualifier}-serving-input`).value =
    "";
  document.getElementById(`${baseScreenID}-${qualifier}-additional`).innerHTML =
    "";
  FMTConsumableItemScreenShowLess(baseScreenID, qualifier);
  //Type sepecific actions
  if (objectType) {
    let delBtn, saveBtn, updateBtn, editBtn;
    switch (objectType) {
      case "Meal Entry":
        // @ts-ignore
        document.getElementById(`${baseScreenID}-${qualifier}-type`).value = "";
        updateBtn = document.getElementById(`${baseScreenID}-save`);
        delBtn = document.getElementById(`${baseScreenID}-delete`);
        delBtn.removeAttribute(`entry_id`);
        updateBtn.removeAttribute(`entry_id`);
        updateBtn.removeAttribute("meal_name");
        updateBtn.removeAttribute("meal_year");
        updateBtn.removeAttribute("meal_month");
        updateBtn.removeAttribute("meal_day");
        updateBtn.removeAttribute("profile_id");
        updateBtn.removeAttribute("consumable_id");
        break;
      case "Food Item":
        saveBtn = document.getElementById(`${baseScreenID}-save`);
        delBtn = document.getElementById(`${baseScreenID}-delete`);
        editBtn = document.getElementById(`${baseScreenID}-edit`);
        saveBtn.removeAttribute("consumables-table-body-id");
        saveBtn.removeAttribute("meal_name");
        saveBtn.removeAttribute("meal_year");
        saveBtn.removeAttribute("meal_month");
        saveBtn.removeAttribute("meal_day");
        saveBtn.removeAttribute("profile_id");
        if (delBtn) {
          delBtn.removeAttribute("consumables-table-body-id");
        }
        if (editBtn) {
          editBtn.removeAttribute("consumables-table-body-id");
        }
        break;
      case "Recipe Item":
        document.getElementById(
          `${baseScreenID}-${qualifier}-description`
          // @ts-ignore
        ).value = "";
        document.getElementById(
          `${baseScreenID}-${qualifier}-video-url`
          // @ts-ignore
        ).value = "";
        // @ts-ignore
        document.getElementById(`${baseScreenID}-${qualifier}-website`).value =
          "";
        removeChildren(
          `${baseScreenID}-${qualifier}-preparation-steps`,
          "fmt-recipe-step-cont"
        );
        removeChildren(
          `${baseScreenID}-${qualifier}-ingredients`,
          "fmt-recipe-ingredient-cont"
        );
        break;
      case "Ingredient Item":
        //TODO
        break;
    }
  }
}
function FMTUIGetAdditionalNutrientsFromScreen(baseScreenID, qualifier) {
  const screenAdditionalNutrients = {};
  const additionalNutriDiv = document.getElementById(
    `${baseScreenID}-${qualifier}-additional`
  );
  const addiNutrients =
    additionalNutriDiv.getElementsByClassName("fmt-add-nutri");
  for (let k = 0; k < addiNutrients.length; k++) {
    const _field = addiNutrients[k];
    // @ts-ignore
    if (isNumber(_field.value) && Number(_field.value) > 0) {
      // @ts-ignore
      const amount = Number(_field.value);
      const category = _field.getAttribute("nutrient-category");
      const name = _field.getAttribute("nutrient-name");
      const inputFieldId = _field.getAttribute("id");
      //Get the select element ID based on input's ID - 6 last characters ("-input")
      const selectId = `${inputFieldId.substring(
        0,
        inputFieldId.length - 6
      )}-unit-select`;
      const select = document.getElementById(selectId);
      if (!select) {
        //TODO increase error count
        console.error(`Failed finding select element at id: ${selectId}`);
        continue;
      }
      if (!Array.isArray(screenAdditionalNutrients[category])) {
        screenAdditionalNutrients[category] = [];
      }
      screenAdditionalNutrients[category].push({
        name: name,
        amount: amount,
        // @ts-ignore
        unit: select.value,
      });
    }
  }
  return screenAdditionalNutrients;
}
function FMTSaveConsumableItemScreen(
  baseScreenID,
  action,
  optionsObj,
  qualifier,
  objectType,
  getNutritionalValue,
  onsuccessFn,
  onerrorFn
) {
  const _funcName = "FMTSaveConsumableItemScreen";
  let nameProp, brandProp, servingProp;
  switch (objectType) {
    case "Food Item":
    //FIXME
    case "Ingredient Item":
      nameProp = "foodName";
      brandProp = "foodBrand";
      servingProp = "referenceServing";
      break;
    case "Meal Entry":
      nameProp = "consumableName";
      brandProp = "consumableBrand";
      servingProp = "serving";
      break;
    case "Recipe Item":
      nameProp = "recipeName";
      brandProp = "recipeCreator";
      servingProp = "referenceServing";
      break;
  }
  onerrorFn =
    onerrorFn ||
    function (err) {
      console.error(`[${_funcName}] - Failed ${err}`);
    };
  if (baseScreenID == null) {
    console.error(`[${_funcName}] - Invalid baseScreenID "${baseScreenID}"`);
    return onerrorFn();
  }
  if (!(action == "add" || action == "edit" || action == "get-object")) {
    console.error(`[${_funcName}] - Invalid action "${action}"`);
    return onerrorFn();
  }
  if (action == "edit" && (!optionsObj || !isNumber(optionsObj.consumableId))) {
    console.error(`[${_funcName}] - Missing consumableId for edit action`);
    return onerrorFn();
  }
  const unitsChart = fmtAppInstance.unitsChart;
  const updateBtn = document.getElementById(`${baseScreenID}-save`);

  let consumableObj: any = {
    units: document.getElementById(
      `${baseScreenID}-${qualifier}-serving-unit-select`
      // @ts-ignore
    ).value,
    year: updateBtn.getAttribute("meal_year"),
    month: updateBtn.getAttribute("meal_month"),
    day: updateBtn.getAttribute("meal_day"),
    mealName: updateBtn.getAttribute("meal_name"),
    profile_id: updateBtn.getAttribute("profile_id"),
    consumable_id: updateBtn.getAttribute("consumable_id"),
    [nameProp]: document.getElementById(
      `${baseScreenID}-${qualifier}-name`
      // @ts-ignore
    ).value,
    [brandProp]: document.getElementById(
      `${baseScreenID}-${qualifier}-brand`
      // @ts-ignore
    ).value,
    [servingProp]: document.getElementById(
      `${baseScreenID}-${qualifier}-serving-input`
      // @ts-ignore
    ).value,
  };
  if (objectType === "Meal Entry") {
    //FIXME - remove this logic from here and save these parameters by function reference inside Instance - State
    consumableObj.consumableType = document.getElementById(
      `${baseScreenID}-${qualifier}-type`
      // @ts-ignore
    ).value;
  }
  if (getNutritionalValue === true) {
    consumableObj.nutritionalValue = {};
    const _calories = document.getElementById(
      `${baseScreenID}-${qualifier}-calories`
    );
    const _carbs = document.getElementById(
      `${baseScreenID}-${qualifier}-carbohydrates`
    );
    const _proteins = document.getElementById(
      `${baseScreenID}-${qualifier}-proteins`
    );
    const _fats = document.getElementById(`${baseScreenID}-${qualifier}-fats`);
    consumableObj.nutritionalValue.calories = isInput(_calories)
      ? // @ts-ignore
        _calories.value
      : _calories.innerHTML;
    consumableObj.nutritionalValue.carbohydrates = isInput(_carbs)
      ? // @ts-ignore
        _carbs.value
      : _carbs.innerHTML;
    consumableObj.nutritionalValue.proteins = isInput(_proteins)
      ? // @ts-ignore
        _proteins.value
      : _proteins.innerHTML;
    consumableObj.nutritionalValue.fats = isInput(_fats)
      ? // @ts-ignore
        _fats.value
      : _fats.innerHTML;
    consumableObj.nutritionalValue.additionalNutrients =
      FMTUIGetAdditionalNutrientsFromScreen(baseScreenID, qualifier);
  }
  if (objectType === "Recipe Item") {
    const prepStepContainerDiv = document.getElementById(
      `${baseScreenID}-${qualifier}-preparation-steps`
    );
    consumableObj.preparationSteps =
      FMTUIGetPreparationSteps(prepStepContainerDiv);
    consumableObj.recipeDescription = document.getElementById(
      `${baseScreenID}-${qualifier}-description`
      // @ts-ignore
    ).value;
    consumableObj.videoUrl = document.getElementById(
      `${baseScreenID}-${qualifier}-video-url`
      // @ts-ignore
    ).value;
    consumableObj.website = document.getElementById(
      `${baseScreenID}-${qualifier}-website`
      // @ts-ignore
    ).value;
  }
  switch (action) {
    //FIXME - add and edit only working for Food Item object.
    //either remove them and use get-object only or implement for other consumable types
    case "add":
      onsuccessFn =
        onsuccessFn ||
        function (e, food) {
          console.debug(
            `[${_funcName}] - Successfully added food: ${JSON.stringify(
              food
            )}, id ${e.target.result}`
          );
          pageController.closeAddFoodDynamicScreen();
        };
      FMTAddFood(consumableObj, unitsChart, onsuccessFn, onerrorFn);
      break;
    case "edit":
      onsuccessFn =
        onsuccessFn ||
        function (e, food) {
          console.debug(
            `[${_funcName}] - Successfully updated food: ${JSON.stringify(
              e.target.result
            )}`
          );
          pageController.closeEditFoodDynamicScreen();
        };
      FMTUpdateFood(
        optionsObj.consumableId,
        consumableObj,
        unitsChart,
        onsuccessFn,
        onerrorFn
      );
      break;
    case "get-object":
      return consumableObj;
  }
}
function FMTUpdateConsumableValuesOnServingChange(
  event: any,
  baseScreenID: string,
  qualifier: string,
  objectType: string,
  consumableItem?: any,
  ingredient?: any
) {
  //TODO add object ID validation function based on objectType
  let idProp, pageFunction;
  switch (objectType) {
    case "Food Item":
      idProp = "food_id";
      pageFunction = pageController.openViewFoodDynamicScreen;
      break;
    case "Meal Entry":
      idProp = "entry_id";
      pageFunction = pageController.openEditMealEntryDynamicScreen;
      break;
    case "Recipe Item":
      idProp = "recipe_id";
      pageFunction = pageController.openViewRecipeDynamicScreen;
      break;
    case "Ingredient Item":
      idProp = "food_id";
      pageFunction = pageController.openEditIngredientDynamicScreen;
      break;
  }
  const alertsDivID = `${baseScreenID}-alerts`;
  //TODO - review why do/don't I need this function to remove my alerts
  //document.getElementById(alertsDivID).innerHTML = "";
  const servingInputField = document.getElementById(
    `${baseScreenID}-${qualifier}-serving-input`
  );
  // @ts-ignore
  let userServingSize = servingInputField.value;
  if (userServingSize === "") {
    userServingSize = 0;
  }
  let userSelectedUnits = document.getElementById(
    `${baseScreenID}-${qualifier}-serving-unit-select`
    // @ts-ignore
  ).value;
  let referenceServingSize =
    servingInputField.getAttribute("reference_serving");
  let referenceServingUnits = servingInputField.getAttribute(
    "reference_serving_units"
  );
  const conversionRes = calculateConsumableRatio(
    referenceServingSize,
    referenceServingUnits,
    userServingSize,
    userSelectedUnits,
    fmtAppInstance.unitsChart
  );
  let multiplier = 1;
  if (conversionRes.error) {
    //FMTShowAlert(alertsDivID, "danger", conversionRes.error, fmtAppGlobals.defaultAlertScroll);
    userSelectedUnits = undefined;
    userServingSize = undefined;
  } else {
    multiplier = conversionRes.multiplier;
  }
  let args;
  // Ugly. FIXME
  if (objectType === "Ingredient Item") {
    ////onModified === undefined but will not override because clear === false
    args = [
      consumableItem,
      ingredient,
      multiplier,
      false,
      userServingSize,
      userSelectedUnits,
      undefined,
    ];
  } else {
    let objectId = document
      .getElementById(`${baseScreenID}-save`)
      .getAttribute(idProp);
    if (!isNumber(objectId)) {
      console.error(
        `${objectType} ID (${objectId}) is not valid on serving change`
      );
      FMTShowAlertBar(
        "Error while calculating nutritional value. Please reload",
        alertsDivID,
        "danger"
      );
      return;
    } else {
      args = [objectId, multiplier, false, userServingSize, userSelectedUnits];
    }
  }
  // console.log(`FMTUpdateConsumableValuesOnServingChange, Args ${JSON.stringify(args)}`);
  pageFunction.apply(null, args);
}

//Functions - UI - Overview
function FMTCreateMacroProgressBar(
  c: number,
  p: number,
  f: number,
  inPercent: boolean,
  className?: string,
  addLabels?: boolean
) {
  className = className || "fmt-macros-dist-progress-bar";
  const carbCalories = c * 4;
  const proteinCalories = p * 4;
  const fatCalories = f * 9;
  const totalCalories = carbCalories + proteinCalories + fatCalories;
  const carbPercent = (carbCalories / totalCalories) * 100;
  const proteinPercent = (proteinCalories / totalCalories) * 100;
  const fatPercent = (fatCalories / totalCalories) * 100;
  const progress = document.createElement("div");
  progress.classList.add("progress", "fmt-font-sm", className);

  const carbProgress = document.createElement("div");
  carbProgress.classList.add("progress-bar", "fmt-bg-violet");
  carbProgress.setAttribute("aria-valuemin", "0");
  carbProgress.setAttribute("aria-valuemax", "100");
  carbProgress.style.width = `${carbPercent}%`;

  const proteinProgress = document.createElement("div");
  proteinProgress.classList.add("progress-bar", "bg-info");
  proteinProgress.setAttribute("aria-valuemin", "0");
  proteinProgress.setAttribute("aria-valuemax", "100");
  proteinProgress.style.width = `${proteinPercent}%`;

  const fatProgress = document.createElement("div");
  fatProgress.classList.add("progress-bar", "fmt-bg-orange");
  fatProgress.setAttribute("aria-valuemin", "0");
  fatProgress.setAttribute("aria-valuemax", "100");
  fatProgress.style.width = `${fatPercent}%`;

  if (addLabels) {
    carbProgress.innerHTML = `<span>${
      inPercent ? `${roundedToFixed(carbPercent, 0)}%` : c
    }</span>`;
    proteinProgress.innerHTML = `<span>${
      inPercent ? `${roundedToFixed(proteinPercent, 0)}%` : p
    }</span>`;
    fatProgress.innerHTML = `<span>${
      inPercent ? `${roundedToFixed(fatPercent, 0)}%` : f
    }</span>`;
  }

  progress.appendChild(carbProgress);
  progress.appendChild(proteinProgress);
  progress.appendChild(fatProgress);
  return progress;
}
function FMTOverviewCreateMealNode(mealEntryObj, validate) {
  let mealEntry = mealEntryObj;
  if (validate) {
    let res = FMTValidateMealEntry(mealEntryObj);
    if (res.mealEntry == null || res.error != null) {
      console.error(
        `Error validating Meal Entry Object (${mealEntryObj}) . Error - ${res.error}`
      );
      return;
    }
    mealEntry = res.mealEntry;
  }
  const normalizedMealName = mealEntry.mealName
    .replace(/ /g, "_")
    .replace(/-/g, "_");
  const mealDiv = document.createElement("div");
  mealDiv.setAttribute("id", `overview-meal-${normalizedMealName}`);
  mealDiv.classList.add("fmt-meal", "container");

  const mealHeaderDiv = document.createElement("div");
  const mealEntriesDiv = document.createElement("div");
  const mealFooterDiv = document.createElement("div");
  const mealHeaderDivId = `overview-meal-${normalizedMealName}-header`;
  const mealEntriesDivId = `overview-meal-${normalizedMealName}-entries`;
  const mealFooterDivId = `overview-meal-${normalizedMealName}-footer`;
  mealHeaderDiv.setAttribute("id", mealHeaderDivId);
  mealEntriesDiv.setAttribute("id", mealEntriesDivId);
  mealFooterDiv.setAttribute("id", mealFooterDivId);

  mealHeaderDiv.classList.add(
    "fmt-meal-header",
    "row",
    "justify-content-center"
  );
  mealEntriesDiv.classList.add(
    "fmt-meal-entries",
    "row",
    "justify-content-center"
  );
  mealFooterDiv.classList.add(
    "fmt-meal-footer",
    "row",
    "justify-content-between",
    "pb-1"
  );

  //Meal Header
  const mNameSpan = document.createElement("span");
  mNameSpan.classList.add("fmt-font-1", "float-left", "fmt-bold", "fmt-pad-1");
  mNameSpan.innerHTML = mealEntry.mealName;
  const mNameDiv = document.createElement("div");
  mNameDiv.classList.add("col");
  mNameDiv.appendChild(mNameSpan);

  const kCalSpan = document.createElement("span");
  kCalSpan.setAttribute(
    "id",
    `overview-meal-${normalizedMealName}-calories-progress`
  );
  kCalSpan.classList.add("fmt-font-1", "float-right", "fmt-pad-1");
  //First Set to 0 later update
  kCalSpan.innerHTML = "0";
  const kCalDiv = document.createElement("div");
  kCalDiv.classList.add("col");
  kCalDiv.appendChild(kCalSpan);

  // const optsBtn = document.createElement("button");
  // optsBtn.classList.add("fmt-font-1", "float-right", "ml-3", "fal", "fa-chevron-down", "btn", "fmt-btn-no-focus");
  // optsBtn.setAttribute("meal_name", mealEntry.mealName);
  // optsBtn.setAttribute("meal_year", mealEntry.year);
  // optsBtn.setAttribute("meal_month", mealEntry.month);
  // optsBtn.setAttribute("meal_day", mealEntry.day);
  // optsBtn.setAttribute("expanded", "true");
  // optsBtn.addEventListener("click", function(e) {
  //   switch(e.currentTarget.getAttribute("expanded")) {
  //     case "true":
  //       e.currentTarget.classList.remove("fa-chevron-down");
  //       e.currentTarget.classList.add("fa-chevron-left");
  //       e.currentTarget.setAttribute("expanded", "false");
  //       document.getElementById(mealEntriesDivId).classList.add("d-none");
  //       document.getElementById(mealFooterDivId).classList.add("d-none");
  //       break;
  //     case "false":
  //       e.currentTarget.classList.remove("fa-chevron-left");
  //       e.currentTarget.classList.add("fa-chevron-down");
  //       e.currentTarget.setAttribute("expanded", "true");
  //       document.getElementById(mealEntriesDivId).classList.remove("d-none");
  //       document.getElementById(mealFooterDivId).classList.remove("d-none");
  //       break;
  //   }
  // });
  // const optsBtnDiv = document.createElement("div");
  // optsBtnDiv.classList.add("col-2", "col-lg-1");
  // optsBtnDiv.appendChild(optsBtn);

  mealHeaderDiv.appendChild(mNameDiv);
  mealHeaderDiv.appendChild(kCalDiv);
  //mealHeaderDiv.appendChild(optsBtnDiv);

  //Meal Footer
  const mealFooterAddDiv = document.createElement("div");
  mealFooterAddDiv.classList.add(
    "col-12",
    "fmt-meal-footer-add",
    "fmt-center-text",
    "d-flex",
    "pr-0",
    "pl-0"
  );
  const mealFooterAddBtn = document.createElement("button");
  mealFooterAddBtn.classList.add(
    "fmt-font-1",
    "btn",
    "fmt-btn-outline-gray",
    "flex-fill"
  );
  mealFooterAddBtn.innerHTML = `Add to ${mealEntry.mealName}`; //"+";
  mealFooterAddBtn.addEventListener("click", function () {
    const mealIdentifierObj = {
      meal_year: mealEntryObj.year,
      meal_month: mealEntryObj.month,
      meal_day: mealEntryObj.day,
      meal_name: mealEntryObj.mealName,
      profile_id: mealEntryObj.profile_id,
    };
    pageController.openAddToMealDynamicScreen(mealIdentifierObj);
  });
  mealFooterAddDiv.appendChild(mealFooterAddBtn);

  const carbSpanMd = document.createElement("span");
  const carbSpanSm = document.createElement("span");
  carbSpanMd.classList.add(
    "fmt-font-1",
    "d-none",
    "d-sm-inline",
    "fmt-meal-carbs",
    "fmt-font-color-violet"
  );
  carbSpanSm.classList.add(
    "fmt-font-1",
    "d-sm-none",
    "fmt-meal-carbs",
    "fmt-font-color-violet"
  );
  carbSpanMd.innerHTML = "Carbohydrates: ";
  carbSpanSm.innerHTML = "Carbs: ";
  const mCarbsDiv = document.createElement("div");
  mCarbsDiv.classList.add("col-4", "fmt-center-text", "pl-0", "pr-0");
  mCarbsDiv.appendChild(carbSpanMd);
  mCarbsDiv.appendChild(carbSpanSm);

  const proteinSpan = document.createElement("span");
  proteinSpan.classList.add(
    "fmt-font-1",
    "fmt-meal-proteins",
    "fmt-font-color-info"
  );
  proteinSpan.innerHTML = "Proteins: ";
  const mProtDiv = document.createElement("div");
  mProtDiv.classList.add("col-4", "fmt-center-text", "pl-0", "pr-0");
  mProtDiv.appendChild(proteinSpan);

  const fatsSpan = document.createElement("span");
  fatsSpan.classList.add(
    "fmt-font-1",
    "fmt-meal-fats",
    "fmt-font-color-orange"
  );
  fatsSpan.innerHTML = "Fats: ";
  const mFatsDiv = document.createElement("div");
  mFatsDiv.classList.add("col-4", "fmt-center-text", "pl-0", "pr-0");
  mFatsDiv.appendChild(fatsSpan);

  const w100 = document.createElement("div");
  w100.classList.add("w-100");

  const mCarbsProg = document.createElement("span");
  mCarbsProg.setAttribute(
    "id",
    `overview-meal-${normalizedMealName}-carb-progress`
  );
  mCarbsProg.classList.add("fmt-font-1", "fmt-font-color-violet");
  //Inner HTML is 0 at creation and updated later with each meal
  mCarbsProg.innerHTML = "0";
  const mCarbsProgDiv = document.createElement("div");
  mCarbsProgDiv.classList.add("fmt-center-text", "col-3", "ml-1", "mr-1");
  mCarbsProgDiv.appendChild(mCarbsProg);

  const mProtProg = document.createElement("span");
  mProtProg.setAttribute(
    "id",
    `overview-meal-${normalizedMealName}-protein-progress`
  );
  mProtProg.classList.add("fmt-font-1", "fmt-font-color-info");
  mProtProg.innerHTML = "0";
  const mProtProgDiv = document.createElement("div");
  mProtProgDiv.classList.add("fmt-center-text", "col-3");
  mProtProgDiv.appendChild(mProtProg);

  const mFatsProg = document.createElement("span");
  mFatsProg.setAttribute(
    "id",
    `overview-meal-${normalizedMealName}-fat-progress`
  );
  mFatsProg.classList.add("fmt-font-1", "fmt-font-color-orange");
  mFatsProg.innerHTML = "0";
  const mFatsProgDiv = document.createElement("div");
  mFatsProgDiv.classList.add("fmt-center-text", "col-3", "ml-1", "mr-1");
  mFatsProgDiv.appendChild(mFatsProg);

  // Values inline
  mCarbsDiv.appendChild(mCarbsProg);
  mProtDiv.appendChild(mProtProg);
  mFatsDiv.appendChild(mFatsProg);

  mealFooterDiv.appendChild(mealFooterAddDiv);
  mealFooterDiv.appendChild(mCarbsDiv);
  mealFooterDiv.appendChild(mProtDiv);
  mealFooterDiv.appendChild(mFatsDiv);
  // mealFooterDiv.appendChild(w100);
  // mealFooterDiv.appendChild(mCarbsProgDiv);
  // mealFooterDiv.appendChild(mProtProgDiv);
  // mealFooterDiv.appendChild(mFatsProgDiv);

  //Final Meal
  mealDiv.appendChild(mealHeaderDiv);
  mealDiv.appendChild(mealEntriesDiv);
  mealDiv.appendChild(mealFooterDiv);
  return mealDiv;
}
function FMTOverviewCreateMealEntryNode(mealEntryObj, validate) {
  let mealEntry = mealEntryObj;
  if (validate) {
    let res = FMTValidateMealEntry(mealEntryObj);
    if (res.mealEntry == null || res.error != null) {
      console.error(
        `Error validating Meal Entry Object (${mealEntryObj}) . Error - ${res.error}`
      );
      return;
    }
    mealEntry = res.mealEntry;
  }
  const normalizedMealName = mealEntry.mealName
    .replace(/ /g, "_")
    .replace(/-/g, "_");

  const mealEntryDiv = document.createElement("div");
  const mealEntryId = `overview-meal-${mealEntry.entry_id}`;
  mealEntryDiv.classList.add(
    "fmt-meal-entry",
    "col",
    "row",
    "justify-content-between"
  );
  mealEntryDiv.setAttribute("id", mealEntryId);
  mealEntryDiv.setAttribute("entry_id", mealEntry.entry_id);
  mealEntryDiv.setAttribute("calories", mealEntry.nutritionalValue.calories);
  mealEntryDiv.setAttribute(
    "carbohydrates",
    mealEntry.nutritionalValue.carbohydrates
  );
  mealEntryDiv.setAttribute("proteins", mealEntry.nutritionalValue.proteins);
  mealEntryDiv.setAttribute("fats", mealEntry.nutritionalValue.fats);
  mealEntryDiv.addEventListener("click", function () {
    const mealDiv = document.getElementById(mealEntryId);
    const entry_id = mealDiv.getAttribute("entry_id");
    console.debug(`Meal Entry with ID ${entry_id} Clicked`);
    pageController.openEditMealEntryDynamicScreen(
      entry_id,
      1,
      true,
      undefined,
      undefined
    );
  });

  const consNameSpan = document.createElement("span");
  consNameSpan.classList.add("fmt-font-1", "float-left");
  consNameSpan.innerHTML = `${mealEntry.consumableName}`;
  const consNameDiv = document.createElement("div");
  consNameDiv.classList.add("col-6");
  consNameDiv.appendChild(consNameSpan);

  const consKcalSpan = document.createElement("span");
  consKcalSpan.classList.add("fmt-font-1", "float-right");
  consKcalSpan.innerHTML = `${roundedToFixed(
    mealEntry.nutritionalValue.calories,
    0
  )}kCal`;
  const consKcalDiv = document.createElement("div");
  consKcalDiv.classList.add("col-6");
  consKcalDiv.appendChild(consKcalSpan);

  const consDetailsSpan = document.createElement("span");
  consDetailsSpan.classList.add("fmt-font-sm", "float-left");
  consDetailsSpan.innerHTML = `${
    mealEntry.consumableBrand ? `${mealEntry.consumableBrand}, ` : ""
  }${mealEntry.serving}${mealEntry.units}`;
  const consDetailsDiv = document.createElement("div");
  consDetailsDiv.classList.add("col-6");
  consDetailsDiv.appendChild(consDetailsSpan);

  const consNutriValueDiv = document.createElement("div");
  consNutriValueDiv.classList.add("col-4", "float-right");
  // const consNutriValueSpan = document.createElement("span");
  // consNutriValueSpan.classList.add("fmt-font-sm", "float-right");
  // consNutriValueSpan.innerHTML = `Carb:${roundedToFixed(mealEntry.nutritionalValue.carbohydrates)} Protein:${roundedToFixed(mealEntry.nutritionalValue.proteins)} Fat:${roundedToFixed(mealEntry.nutritionalValue.fats)}`;
  // consNutriValueDiv.appendChild(consNutriValueSpan);

  const _progress = FMTCreateMacroProgressBar(
    mealEntry.nutritionalValue.carbohydrates,
    mealEntry.nutritionalValue.proteins,
    mealEntry.nutritionalValue.fats,
    fmtAppInstance.mealEntryMacroBarInPercent
  );
  consNutriValueDiv.appendChild(_progress);

  mealEntryDiv.appendChild(consNameDiv);
  mealEntryDiv.appendChild(consKcalDiv);
  mealEntryDiv.appendChild(consDetailsDiv);
  mealEntryDiv.appendChild(consNutriValueDiv);
  return mealEntryDiv;
}
function FMTOverviewUpdateMealProgress(targetID) {
  const mealDiv = document.getElementById(targetID);
  const mealEntries = mealDiv.getElementsByClassName("fmt-meal-entry");
  const totalNutriValue = {
    calories: 0,
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
  };
  for (let i = 0; i < mealEntries.length; i++) {
    const mealEntryDiv = mealEntries[i];
    const cal = Number(mealEntryDiv.getAttribute("calories"));
    const carb = Number(mealEntryDiv.getAttribute("carbohydrates"));
    const prot = Number(mealEntryDiv.getAttribute("proteins"));
    const fat = Number(mealEntryDiv.getAttribute("fats"));
    totalNutriValue.calories += cal;
    totalNutriValue.carbohydrates += carb;
    totalNutriValue.proteins += prot;
    totalNutriValue.fats += fat;
  }
  const calProgSpan = document.getElementById(`${targetID}-calories-progress`);
  const carbProgSpan = document.getElementById(`${targetID}-carb-progress`);
  const proteinProgSpan = document.getElementById(
    `${targetID}-protein-progress`
  );
  const fatProgSpan = document.getElementById(`${targetID}-fat-progress`);
  calProgSpan.innerHTML = `${roundedToFixed(totalNutriValue.calories, 0)}kCal`;
  carbProgSpan.innerHTML = roundedToFixed(
    totalNutriValue.carbohydrates,
    DEFAULT_ROUNDING_PRECISION
  );
  proteinProgSpan.innerHTML = roundedToFixed(
    totalNutriValue.proteins,
    DEFAULT_ROUNDING_PRECISION
  );
  fatProgSpan.innerHTML = roundedToFixed(
    totalNutriValue.fats,
    DEFAULT_ROUNDING_PRECISION
  );
}
function FMTOverviewUpdateTotalProgress(sourceID) {
  const mealsContainerDiv = document.getElementById(sourceID);
  const mealEntries =
    mealsContainerDiv.getElementsByClassName("fmt-meal-entry");
  const totalNutriValue = {
    calories: 0,
    proteins: 0,
    carbohydrates: 0,
    fats: 0,
  };
  for (let i = 0; i < mealEntries.length; i++) {
    const mealEntryDiv = mealEntries[i];
    const cal = Number(mealEntryDiv.getAttribute("calories"));
    const carb = Number(mealEntryDiv.getAttribute("carbohydrates"));
    const prot = Number(mealEntryDiv.getAttribute("proteins"));
    const fat = Number(mealEntryDiv.getAttribute("fats"));
    totalNutriValue.calories += cal;
    totalNutriValue.carbohydrates += carb;
    totalNutriValue.proteins += prot;
    totalNutriValue.fats += fat;
  }
  const calProgBar = document.getElementById("calories-progress-bar");
  const carbProgBar = document.getElementById("carb-progress-bar");
  const proteinProgBar = document.getElementById("protein-progress-bar");
  const fatProgBar = document.getElementById("fat-progress-bar");

  const calTotalSpan = document.getElementById("overview-total-calories");
  const carbTotalSpan = document.getElementById("overview-total-carbs");
  const proteinTotalSpan = document.getElementById("overview-total-proteins");
  const fatTotalSpan = document.getElementById("overview-total-fats");

  const calTotalVerbSpan = document.getElementById(
    "overview-total-calories-verb"
  );
  const carbTotalVerbSpan = document.getElementById(
    "overview-total-carbs-verb"
  );
  const proteinTotalVerbSpan = document.getElementById(
    "overview-total-proteins-verb"
  );
  const fatTotalVerbSpan = document.getElementById("overview-total-fats-verb");

  calTotalSpan.innerHTML = `${roundedToFixed(totalNutriValue.calories, 0)}kCal`;
  carbTotalSpan.innerHTML = `${roundedToFixed(
    totalNutriValue.carbohydrates,
    0
  )}g`;
  proteinTotalSpan.innerHTML = `${roundedToFixed(
    totalNutriValue.proteins,
    0
  )}g`;
  fatTotalSpan.innerHTML = `${roundedToFixed(totalNutriValue.fats, 0)}g`;

  const profile = fmtAppInstance.currentDayUserGoals;
  if (
    profile &&
    profile.macroSplit.Protein &&
    profile.macroSplit.Carbohydrate &&
    profile.macroSplit.Fat &&
    profile.macroSplit.Calories
  ) {
    const dailyProtein =
      ((profile.macroSplit.Protein / 100) * profile.macroSplit.Calories) / 4;
    const dailyCarbs =
      ((profile.macroSplit.Carbohydrate / 100) * profile.macroSplit.Calories) /
      4;
    const dailyFats =
      ((profile.macroSplit.Fat / 100) * profile.macroSplit.Calories) / 9;

    const calPercent = Number(
      roundedToFixed(
        (totalNutriValue.calories / profile.macroSplit.Calories) * 100,
        DEFAULT_ROUNDING_PRECISION
      )
    );
    calProgBar.setAttribute("aria-valuenow", calPercent.toString());
    calProgBar.style.width = `${calPercent >= 100 ? 100 : calPercent}%`;
    if (calPercent > 100) {
      calProgBar.classList.add("bg-danger");
    } else {
      calProgBar.classList.remove("bg-danger");
    }
    calTotalVerbSpan.innerHTML = `${roundedToFixed(
      totalNutriValue.calories,
      0
    )}/${roundedToFixed(profile.macroSplit.Calories, 0)}kCal`;

    const carbPercent = Number(
      roundedToFixed(
        (totalNutriValue.carbohydrates / dailyCarbs) * 100,
        DEFAULT_ROUNDING_PRECISION
      )
    );
    carbProgBar.setAttribute("aria-valuenow", carbPercent.toString());
    carbProgBar.style.width = `${carbPercent >= 100 ? 100 : carbPercent}%`;
    if (carbPercent > 100) {
      carbProgBar.classList.add("bg-danger");
    } else {
      carbProgBar.classList.remove("bg-danger");
    }
    carbTotalVerbSpan.innerHTML = `${roundedToFixed(
      totalNutriValue.carbohydrates,
      0
    )}/${roundedToFixed(dailyCarbs, 0)}g`;

    const proteinPercent = Number(
      roundedToFixed(
        (totalNutriValue.proteins / dailyProtein) * 100,
        DEFAULT_ROUNDING_PRECISION
      )
    );
    proteinProgBar.setAttribute("aria-valuenow", proteinPercent.toString());
    proteinProgBar.style.width = `${
      proteinPercent >= 100 ? 100 : proteinPercent
    }%`;
    if (proteinPercent > 100) {
      proteinProgBar.classList.add("bg-danger");
    } else {
      proteinProgBar.classList.remove("bg-danger");
    }
    proteinTotalVerbSpan.innerHTML = `${roundedToFixed(
      totalNutriValue.proteins,
      0
    )}/${roundedToFixed(dailyProtein, 0)}g`;

    const fatPercent = Number(
      roundedToFixed(
        (totalNutriValue.fats / dailyFats) * 100,
        DEFAULT_ROUNDING_PRECISION
      )
    );
    fatProgBar.setAttribute("aria-valuenow", fatPercent.toString());
    fatProgBar.style.width = `${fatPercent >= 100 ? 100 : fatPercent}%`;
    if (fatPercent > 100) {
      fatProgBar.classList.add("bg-danger");
    } else {
      fatProgBar.classList.remove("bg-danger");
    }
    fatTotalVerbSpan.innerHTML = `${roundedToFixed(
      totalNutriValue.fats,
      0
    )}/${roundedToFixed(dailyFats, 0)}g`;
  } else {
    calTotalVerbSpan.innerHTML = `${roundedToFixed(
      totalNutriValue.calories,
      0
    )}kCal`;
    carbTotalVerbSpan.innerHTML = `${roundedToFixed(
      totalNutriValue.carbohydrates,
      0
    )}g`;
    proteinTotalVerbSpan.innerHTML = `${roundedToFixed(
      totalNutriValue.proteins,
      0
    )}g`;
    fatTotalVerbSpan.innerHTML = `${roundedToFixed(totalNutriValue.fats, 0)}g`;
  }
}
function FMTOverviewAddMealEntry(mealEntryObj, validate) {
  let mealEntry = mealEntryObj;
  if (validate) {
    let res = FMTValidateMealEntry(mealEntryObj);
    if (res.mealEntry == null || res.error != null) {
      console.error(
        `Error validating Meal Entry Object (${mealEntryObj}) . Error - ${res.error}`
      );
      return;
    }
    mealEntry = res.mealEntry;
  }
  const normalizedMealName = mealEntry.mealName
    .replace(/ /g, "_")
    .replace(/-/g, "_");
  let mealDiv = document.getElementById(`overview-meal-${normalizedMealName}`);
  if (!mealDiv) {
    mealDiv = FMTOverviewCreateMealNode(mealEntry, false);
    document.getElementById("overview-meals-container").appendChild(mealDiv);
    mealDiv = document.getElementById(`overview-meal-${normalizedMealName}`);
  }
  let mealEntryDiv = FMTOverviewCreateMealEntryNode(mealEntry, false);
  const w100 = document.createElement("div");
  w100.classList.add("w-100");
  const mealEntriesDiv = document.getElementById(
    `overview-meal-${normalizedMealName}-entries`
  );
  mealEntriesDiv.appendChild(mealEntryDiv);
  mealEntriesDiv.appendChild(w100);
  FMTOverviewUpdateMealProgress(`overview-meal-${normalizedMealName}`);
}
function FMTOverviewSetDateStrings(dateStr) {
  for (let i = 0; i < fmtAppGlobals.dateDivIDs.length; i++) {
    const _id = fmtAppGlobals.dateDivIDs[i];
    document.getElementById(_id).innerHTML = dateStr;
  }
}
function FMTLoadCurrentDayUserGoals(onsuccessFn, onerrorFn) {
  //Query for User Goals from currentDay onwards. Take either current day, or first day found after it
  let userGoalsQueryOpts = {
    queryType: "bound",
    lowerOpen: false,
    upperOpen: false,
    yProfileId: fmtAppInstance.currentProfileId,
    yYear: Infinity,
    yMonth: Infinity,
    yDay: Infinity,
  };
  let goalCount = 0;
  let userGoalFound = false;

  let onOpenUserGoalsCursorSuccessFn = function (ev) {
    let cursor = ev.target.result;
    if (cursor) {
      goalCount++;
      const validate = FMTValidateUserGoals(cursor.value);
      if (validate.userGoals != null && validate.error == null) {
        if (!userGoalFound) {
          userGoalFound = true;
          fmtAppInstance.currentDayUserGoals = validate.userGoals;
          const goalDate = new Date(
            validate.userGoals.year,
            validate.userGoals.month,
            validate.userGoals.day
          );
          let msg;
          if (isSameDay(fmtAppInstance.currentDay, goalDate)) {
            msg = "Found Current Day User Goals";
          } else {
            //Update date
            msg = `Found User Goals from ${goalDate}`;
            fmtAppInstance.currentDayUserGoals.year =
              fmtAppInstance.currentDay.getFullYear();
            fmtAppInstance.currentDayUserGoals.month =
              fmtAppInstance.currentDay.getMonth();
            fmtAppInstance.currentDayUserGoals.day =
              fmtAppInstance.currentDay.getDate();
            FMTAddUserGoalEntry(
              fmtAppInstance.currentDayUserGoals,
              undefined,
              undefined
            );
          }
          console.debug(
            `${msg} - ${JSON.stringify(fmtAppInstance.currentDayUserGoals)}`
          );
        }
      }
      cursor.continue();
    } else {
      //Sync tasks
      if (!userGoalFound) {
        // If profile is created and macro split is initialized, copy goals from current split
        if (
          fmtAppInstance.currentProfile &&
          !jQuery.isEmptyObject(fmtAppInstance.currentProfile.macroSplit)
        ) {
          console.info(
            "Couldn't find any matching user Goals. Creating one based on current Profile!"
          );
          const userGoals = {
            macroSplit: fmtAppInstance.currentProfile.macroSplit,
            year: fmtAppInstance.currentDay.getFullYear(),
            month: fmtAppInstance.currentDay.getMonth(),
            day: fmtAppInstance.currentDay.getDate(),
            profile_id: fmtAppInstance.currentProfileId,
          };
          fmtAppInstance.currentDayUserGoals = userGoals;
          //Async tasks
          FMTAddUserGoalEntry(userGoals, undefined, onerrorFn);
        } else {
          console.warn(
            "Couldn't find any matching user Goals. and no Profile currently loaded!"
          );
          //if (onerrorFn) { return onerrorFn(); }
        }
      }
      if (onsuccessFn) {
        onsuccessFn();
      }
    }
  };
  let onOpenUserGoalsCursorErrorFn = function () {
    const msg = `Failed loading Current Day - ${fmtAppInstance.currentDay.getFullYear()}-${fmtAppInstance.currentDay.getMonth()}-${fmtAppInstance.currentDay.getDate()}`;
    console.error(msg);
    FMTShowAlertBar(
      `${msg}\nPlease reload Free Macro Tracker!`,
      "overview-alerts",
      "danger"
    );
  };
  FMTQueryUserGoalsByProfileAndDate(
    fmtAppInstance.currentProfileId,
    fmtAppInstance.currentDay.getFullYear(),
    fmtAppInstance.currentDay.getMonth(),
    fmtAppInstance.currentDay.getDate(),
    onOpenUserGoalsCursorSuccessFn,
    onOpenUserGoalsCursorErrorFn,
    userGoalsQueryOpts
  );
  //End User Goals Query
}
function FMTOverviewLoadMealEntries(onsuccessFn, onerrorFn) {
  //Query for Meals based on current Profile ID and currentDate
  let queryOpts = { queryType: "only" };
  let entryCount = 0;
  document.getElementById("overview-meals-container").innerHTML = "";
  let lastMealEntry;
  //TODO - review logic for default meals
  if (
    Array.isArray(fmtAppInstance.defaultMeals) &&
    fmtAppInstance.defaultMeals.length > 0
  ) {
    const mealContainer = document.getElementById("overview-meals-container");
    fmtAppInstance.defaultMeals.forEach((item) => {
      const _mealobj = {
        year: fmtAppInstance.currentDay.getFullYear(),
        month: fmtAppInstance.currentDay.getMonth(),
        day: fmtAppInstance.currentDay.getDate(),
        mealName: item,
        profile_id: fmtAppInstance.currentProfileId,
      };
      const defaultMealNode = FMTOverviewCreateMealNode(_mealobj, false);
      mealContainer.appendChild(defaultMealNode);
    });
  }

  const onOpenCursorSuccessFn = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      let mealEntryObj = cursor.value;
      FMTOverviewAddMealEntry(mealEntryObj, true);
      entryCount++;
      lastMealEntry = mealEntryObj;
      cursor.continue();
    } else {
      //Sync tasks
      onsuccessFn =
        onsuccessFn ||
        function () {
          console.debug(`Loaded ${entryCount} meal entry records`);
        };
      //Async tasks
      FMTOverviewUpdateTotalProgress("overview-meals-container");
      if (onsuccessFn) {
        onsuccessFn();
      }
    }
  };

  FMTQueryMealEntriesByProfileAndDate(
    fmtAppInstance.currentProfileId,
    fmtAppInstance.currentDay.getFullYear(),
    fmtAppInstance.currentDay.getMonth(),
    fmtAppInstance.currentDay.getDate(),
    onOpenCursorSuccessFn,
    onerrorFn,
    queryOpts
  );
  //End Query for Meal Entries
}
function FMTOverviewLoadCurrentDay(onsuccessFn?: any, onerrorFn?: any) {
  //Handle dates
  FMTToday();
  const thisYear = fmtAppInstance.today.getFullYear();
  const thisMonth = fmtAppInstance.today.getMonth();
  const thisDay = fmtAppInstance.today.getDate();

  const tomorrow = new Date(thisYear, thisMonth, thisDay + 1);
  const yesterday = new Date(thisYear, thisMonth, thisDay - 1);

  if (isSameDay(fmtAppInstance.currentDay, fmtAppInstance.today)) {
    FMTOverviewSetDateStrings("Today");
  } else if (isSameDay(fmtAppInstance.currentDay, yesterday)) {
    FMTOverviewSetDateStrings("Yesterday");
  } else if (isSameDay(fmtAppInstance.currentDay, tomorrow)) {
    FMTOverviewSetDateStrings("Tomorrow");
  } else {
    FMTOverviewSetDateStrings(
      formatDate(fmtAppInstance.currentDay, OVERVIEW_DATE_FORMAT)
    );
  }

  if (
    fmtAppInstance.currentDayUserGoals == null ||
    !isSameDay(
      fmtAppInstance.currentDay,
      new Date(
        fmtAppInstance.currentDayUserGoals.year,
        fmtAppInstance.currentDayUserGoals.month,
        fmtAppInstance.currentDayUserGoals.day
      )
    )
  ) {
    FMTLoadCurrentDayUserGoals(function () {
      FMTOverviewLoadMealEntries(onsuccessFn, onerrorFn);
    }, onerrorFn);
  } else {
    FMTOverviewLoadMealEntries(onsuccessFn, onerrorFn);
  }
}

//Functions - UI - Foods and Recipes
function FMTToggleFoodMenu(baseId, qualifier) {
  //Buttons
  const ul = document.getElementById(`${baseId}-toggles`);
  if (!ul) {
    return;
  }
  const btns = ul.getElementsByTagName("li");
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove("fmt-tab-li-active");
  }
  document
    .getElementById(`${baseId}-my-${qualifier}-btn`)
    .classList.add("fmt-tab-li-active");
  document.getElementById(`${baseId}-add`).setAttribute("action", qualifier);
  //Search bar and table
  const qualifiersToHide = [];
  switch (qualifier) {
    case "food":
      qualifiersToHide.push("recipe");
      break;
    case "recipe":
      qualifiersToHide.push("food");
      break;
  }
  qualifiersToHide.forEach((qual) => {
    const searchContainerToHide = document.getElementById(
      `${baseId}-${qual}-search-cont`
    );
    const tableContainerToHide = document.getElementById(
      `${baseId}-${qual}-table-cont`
    );
    if (searchContainerToHide && tableContainerToHide) {
      searchContainerToHide.classList.add("d-none");
      tableContainerToHide.classList.add("d-none");
    }
  });
  document
    .getElementById(`${baseId}-${qualifier}-search-cont`)
    .classList.remove("d-none");
  document
    .getElementById(`${baseId}-${qualifier}-table-cont`)
    .classList.remove("d-none");
}
function FMTUICreateIngredient(food) {
  const col = FMTUICreateTextArea(
    "input",
    undefined,
    undefined,
    undefined,
    true,
    ["fmt-recipe-ingredient-cont"],
    ["fmt-recipe-ingredient"]
  );
  const input = col.getElementsByTagName("input")[0];
  input.value = `${food.foodName} ${food.referenceServing}/${food.units}`;
  input.setAttribute("food_id", food.food_id);
  input.setAttribute("referenceServing", food.referenceServing);
  input.setAttribute("units", food.units);
  return col;
}
function FMTUIAddIngredient(foodObj, ingredientsDiv, onDel, onEdit) {
  const _funcName = "FMTUIAddIngredient";
  const _res = FMTValidateFoodObject(foodObj, fmtAppInstance.unitsChart);
  if (_res.error != null || _res.food == null) {
    console.error(`[${_funcName}] - Error validating food`);
    return;
  }
  const food = _res.food;
  food.food_id = foodObj.food_id;
  const col = FMTUICreateIngredient(food);
  const input = col.getElementsByTagName("input")[0];
  const editBtn = document.createElement("button");
  editBtn.classList.add("btn", "btn-secondary", "fal", "fa-pencil-alt", "mr-1");
  editBtn.addEventListener("click", () => {
    //TODO - implement edit ingredient screen
    if (isFunction(onEdit)) {
      onEdit(col, input);
    }
  });
  const delBtn = document.createElement("button");
  delBtn.classList.add("btn", "btn-danger", "fal", "fa-trash-alt");
  delBtn.addEventListener("click", () => {
    ingredientsDiv.removeChild(col);
    if (isFunction(onDel)) {
      onDel();
    }
  });
  input.parentElement.insertAdjacentElement("beforeend", editBtn);
  input.parentElement.insertAdjacentElement("beforeend", delBtn);
  const lastElement =
    ingredientsDiv.children[ingredientsDiv.children.length - 1];
  ingredientsDiv.insertBefore(col, lastElement);
}
function FMTUIRefreshPreparationStepNumbers(prepStepContainerDiv) {
  if (prepStepContainerDiv == null) {
    return;
  }
  const exisitingSteps = prepStepContainerDiv.getElementsByClassName(
    "fmt-recipe-step-cont"
  );
  let j = 1;
  for (let i = 0; i < exisitingSteps.length; i++) {
    const step = exisitingSteps[i];
    const labels = step.getElementsByTagName("label");
    if (labels != null && labels.length > 0) {
      labels[0].innerText = `Step ${j}`;
      j++;
    }
  }
}
function FMTUIGetPreparationSteps(prepStepContainerDiv) {
  if (prepStepContainerDiv == null) {
    return;
  }
  const exisitingSteps = prepStepContainerDiv.getElementsByClassName(
    "fmt-recipe-step-cont"
  );
  const steps = [];
  for (let i = 0; i < exisitingSteps.length; i++) {
    const step = exisitingSteps[i];
    const textareas = step.getElementsByTagName("textarea");
    if (textareas != null && textareas.length > 0) {
      steps.push(textareas[0].value);
    }
  }
  return steps;
}
function FMTUIAddPreparationStep(
  prepStepContainerDiv: HTMLElement,
  scroll: boolean,
  addStepDelBtn?: boolean,
  column?: HTMLElement
) {
  addStepDelBtn = addStepDelBtn == undefined ? true : addStepDelBtn;
  const exisitingSteps = prepStepContainerDiv.getElementsByClassName(
    "fmt-recipe-step-cont"
  );
  const nextStepNum = exisitingSteps.length + 1;
  let col;
  if (column == undefined) {
    col = FMTUICreateTextArea(
      "textarea",
      `Step ${nextStepNum}`,
      "Preparation Step",
      undefined,
      false,
      ["fmt-recipe-step-cont"],
      ["fmt-textarea"]
    );
  } else {
    col = column;
  }
  const textarea = col.getElementsByTagName("textarea")[0];
  if (addStepDelBtn) {
    const delBtn = document.createElement("button");
    delBtn.classList.add("btn", "btn-danger", "fal", "fa-trash-alt", "ml-2");
    delBtn.addEventListener("click", () => {
      prepStepContainerDiv.removeChild(col);
      FMTUIRefreshPreparationStepNumbers(prepStepContainerDiv);
    });
    textarea.parentNode.insertAdjacentElement("beforeend", delBtn);
  }
  const lastElement =
    prepStepContainerDiv.children[prepStepContainerDiv.children.length - 1];
  prepStepContainerDiv.insertBefore(col, lastElement);
  if (scroll === true) {
    col.scrollIntoView();
  }
}
function FMTUIAddIngredientBtnClick(
  baseId,
  recipeBaseId,
  ingredientScreenCloseFn,
  menuScreenCloseFn,
  ingredients
) {
  const addBtn = document.getElementById(`${baseId}-add`);
  const recipeScreen = document.getElementById(recipeBaseId);
  if (addBtn == null || recipeScreen == null) {
    return;
  }
  if (!isFunction(ingredientScreenCloseFn) || !isFunction(menuScreenCloseFn)) {
    return;
  }

  let foodId = addBtn.getAttribute("food_id");
  if (FMTIsValidId(foodId)) {
    addBtn.removeAttribute("food_id");
    const foodObj = FMTSaveConsumableItemScreen(
      baseId,
      "get-object",
      undefined,
      "food",
      "Food Item",
      true,
      undefined,
      undefined
    );
    const _validate = FMTValidateFoodObject(foodObj, fmtAppInstance.unitsChart);
    if (_validate.error != null || _validate.food == null) {
      console.error(`Error validating ingredient (ID ${foodId})`);
      return;
    }
    const food = _validate.food;
    food.food_id = Number(foodId);
    ingredientScreenCloseFn();
    const baseIngredientsID = `${recipeBaseId}-recipe-ingredients`;
    const ingredientsDiv = document.getElementById(baseIngredientsID);

    const onModified = () => {
      const nutritionalValue = FMTSumIngredients(
        ingredients,
        fmtAppInstance.unitsChart
      );
      FMTUIPopulateNutritionalValue(
        recipeBaseId,
        "recipe",
        nutritionalValue,
        1,
        true,
        true,
        false
      );
    };

    const onEdit = (col, input) => {
      const _recipe = { ingredients };
      const onEdited = () => {
        onModified();
        input.value = `${food.foodName} ${food.referenceServing}/${food.units}`;
        input.setAttribute("food_id", food.food_id);
        input.setAttribute("referenceServing", food.referenceServing);
        input.setAttribute("units", food.units);
      };
      pageController.openEditIngredientDynamicScreen(
        _recipe,
        food,
        1,
        true,
        undefined,
        undefined,
        onEdited
      );
    };

    const onDel = () => {
      const idx = indexesOfObjectMulti(ingredients, {
        food_id: foodId,
        referenceServing: food.referenceServing,
        units: food.units,
      });
      if (idx.length > 0) {
        console.debug(
          `Found ${idx.length} items matching for deletion, removing first`
        );
        ingredients.splice(idx[0], 1);
      }
      onModified();
    };

    FMTUIAddIngredient(foodObj, ingredientsDiv, onDel, onEdit);
    ingredients.push(food);
    //TODO - check what is better to leave it open or closed
    menuScreenCloseFn();
  } else {
    console.error(`Invalid food Id ${foodId} on Add Ingredient`);
  }
}
function FMTUIAddtoMealBtnClick(baseId, qualifier, objectType, event) {
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    console.error(`Invalid qualifier ${qualifier}`);
    return;
  }
  if (fmtAppGlobals.consumableTypes.indexOf(objectType) < 0) {
    console.error(`Invalid Object Type ${objectType}`);
    return;
  }
  const addToMealBtn = document.getElementById(`${baseId}-save`);
  const mealIdentifierObj = {
    meal_year:
      addToMealBtn.getAttribute("meal_year") ||
      // @ts-ignore
      document.getElementById(`${baseId}-meal-year`).value,
    meal_month:
      addToMealBtn.getAttribute("meal_month") ||
      // @ts-ignore
      Number(document.getElementById(`${baseId}-meal-month`).value) - 1,
    meal_day:
      addToMealBtn.getAttribute("meal_day") ||
      // @ts-ignore
      document.getElementById(`${baseId}-meal-day`).value,
    meal_name:
      addToMealBtn.getAttribute("meal_name") ||
      // @ts-ignore
      document.getElementById(`${baseId}-meal-name`).value,
    profile_id:
      addToMealBtn.getAttribute("profile_id") ||
      fmtAppInstance.currentProfileId,
  };

  if (
    !mealIdentifierObj.meal_year ||
    !mealIdentifierObj.meal_month ||
    !mealIdentifierObj.meal_day ||
    !mealIdentifierObj.meal_name
  ) {
    document.getElementById(`${baseId}-add-to-meal`).classList.remove("d-none");
    FMTShowAlert(
      `${baseId}-alerts`,
      "primary",
      "Please enter the Year, Month and Day as well as the Meal Name into which to add"
    );
    return;
  }
  const validateMealIdentifierObjRes =
    FMTValidateMealIdentifier(mealIdentifierObj);
  if (
    validateMealIdentifierObjRes.mealIdentifier == null ||
    validateMealIdentifierObjRes.error != null
  ) {
    console.error(validateMealIdentifierObjRes.error);
    FMTShowAlert(
      `${baseId}-alerts`,
      "danger",
      `Error - ${validateMealIdentifierObjRes.error}`
    );
    return;
  }
  const mealIdentifier = validateMealIdentifierObjRes.mealIdentifier;
  //Collect values from screen and insert to DB
  //TODO get property names!!!
  const consumableValues = FMTSaveConsumableItemScreen(
    baseId,
    "get-object",
    undefined,
    qualifier,
    objectType,
    true,
    undefined,
    undefined
  );
  let idProp, nameProp, brandProp, closeFn;
  switch (objectType) {
    case "Food Item":
      idProp = "food_id";
      nameProp = "foodName";
      brandProp = "foodBrand";
      closeFn = pageController.closeViewFoodDynamicScreen;
      break;
    case "Recipe Item":
      idProp = "recipe_id";
      nameProp = "recipeName";
      brandProp = "recipeCreator";
      closeFn = pageController.closeViewRecipeDynamicScreen;
      break;
  }
  const mealEntryObj = {
    profile_id: mealIdentifier.profile_id,
    year: mealIdentifier.meal_year,
    month: mealIdentifier.meal_month,
    day: mealIdentifier.meal_day,
    mealName: mealIdentifier.meal_name,
    consumable_id: Number(addToMealBtn.getAttribute(idProp)),
    consumableName: consumableValues[nameProp],
    consumableBrand: consumableValues[brandProp],
    consumableType: objectType,
    serving: consumableValues.referenceServing,
    units: consumableValues.units,
    nutritionalValue: consumableValues.nutritionalValue,
  };
  FMTAddMealEntry(
    mealEntryObj,
    function () {
      console.debug("Successfully added meal entry");
      console.log(mealEntryObj);
      closeFn();
      pageController.showOverview(false);
    },
    function () {
      const msg = "Failed adding meal entry";
      console.error(msg);
      console.error(mealEntryObj);
      FMTShowAlertBar(msg, `${baseId}-alerts`, "danger");
    }
  );
}
function FMTUIEditBtnClick(baseId, qualifier, objectType, event) {
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    console.error(`Invalid qualifier ${qualifier}`);
    return;
  }
  if (fmtAppGlobals.consumableTypes.indexOf(objectType) < 0) {
    console.error(`Invalid Object Type ${objectType}`);
    return;
  }
  let idProp, isValidIDFn, screenFn;
  switch (objectType) {
    case "Food Item":
      idProp = "food_id";
      isValidIDFn = FMTIsValidId;
      screenFn = pageController.openEditFoodDynamicScreen;
      break;
    case "Recipe Item":
      idProp = "recipe_id";
      isValidIDFn = FMTIsValidId;
      screenFn = pageController.openEditRecipeDynamicScreen;
      break;
    default:
      return;
  }
  const editBtn = document.getElementById(`${baseId}-edit`);
  let consumableId = editBtn.getAttribute(idProp);
  if (!isValidIDFn(consumableId)) {
    const msg = `Invalid ${objectType} ID (${consumableId}). Please reload`;
    console.error(msg);
    FMTShowAlertBar(msg, `${baseId}-alerts`, "danger");
    // FMTShowAlert(`${baseId}-alerts`, "danger", msg, fmtAppGlobals.defaultAlertScroll);
    return;
  }
  let consumablesTableBodyID;
  if (editBtn) {
    consumablesTableBodyID = editBtn.getAttribute("consumables-table-body-id");
  }
  const addToMealBtn = document.getElementById(`${baseId}-save`);
  const mealIdentifierObj = {
    meal_year:
      addToMealBtn.getAttribute("meal_year") ||
      // @ts-ignore
      document.getElementById(`${baseId}-meal-year`).value,
    meal_month:
      addToMealBtn.getAttribute("meal_month") ||
      // @ts-ignore
      Number(document.getElementById(`${baseId}-meal-month`).value) - 1,
    meal_day:
      addToMealBtn.getAttribute("meal_day") ||
      // @ts-ignore
      document.getElementById(`${baseId}-meal-day`).value,
    meal_name:
      addToMealBtn.getAttribute("meal_name") ||
      // @ts-ignore
      document.getElementById(`${baseId}-meal-name`).value,
    profile_id:
      addToMealBtn.getAttribute("profile_id") ||
      fmtAppInstance.currentProfileId,
  };
  const validateMealIdentifierObjRes =
    FMTValidateMealIdentifier(mealIdentifierObj);
  // Will either be a valid mealIDentifier Object and get proccessed by Edit screen or undefined and ignored by it
  const mealIdentifier = validateMealIdentifierObjRes.mealIdentifier;
  screenFn(consumableId, consumablesTableBodyID, mealIdentifier);
}
function FMTUIDeleteConsumable(event, baseId, qualifier, objectType) {
  if (fmtAppGlobals.inputScreensQualifiers.indexOf(qualifier) < 0) {
    console.error(`Invalid qualifier ${qualifier}`);
    return;
  }
  if (fmtAppGlobals.consumableTypes.indexOf(objectType) < 0) {
    console.error(`Invalid Object Type ${objectType}`);
    return;
  }
  let idProp, isValidIDFn, screenFns, deleteFn;
  switch (objectType) {
    case "Food Item":
      idProp = "food_id";
      isValidIDFn = FMTIsValidId;
      screenFns = [
        pageController.closeEditFoodDynamicScreen,
        pageController.closeViewFoodDynamicScreen,
      ];
      deleteFn = FMTDeleteFood;
      break;
    case "Recipe Item":
      idProp = "recipe_id";
      isValidIDFn = FMTIsValidId;
      screenFns = [
        pageController.closeEditRecipeDynamicScreen,
        pageController.closeViewRecipeDynamicScreen,
      ];
      deleteFn = FMTDeleteRecipe;
      break;
    default:
      return;
  }
  const editBtn = document.getElementById(`${baseId}-delete`);
  const dom_consumableId = editBtn.getAttribute(idProp);
  if (!isValidIDFn(dom_consumableId)) {
    const msg = `Invalid ${objectType} ID (${dom_consumableId}). Please reload`;
    console.error(msg);
    // FMTShowAlert(`${baseId}-alerts`, "danger", msg, fmtAppGlobals.defaultAlertScroll);
    FMTShowAlertBar(msg, `${baseId}-alerts`, "danger");
    return;
  }
  //FIXME - each one in their own function.
  const consumableId = Number(dom_consumableId);
  const msg = `Are you sure you would like to delete this ${objectType}?`;
  FMTShowPrompt(
    `${baseId}-alerts`,
    "warning",
    msg,
    fmtAppGlobals.defaultAlertScroll,
    function (del) {
      if (del) {
        deleteFn(
          consumableId,
          function () {
            const delBtn = document.getElementById(`${baseId}-delete`);
            if (delBtn) {
              const consumablesTableBodyID = delBtn.getAttribute(
                "consumables-table-body-id"
              );
              const consumablesTableBodyNode = document.getElementById(
                consumablesTableBodyID
              );
              if (consumablesTableBodyNode) {
                console.debug(
                  `Firing onConsumableDeleted event to ${consumablesTableBodyID}`
                );
                const event = new Event("onConsumableDeleted");
                event[idProp] = consumableId;
                consumablesTableBodyNode.dispatchEvent(event);
              }
            }
            screenFns.forEach((fn) => {
              fn();
            });
            const msg = `Successfully deleted ${objectType}!`;
            const alertDivID = pageController.getAlertDivId();
            FMTShowAlertBar(msg, alertDivID, "success");
          },
          function () {
            screenFns.forEach((fn) => {
              fn();
            });
            const msg = `Failed deleting ${objectType}!`;
            const alertDivID = pageController.getAlertDivId();
            FMTShowAlertBar(msg, alertDivID, "danger");
          }
        );
      } else {
        FMTShowAlertBar(
          `${objectType} not deleted!`,
          `${baseId}-alerts`,
          "success"
        );
      }
    }
  );
}
//Functions - State
//Functions - State - Date
export function FMTToday() {
  fmtAppInstance.today = new Date();
}
function FMTSetCurrentDate(currentDate, onsuccessFn) {
  const onerrorFn = function (e?: any) {
    console.error(e);
  };
  if (!isDate(currentDate)) {
    console.error(`${currentDate} is not a valid date.`);
    return onerrorFn();
  }
  fmtAppInstance.currentDay = currentDate;
  FMTLoadCurrentDayUserGoals(onsuccessFn, onerrorFn);
}
function FMTPreviousDay(onsuccessFn) {
  const onerrorFn = function () {
    console.error(
      `currentDay (${fmtAppInstance.currentDay}) is not a valid Date object`
    );
  };
  if (!isDate(fmtAppInstance.currentDay)) {
    return onerrorFn();
  }
  fmtAppInstance.currentDay.setDate(fmtAppInstance.currentDay.getDate() - 1);
  FMTLoadCurrentDayUserGoals(onsuccessFn, onerrorFn);
}
function FMTNextDay(onsuccessFn) {
  const onerrorFn = function () {
    console.error(
      `currentDay (${fmtAppInstance.currentDay}) is not a valid Date object`
    );
  };
  if (!isDate(fmtAppInstance.currentDay)) {
    return onerrorFn();
  }
  fmtAppInstance.currentDay.setDate(fmtAppInstance.currentDay.getDate() + 1);
  FMTLoadCurrentDayUserGoals(onsuccessFn, onerrorFn);
}

//Page
export const pageController = {
  hideAllTabs: function () {
    for (const i in fmtAppGlobals.tabIds) {
      let s = "#" + fmtAppGlobals.tabIds[i];
      $(s).removeClass("fmt-nav-item-container-active");
      let areaToHideName = "#" + fmtAppGlobals.tabIds[i].split("-")[1];
      $(areaToHideName).hide();
    }
  },
  setTabActive: function (tabName) {
    if (fmtAppGlobals.tabIds.indexOf(tabName) < 0) {
      return;
    }
    pageController.hideAllTabs();
    let active = "#" + tabName;
    $(active).addClass("fmt-nav-item-container-active");
    let tabId = tabName.split("-")[1];
    let areaName = "#" + tabId;
    $(areaName).show();
    fmtAppInstance.pageState.activeTab = tabId;
    pageController.closeDynamicScreens();
  },
  showOverview: function (showToday?: boolean) {
    pageController.setTabActive("goto-overview");
    if (showToday) {
      FMTToday();
      FMTSetCurrentDate(fmtAppInstance.today, FMTOverviewLoadCurrentDay);
    } else {
      FMTOverviewLoadCurrentDay();
    }
  },
  showFoods: function () {
    pageController.setTabActive("goto-foods");
    let onsuccessFn = function () {
      console.debug("[showFoods] - Foods loaded successfully");
    };
    let onerrorFn = function (e) {
      console.error(e);
      FMTShowAlertBar("Failed loading food", "foods-alerts", "danger");
    };
    const foodsTableBodyID = "foods-food-table-body";
    const recipesTableBodyID = "foods-recipe-table-body";
    document
      .getElementById("foods-add")
      .setAttribute("consumables-table-body-id", foodsTableBodyID);
    const events = {
      click: function (e, objectType) {
        let idProp, screenFunc, args;
        switch (objectType) {
          case "Food Item":
            idProp = "food_id";
            const foodId = Number(e.currentTarget.getAttribute(idProp));
            screenFunc = pageController.openViewFoodDynamicScreen;
            args = [
              foodId,
              1,
              true,
              undefined,
              undefined,
              undefined,
              foodsTableBodyID,
              false,
            ];
            break;
          case "Recipe Item":
            idProp = "recipe_id";
            const recipeId = Number(e.currentTarget.getAttribute(idProp));
            screenFunc = pageController.openViewRecipeDynamicScreen;
            args = [
              recipeId,
              1,
              true,
              undefined,
              undefined,
              undefined,
              recipesTableBodyID,
            ];
            break;
          default:
            return;
        }
        screenFunc.apply(null, args);
        document.getElementById("foods-alerts").innerHTML = "";
      },
    };
    const baseID = "foods";
    const toggleQualifier = "food";
    FMTUIInitConsumableMenu(
      baseID,
      toggleQualifier,
      onsuccessFn,
      onerrorFn,
      events
    );
  },
  showSettings: function () {
    pageController.setTabActive("goto-settings");
  },
  showProfile: function () {
    pageController.setTabActive("goto-profile");
    document.getElementById("profile-alerts").innerHTML = "";
    FMTDisplayProfile(fmtAppInstance.currentProfileId);
  },
  updateZIndexes: function (reverse: boolean = false) {
    let sortedScreenNames = Object.keys(
      fmtAppInstance.pageState.activeDynamicScreens
    ).sort(function (a, b) {
      return (
        fmtAppInstance.pageState.activeDynamicScreens[a] -
        fmtAppInstance.pageState.activeDynamicScreens[b]
      );
    });
    for (let i = sortedScreenNames.length - 1; i >= 0; i--) {
      const screenName = sortedScreenNames[i];
      const zIndex = i + 1;
      document.getElementById(screenName).style.zIndex = zIndex.toString();
      fmtAppInstance.pageState.activeDynamicScreens[screenName] = zIndex;
    }
    if (reverse) {
      return sortedScreenNames.reverse();
    }
    return sortedScreenNames;
  },
  closeDynamicScreens: function () {
    $(".fmt-dynamic-screen").hide();
    let screenNames = Object.keys(
      fmtAppInstance.pageState.activeDynamicScreens
    );
    for (let i = 0; i < screenNames.length; i++) {
      const screenName = screenNames[i];
      delete fmtAppInstance.pageState.activeDynamicScreens[screenName];
    }
  },
  openDynamicScreen: function (dynamicScreenId) {
    if (fmtAppGlobals.dynamicScreenIds.indexOf(dynamicScreenId) < 0) {
      return;
    }
    $(`#${dynamicScreenId}`).show();
    fmtAppInstance.pageState.activeDynamicScreens[dynamicScreenId] =
      fmtAppGlobals.maxDynamicScreens;
    pageController.updateZIndexes();
  },
  closeDynamicScreen: function (dynamicScreenId) {
    if (fmtAppGlobals.dynamicScreenIds.indexOf(dynamicScreenId) < 0) {
      return;
    }
    if (!(dynamicScreenId in fmtAppInstance.pageState.activeDynamicScreens)) {
      console.debug(
        `Dynamic screen ${dynamicScreenId} is already closed`,
        new Error().stack
      );
      return;
    }
    $(`#${dynamicScreenId}`).hide();
    delete fmtAppInstance.pageState.activeDynamicScreens[dynamicScreenId];
    pageController.updateZIndexes();
  },
  openAddFoodDynamicScreen: function (foodsTableBodyID) {
    const screenID = "add-food-screen";
    const qualifier = "food";
    const objectType = "Food Item";
    const optionsObj = undefined;
    pageController.openDynamicScreen(screenID);
    FMTClearConsumableItemScreen(screenID, qualifier);
    FMTPopulateConsumableItemScreen(
      screenID,
      optionsObj,
      qualifier,
      objectType,
      undefined,
      true
    );
    if (foodsTableBodyID) {
      const saveBtn = document.getElementById(`${screenID}-save`);
      if (saveBtn) {
        saveBtn.setAttribute("consumables-table-body-id", foodsTableBodyID);
      }
    }
  },
  closeAddFoodDynamicScreen: function () {
    const screenID = "add-food-screen";
    const qualifier = "food";
    pageController.closeDynamicScreen(screenID);
    FMTClearConsumableItemScreen(screenID, qualifier);
    //TODO - review this
    document.getElementById("foods-alerts").innerHTML = "";
    const saveBtn = document.getElementById(`${screenID}-save`);
    if (saveBtn) {
      saveBtn.removeAttribute("consumables-table-body-id");
    }
  },
  openEditFoodDynamicScreen: function (
    foodId,
    foodsTableBodyID,
    mealIdentifier
  ) {
    //Sync Tasks - Argument Validation, handling, const definition
    if (!FMTIsValidId(foodId)) {
      console.error(`Invalid Food ID (${foodId})`);
      return;
    }
    foodId = Number(foodId);
    const alertDivId = pageController.getAlertDivId();
    const screenID = "edit-food-screen";
    const qualifier = "food";
    const objectType = "Food Item";
    const saveBtn = document.getElementById(`${screenID}-save`);
    const delBtn = document.getElementById(`${screenID}-delete`);
    //Register the food table element from which we eventually got to this screen
    if (foodsTableBodyID) {
      saveBtn.setAttribute("consumables-table-body-id", foodsTableBodyID);
      delBtn.setAttribute("consumables-table-body-id", foodsTableBodyID);
    }
    //Render screen
    FMTClearConsumableItemScreen(screenID, qualifier);
    FMTPopulateConsumableItemScreen(
      screenID,
      { consumableId: foodId },
      qualifier,
      objectType,
      mealIdentifier,
      false
    );
    //Async Tasks - Read food item and update screen
    FMTReadFood(
      foodId,
      //OnSuccess
      function (e) {
        const foodObj = e.target.result;
        //Validate Object from Database
        if (!foodObj) {
          console.warn(`Couldn't find Food item with ID (${foodId})`);
          return;
        }
        const validateResult = FMTValidateFoodObject(
          foodObj,
          fmtAppInstance.unitsChart
        );
        if (validateResult.food == null || validateResult.error != null) {
          console.error(
            `Error - Food item with ID (${foodId}) failed validation - ${validateResult.error}`
          );
          return;
        }
        //Load values and open screen
        const food = validateResult.food;
        FMTPopulateSavedValuesInConsumableItemScreen(
          screenID,
          food,
          qualifier,
          objectType,
          1,
          false,
          null,
          undefined,
          undefined,
          "Editing",
          true,
          false
        );
        pageController.openDynamicScreen(screenID);
      },
      //OnError
      function (e) {
        FMTShowAlertBar("Error reading Food data", alertDivId, "danger");
        console.error(e);
        return;
      }
    ); //End Read Food
  },
  closeEditFoodDynamicScreen: function () {
    const screenID = "edit-food-screen";
    const qualifier = "food";
    const objectType = "Food Item";
    pageController.closeDynamicScreen(screenID);
    FMTClearConsumableItemScreen(screenID, qualifier, objectType);
  },
  openViewFoodDynamicScreen: function (
    foodId,
    multiplier,
    clear,
    currentServingValue,
    currentServingUnits,
    mealIdentifierObj,
    foodsTableBodyID,
    showAddToRecipe
  ) {
    //Sync Tasks - Argument Validation, constants definition
    if (!FMTIsValidId(foodId)) {
      console.error(`Invalid Food ID: ${foodId}`);
      return;
    }
    if (!isNumber(multiplier)) {
      console.error(`Invalid Multiplier: ${multiplier}`);
      return;
    }
    foodId = Number(foodId);
    multiplier = Number(multiplier);
    if (clear !== false) {
      clear = clear || true;
    }
    const alertDivId = pageController.getAlertDivId();
    const screenID = "view-food-screen";
    const qualifier = "food";
    const objectType = "Food Item";
    const addToMealBtn = document.getElementById(`${screenID}-save`);
    const editFoodBtn = document.getElementById(`${screenID}-edit`);
    //Clear Screen if needed (Basically anytime except when updating values on serving change)
    if (clear) {
      FMTClearViewConsumableItemScreen(screenID, qualifier, objectType);
      const eventListenersObj = {
        [`${screenID}-${qualifier}-serving-unit-select`]: {
          unitChanged: function (event) {
            FMTUpdateConsumableValuesOnServingChange(
              event,
              screenID,
              qualifier,
              objectType
            );
          },
        },
      };
      const optionsObj = {
        consumableId: foodId,
        eventListenersObj: eventListenersObj,
      };
      const result = FMTPopulateConsumableItemScreen(
        screenID,
        optionsObj,
        qualifier,
        objectType,
        mealIdentifierObj,
        false
      );
      const mealIdentifier = result.mealIdentifier;
      if (foodsTableBodyID) {
        editFoodBtn.setAttribute("consumables-table-body-id", foodsTableBodyID);
      }
      if (result.error) {
        console.error(result.error);
      }
      //Handle meal Identifier if it's valid
      if (mealIdentifier) {
        const mealNameInput = document.getElementById(`${screenID}-meal-name`);
        if (mealIdentifier.meal_name) {
          // @ts-ignore
          mealNameInput.value = mealIdentifier.meal_name;
        } else {
          // @ts-ignore
          mealNameInput.value = "";
          document
            .getElementById(`${screenID}-add-to-meal`)
            .classList.remove("d-none");
        }
        // @ts-ignore
        document.getElementById("view-food-screen-meal-year").value =
          mealIdentifier.meal_year;
        // @ts-ignore
        document.getElementById("view-food-screen-meal-month").value =
          mealIdentifier.meal_month + 1;
        // @ts-ignore
        document.getElementById("view-food-screen-meal-day").value =
          mealIdentifier.meal_day;
      }
    }
    const addBtn = document.getElementById("view-food-screen-add");
    if (addBtn) {
      if (showAddToRecipe === true) {
        addBtn.classList.remove("d-none");
        addBtn.setAttribute("food_id", foodId);
        addToMealBtn.classList.add("d-none");
      } else if (showAddToRecipe === false) {
        addBtn.classList.add("d-none");
        addToMealBtn.classList.remove("d-none");
      }
    }

    //Async Tasks
    FMTReadFood(
      foodId,
      //OnSuccess
      function (e) {
        // Load food from DB and validate it
        const foodObj = e.target.result;
        if (!foodObj) {
          console.error(`Couldn't find Food item with ID (${foodId})`);
          return;
        }
        const validateResult = FMTValidateFoodObject(
          foodObj,
          fmtAppInstance.unitsChart
        );
        if (validateResult.food == null || validateResult.error != null) {
          console.error(
            `Error - Food item with ID (${foodId}) failed validation - ${validateResult.error}`
          );
          return;
        }
        const food = validateResult.food;
        //Update and open Screen
        FMTPopulateSavedValuesInConsumableItemScreen(
          screenID,
          food,
          qualifier,
          objectType,
          multiplier,
          true,
          `${screenID}-${qualifier}-serving-input`,
          currentServingValue,
          currentServingUnits,
          undefined,
          true,
          true
        );
        pageController.openDynamicScreen(screenID);
      },
      //OnError
      function (e) {
        console.error(e);
        return;
      }
    ); //End ReadFood
  },
  closeViewFoodDynamicScreen: function () {
    const screenID = "view-food-screen";
    const qualifier = "food";
    const objectType = "Food Item";
    pageController.closeDynamicScreen(screenID);
    FMTClearViewConsumableItemScreen(screenID, qualifier, objectType);
    const editFoodBtn = document.getElementById("view-food-screen-edit");
    if (editFoodBtn) {
      editFoodBtn.removeAttribute("consumables-table-body-id");
    }
    fmtAppInstance.viewFoodAddIngredientFn = null;
  },
  openAddRecipeDynamicScreen: function (consumablesTableBodyID) {
    const screenID = "add-recipe-screen";
    const qualifier = "recipe";
    const objectType = "Recipe Item";
    const optionsObj = undefined;
    const ingredients = [];
    const additionalNutriDivId = `${screenID}-${qualifier}-additional`;
    const additionalNutrientsObj = FMTCreateEmptyAdditionalNutrients();
    const onAddIngredientClick = function () {
      const mealName =
        // @ts-ignore
        document.getElementById("add-recipe-screen-recipe-name").value || "";
      pageController.openAddToRecipeDynamicScreen(
        mealName,
        ingredients,
        screenID
      );
    };
    const onSaveRecipeClick = function () {
      //// getNutritionalValue == false because we have to calculate it here
      const recipeObj = FMTSaveConsumableItemScreen(
        screenID,
        "get-object",
        undefined,
        qualifier,
        objectType,
        false,
        undefined,
        undefined
      );
      recipeObj.ingredients = ingredients;
      const consumablesTableBodyNode = consumablesTableBodyID
        ? document.getElementById(consumablesTableBodyID)
        : null;
      const onsuccess = function (e, recipe) {
        if (consumablesTableBodyNode) {
          console.debug(
            `Firing onConsumableAdded event to ${consumablesTableBodyID}`
          );
          const event = new Event("onConsumableAdded");
          //@ts-ignore
          event.consumableObj = recipe;
          consumablesTableBodyNode.dispatchEvent(event);
        }
      };
      FMTAddRecipe(recipeObj, onsuccess, undefined, fmtAppInstance.unitsChart);
      pageController.closeAddRecipeDynamicScreen();
    };
    fmtAppInstance.addRecipeAddIngredientFn = onAddIngredientClick;
    fmtAppInstance.addRecipeSaveRecipeFn = onSaveRecipeClick;
    FMTClearConsumableItemScreen(screenID, qualifier, objectType);
    FMTPopulateConsumableItemScreen(
      screenID,
      optionsObj,
      qualifier,
      objectType,
      undefined,
      false
    );
    FMTUICreateAdditionalNutrientsFromObj(
      screenID,
      qualifier,
      additionalNutrientsObj,
      false,
      fmtAppInstance.unitsChart,
      true
    );
    pageController.openDynamicScreen(screenID);
    if (consumablesTableBodyID) {
      const saveBtn = document.getElementById(`${screenID}-save`);
      if (saveBtn) {
        saveBtn.setAttribute(
          "consumables-table-body-id",
          consumablesTableBodyID
        );
      }
    }
  },
  closeAddRecipeDynamicScreen: function () {
    const screenID = "add-recipe-screen";
    const qualifier = "recipe";
    const objectType = "Recipe Item";
    fmtAppInstance.addRecipeAddIngredientFn = null;
    fmtAppInstance.addRecipeSaveRecipeFn = null;
    pageController.closeDynamicScreen(screenID);
    FMTClearConsumableItemScreen(screenID, qualifier, objectType);
    const saveBtn = document.getElementById(`${screenID}-save`);
    if (saveBtn) {
      saveBtn.removeAttribute("consumables-table-body-id");
    }
  },
  openViewRecipeDynamicScreen: function (
    recipeId,
    multiplier,
    clear,
    currentServingValue,
    currentServingUnits,
    mealIdentifierObj,
    recipesTableBodyID
  ) {
    //Sync Tasks - Argument Validation, constants definition
    if (!FMTIsValidId(recipeId)) {
      console.error(`Invalid Recipe ID: ${recipeId}`);
      return;
    }
    if (!isNumber(multiplier)) {
      console.error(`Invalid Multiplier: ${multiplier}`);
      return;
    }
    recipeId = Number(recipeId);
    multiplier = Number(multiplier);
    if (clear !== false) {
      clear = clear || true;
    }
    const alertDivId = pageController.getAlertDivId();
    const screenID = "view-recipe-screen";
    const qualifier = "recipe";
    const objectType = "Recipe Item";
    const addToMealBtn = document.getElementById(`${screenID}-save`);
    const editRecipeBtn = document.getElementById(`${screenID}-edit`);
    //Clear Screen if needed (Basically anytime except when updating values on serving change)
    if (clear) {
      FMTClearViewConsumableItemScreen(screenID, qualifier, objectType);
      const eventListenersObj = {
        [`${screenID}-${qualifier}-serving-unit-select`]: {
          unitChanged: function (event) {
            FMTUpdateConsumableValuesOnServingChange(
              event,
              screenID,
              qualifier,
              objectType
            );
          },
        },
      };
      const optionsObj = {
        consumableId: recipeId,
        eventListenersObj: eventListenersObj,
      };
      const result = FMTPopulateConsumableItemScreen(
        screenID,
        optionsObj,
        qualifier,
        objectType,
        mealIdentifierObj,
        false
      );
      const mealIdentifier = result.mealIdentifier;
      if (recipesTableBodyID) {
        editRecipeBtn.setAttribute(
          "consumables-table-body-id",
          recipesTableBodyID
        );
      }
      if (result.error) {
        console.error(result.error);
      }
      //Handle meal Identifier if it's valid
      if (mealIdentifier) {
        const mealNameInput = document.getElementById(`${screenID}-meal-name`);
        if (mealIdentifier.meal_name) {
          // @ts-ignore
          mealNameInput.value = mealIdentifier.meal_name;
        } else {
          // @ts-ignore
          mealNameInput.value = "";
          document
            .getElementById(`${screenID}-add-to-meal`)
            .classList.remove("d-none");
        }
        // @ts-ignore
        document.getElementById(`${screenID}-meal-year`).value =
          mealIdentifier.meal_year;
        // @ts-ignore
        document.getElementById(`${screenID}-meal-month`).value =
          mealIdentifier.meal_month + 1;
        // @ts-ignore
        document.getElementById(`${screenID}-meal-day`).value =
          mealIdentifier.meal_day;
      }
    }
    //Async Tasks
    FMTReadRecipe(
      recipeId,
      //OnSuccess
      function (e) {
        // Load recipe from DB and validate it
        const recipeObj = e.target.result;
        if (!recipeObj) {
          console.error(`Couldn't find recipe item with ID (${recipeId})`);
          return;
        }
        const validateResult = FMTValidateRecipeObject(
          recipeObj,
          fmtAppInstance.unitsChart
        );
        if (validateResult.recipe == null || validateResult.error != null) {
          console.error(
            `Error - Recipe item with ID (${recipeId}) failed validation - ${validateResult.error}`
          );
          return;
        }
        const recipe = validateResult.recipe;
        //Update and open Screen
        FMTPopulateSavedValuesInConsumableItemScreen(
          screenID,
          recipe,
          qualifier,
          objectType,
          multiplier,
          true,
          `${screenID}-${qualifier}-serving-input`,
          currentServingValue,
          currentServingUnits,
          undefined,
          true,
          true
        );
        pageController.openDynamicScreen(screenID);
      },
      //OnError
      function (e) {
        console.error(e);
        return;
      }
    ); //End ReadRecipe
  },
  closeViewRecipeDynamicScreen: function () {
    const screenID = "view-recipe-screen";
    const qualifier = "recipe";
    const objectType = "Recipe Item";
    pageController.closeDynamicScreen(screenID);
    FMTClearViewConsumableItemScreen(screenID, qualifier, objectType);
    const editFoodBtn = document.getElementById(`${screenID}-edit`);
    if (editFoodBtn) {
      editFoodBtn.removeAttribute("consumables-table-body-id");
    }
  },
  openAddToRecipeDynamicScreen: function (mealName, ingredients, sourceID) {
    const screenID = "add-to-recipe-screen";
    pageController.openDynamicScreen(screenID);
    if (mealName) {
      document.getElementById(
        "add-to-recipe-screen-heading"
      ).innerHTML = `Add to ${mealName}`;
    }
    let onsuccessFn = function () {
      console.debug("[openAddToMealDynamicScreen] - Foods loaded successfully");
    };
    let onerrorFn = function (e) {
      FMTShowAlertBar("Failed loading foods", `${screenID}-alerts`, "danger");
      console.error(e);
    };
    const foodsTableBodyID = `${screenID}-food-table-body`;
    const events = {
      click: function (e, objectType) {
        let idProp, screenFunc, args;
        switch (objectType) {
          case "Food Item":
            idProp = "food_id";
            const foodId = Number(e.currentTarget.getAttribute(idProp));
            screenFunc = pageController.openViewFoodDynamicScreen;
            args = [
              foodId,
              1,
              true,
              undefined,
              undefined,
              undefined,
              foodsTableBodyID,
              true,
            ];
            break;
          default:
            return;
        }
        const clickFn = function () {
          FMTUIAddIngredientBtnClick(
            "view-food-screen",
            sourceID,
            pageController.closeViewFoodDynamicScreen,
            pageController.closeAddToRecipeDynamicScreen,
            ingredients
          );
          const nutritionalValue = FMTSumIngredients(
            ingredients,
            fmtAppInstance.unitsChart
          );
          FMTUIPopulateNutritionalValue(
            sourceID,
            "recipe",
            nutritionalValue,
            1,
            true,
            true,
            false
          );
        };
        fmtAppInstance.viewFoodAddIngredientFn = clickFn;
        screenFunc.apply(null, args);
      },
    };
    const toggleQualifier = "food";
    FMTUIInitConsumableMenu(
      screenID,
      toggleQualifier,
      onsuccessFn,
      onerrorFn,
      events
    );
  },
  closeAddToRecipeDynamicScreen: function () {
    pageController.closeDynamicScreen("add-to-recipe-screen");
    document.getElementById("add-to-recipe-screen-heading").innerHTML =
      "Add to Recipe";
  },
  openEditRecipeDynamicScreen: function (
    recipeId,
    recipesTableBodyID,
    mealIdentifier
  ) {
    //Sync Tasks - Argument Validation, handling, const definition
    if (!FMTIsValidId(recipeId)) {
      console.error(`Invalid Recipe ID (${recipeId})`);
      return;
    }
    recipeId = Number(recipeId);
    const alertDivId = pageController.getAlertDivId();
    const screenID = "edit-recipe-screen";
    const qualifier = "recipe";
    const objectType = "Recipe Item";
    const saveBtn = document.getElementById(`${screenID}-save`);
    const delBtn = document.getElementById(`${screenID}-delete`);
    //Register the food table element from which we eventually got to this screen
    if (recipesTableBodyID) {
      saveBtn.setAttribute("consumables-table-body-id", recipesTableBodyID);
      delBtn.setAttribute("consumables-table-body-id", recipesTableBodyID);
    }
    //Render screen
    FMTClearConsumableItemScreen(screenID, qualifier);
    FMTPopulateConsumableItemScreen(
      screenID,
      { consumableId: recipeId },
      qualifier,
      objectType,
      mealIdentifier,
      false
    );
    //Async Tasks - Read recipe item and update screen
    FMTReadRecipe(
      recipeId,
      //OnSuccess
      function (e) {
        const recipeObj = e.target.result;
        //Validate Object from Database
        if (!recipeObj) {
          console.error(`Couldn't find Recipe item with ID (${recipeId})`);
          return;
        }
        const validateResult = FMTValidateRecipeObject(
          recipeObj,
          fmtAppInstance.unitsChart
        );
        if (validateResult.recipe == null || validateResult.error != null) {
          console.error(
            `Error - Recipe item with ID (${recipeId}) failed validation - ${validateResult.error}`
          );
          return;
        }
        //Load values, create handlers and open screen
        const recipe = validateResult.recipe;
        const onAddIngredientClick = function () {
          const mealName =
            // @ts-ignore
            document.getElementById("edit-recipe-screen-recipe-name").value ||
            "";
          pageController.openAddToRecipeDynamicScreen(
            mealName,
            recipe.ingredients,
            screenID
          );
        };
        const onSaveRecipeClick = function () {
          const editedRecipeObj = FMTSaveConsumableItemScreen(
            screenID,
            "get-object",
            undefined,
            qualifier,
            objectType,
            false,
            undefined,
            undefined
          );
          recipe.recipeName = editedRecipeObj.recipeName;
          recipe.recipeDescription = editedRecipeObj.recipeDescription;
          recipe.recipeCreator = editedRecipeObj.recipeCreator;
          recipe.referenceServing = editedRecipeObj.referenceServing;
          recipe.units = editedRecipeObj.units;
          recipe.preparationSteps = editedRecipeObj.preparationSteps;
          recipe.videoUrl = editedRecipeObj.videoUrl;
          recipe.website = editedRecipeObj.website;
          const recipesTableBodyNode = recipesTableBodyID
            ? document.getElementById(recipesTableBodyID)
            : null;
          const onsuccess = function (e, recipe) {
            if (recipesTableBodyNode) {
              console.debug(
                `Firing onConsumableEdited event to ${recipesTableBodyNode}`
              );
              const event = new Event("onConsumableEdited");
              // @ts-ignore
              event.consumableObj = recipe;
              recipesTableBodyNode.dispatchEvent(event);
            }
            pageController.closeEditRecipeDynamicScreen();
            pageController.openViewRecipeDynamicScreen(
              recipeId,
              1,
              true,
              undefined,
              undefined,
              mealIdentifier,
              recipesTableBodyID
            );
          };
          FMTUpdateRecipe(
            recipeId,
            recipe,
            onsuccess,
            undefined,
            fmtAppInstance.unitsChart
          );
        };
        const onRecipeDeleteClick = (e) => {
          FMTUIDeleteConsumable(e, screenID, qualifier, objectType);
        };
        fmtAppInstance.editRecipeAddIngredientFn = onAddIngredientClick;
        fmtAppInstance.editRecipeSaveRecipeFn = onSaveRecipeClick;
        fmtAppInstance.editRecipeDeleteFn = onRecipeDeleteClick;
        FMTPopulateSavedValuesInConsumableItemScreen(
          screenID,
          recipe,
          qualifier,
          objectType,
          1,
          false,
          null,
          undefined,
          undefined,
          "Editing",
          true,
          false
        );
        pageController.openDynamicScreen(screenID);
      },
      //OnError
      function (e) {
        console.error(e);
        return;
      }
    ); //End Read Recipe
  },
  closeEditRecipeDynamicScreen: function () {
    const screenID = "edit-recipe-screen";
    const qualifier = "recipe";
    const objectType = "Recipe Item";
    fmtAppInstance.editRecipeAddIngredientFn = null;
    fmtAppInstance.editRecipeSaveRecipeFn = null;
    fmtAppInstance.editRecipeDeleteFn = null;
    pageController.closeDynamicScreen(screenID);
    FMTClearConsumableItemScreen(screenID, qualifier, objectType);
  },
  openEditIngredientDynamicScreen: function (
    consumableItem,
    ingredient,
    multiplier,
    clear,
    currentServingValue,
    currentServingUnits,
    onModified
  ) {
    //ingredient should refer a member of consumableItem.ingredients
    const screenID = "edit-ingredient-screen";
    const qualifier = "ingredient";
    const objectType = "Ingredient Item";
    multiplier = Number(multiplier);
    if (clear !== false) {
      clear = clear || true;
    }
    const saveBtn = document.getElementById(`${screenID}-save`);
    const delBtn = document.getElementById(`${screenID}-delete`);
    if (clear) {
      const onServingChange = (event) => {
        FMTUpdateConsumableValuesOnServingChange(
          event,
          screenID,
          qualifier,
          objectType,
          consumableItem,
          ingredient
        );
      };
      FMTClearConsumableItemScreen(screenID, qualifier, objectType);
      const eventListenersObj = {
        [`${screenID}-${qualifier}-serving-unit-select`]: {
          unitChanged: onServingChange,
        },
      };
      const optionsObj = { eventListenersObj: eventListenersObj };
      const result = FMTPopulateConsumableItemScreen(
        screenID,
        optionsObj,
        qualifier,
        objectType,
        undefined,
        false
      );
      if (result.error) {
        console.error(result.error);
      }
      const deleteClickFn = () => {
        const idx = indexesOfObjectMulti(consumableItem.ingredients, {
          food_id: ingredient.food_id,
          referenceServing: ingredient.referenceServing,
          units: ingredient.units,
        });
        if (idx.length > 0) {
          console.debug(
            `Found ${idx.length} ingredients matching for deletion, removing first`
          );
          consumableItem.ingredients.splice(idx[0], 1);
        }
        if (isFunction(onModified)) {
          onModified();
        }
        pageController.closeEditIngredientDynamicScreen();
      };
      const updateClickFn = () => {
        const ingredientObj = FMTSaveConsumableItemScreen(
          screenID,
          "get-object",
          undefined,
          qualifier,
          objectType,
          true,
          undefined,
          undefined
        );
        const _val = FMTValidateFoodObject(
          ingredientObj,
          fmtAppInstance.unitsChart
        );
        if (_val.error == null && _val.food != null) {
          ingredient.referenceServing = _val.food.referenceServing;
          ingredient.units = _val.food.units;
          ingredient.nutritionalValue = _val.food.nutritionalValue;
          if (isFunction(onModified)) {
            onModified();
          }
        } else {
          console.error(_val.error);
        }
        pageController.closeEditIngredientDynamicScreen();
      };
      fmtAppInstance.editIngredientDeleteFn = deleteClickFn;
      fmtAppInstance.editIngredientUpdateFn = updateClickFn;
      fmtAppInstance.editIngredientServingKeyupFn = onServingChange;
    }
    FMTPopulateSavedValuesInConsumableItemScreen(
      screenID,
      ingredient,
      qualifier,
      objectType,
      multiplier,
      true,
      null,
      currentServingValue,
      currentServingUnits,
      "Editing Ingredient",
      true,
      true
    );
    pageController.openDynamicScreen(screenID);
  },
  closeEditIngredientDynamicScreen: function () {
    const screenID = "edit-ingredient-screen";
    const qualifier = "ingredient";
    const objectType = "Ingredient Item";
    fmtAppInstance.editIngredientDeleteFn = null;
    fmtAppInstance.editIngredientUpdateFn = null;
    fmtAppInstance.editIngredientServingKeyupFn = null;
    pageController.closeDynamicScreen(screenID);
    FMTClearConsumableItemScreen(screenID, qualifier, objectType);
  },
  openAddToMealDynamicScreen: function (mealIdentifierObj) {
    const screenID = "add-to-meal-screen";
    pageController.openDynamicScreen(screenID);
    if (mealIdentifierObj.meal_name) {
      document.getElementById(
        "add-to-meal-screen-heading"
      ).innerHTML = `Add to ${mealIdentifierObj.meal_name}`;
    }
    let onsuccessFn = function () {
      console.debug("[openAddToMealDynamicScreen] - Foods loaded successfully");
    };
    let onerrorFn = function (e) {
      // FMTShowAlert(`${screenID}-alerts`, "danger", "Failed loading food", fmtAppGlobals.defaultAlertScroll);
      console.error(e);
    };
    const foodsTableBodyID = `${screenID}-food-table-body`;
    const recipesTableBodyID = `${screenID}-recipe-table-body`;
    const events = {
      click: function (e, objectType) {
        let idProp, screenFunc, args;
        switch (objectType) {
          case "Food Item":
            idProp = "food_id";
            const foodId = Number(e.currentTarget.getAttribute(idProp));
            screenFunc = pageController.openViewFoodDynamicScreen;
            args = [
              foodId,
              1,
              true,
              undefined,
              undefined,
              mealIdentifierObj,
              foodsTableBodyID,
              false,
            ];
            break;
          case "Recipe Item":
            idProp = "recipe_id";
            const recipeId = Number(e.currentTarget.getAttribute(idProp));
            screenFunc = pageController.openViewRecipeDynamicScreen;
            args = [
              recipeId,
              1,
              true,
              undefined,
              undefined,
              mealIdentifierObj,
              recipesTableBodyID,
            ];
            break;
          default:
            return;
        }
        screenFunc.apply(null, args);
      },
    };
    const toggleQualifier = "food";
    FMTUIInitConsumableMenu(
      screenID,
      toggleQualifier,
      onsuccessFn,
      onerrorFn,
      events
    );
  },
  closeAddToMealDynamicScreen: function () {
    pageController.closeDynamicScreen("add-to-meal-screen");
    document.getElementById("add-to-meal-screen-heading").innerHTML =
      "Add to Meal";
  },
  openEditMealEntryDynamicScreen: function (
    entry_id,
    multiplier,
    clear,
    currentServingValue,
    currentServingUnits
  ) {
    //Sync Tasks - Argument validation and constants definition
    if (!FMTIsValidId(entry_id)) {
      return;
    }
    if (!isNumber(multiplier)) {
      console.error(`Invalid Multiplier: ${multiplier}`);
      return;
    }
    entry_id = Number(entry_id);
    multiplier = Number(multiplier);
    if (clear !== false) {
      clear = clear || true;
    }
    const alertDivId = pageController.getAlertDivId();
    const screenID = "edit-meal-entry-screen";
    const qualifier = "consumable";
    const objectType = "Meal Entry";
    const focusDivID = `${screenID}-${qualifier}-serving-input`;
    //Async Tasks
    FMTReadMealEntry(
      entry_id,
      //OnSuccess
      function (e) {
        //Load Meal Entry from DB and validate it
        const mealEntryObj = e.target.result;
        if (!mealEntryObj) {
          // FMTShowAlert(alertDivId, "warning", `Couldn't find meal entry with ID (${entry_id})`);
          console.error(`Couldn't find meal entry with ID (${entry_id})`);
          return;
        }
        const validateResult = FMTValidateMealEntry(mealEntryObj);
        if (validateResult.mealEntry == null || validateResult.error != null) {
          // FMTShowAlert(alertDivId, "Danger", `Error - Meal entry with ID (${entry_id}) failed validation - ${validateResult.error}`);
          console.error(
            `Error - Meal entry with ID (${entry_id}) failed validation - ${validateResult.error}`
          );
          return;
        }
        //Clear if requested (if arrived from overview. if on serving value change no.)
        if (clear) {
          const eventListenersObj = {
            [`${screenID}-${qualifier}-serving-unit-select`]: {
              unitChanged: function (event) {
                FMTUpdateConsumableValuesOnServingChange(
                  event,
                  screenID,
                  qualifier,
                  objectType
                );
              },
            },
          };
          FMTClearConsumableItemScreen(screenID, qualifier, objectType);
          FMTPopulateConsumableItemScreen(
            screenID,
            {
              consumableId: validateResult.mealEntry.entry_id,
              eventListenersObj: eventListenersObj,
            },
            qualifier,
            objectType,
            undefined,
            false
          );
          const delBtn = document.getElementById(`${screenID}-delete`);
          const updateBtn = document.getElementById(`${screenID}-save`);
          //TODO move it to the generic function
          delBtn.setAttribute("entry_id", entry_id);
          updateBtn.setAttribute("meal_year", validateResult.mealEntry.year);
          updateBtn.setAttribute("meal_month", validateResult.mealEntry.month);
          updateBtn.setAttribute("meal_day", validateResult.mealEntry.day);
          updateBtn.setAttribute(
            "meal_name",
            validateResult.mealEntry.mealName
          );
          updateBtn.setAttribute(
            "profile_id",
            validateResult.mealEntry.profile_id
          );
          updateBtn.setAttribute(
            "consumable_id",
            validateResult.mealEntry.consumable_id
          );
        }
        FMTPopulateSavedValuesInConsumableItemScreen(
          screenID,
          validateResult.mealEntry,
          qualifier,
          objectType,
          multiplier,
          true,
          focusDivID,
          currentServingValue,
          currentServingUnits,
          "Editing Meal Item",
          true,
          true
        );
        pageController.openDynamicScreen(screenID);
      },
      //OnError
      function (e) {
        // FMTShowAlert(alertDivId, "Danger", `Error reading Meal entry with ID (${entry_id})`);
        console.error(e);
        return;
      }
    ); //End ReadMealEntry
  },
  closeEditMealEntryDynamicScreen: function () {
    const screenID = "edit-meal-entry-screen";
    const qualifier = "consumable";
    const objectType = "Meal Entry";
    pageController.closeDynamicScreen(screenID);
    FMTClearConsumableItemScreen(screenID, qualifier, objectType);
  },
  openedDynamicScreensCount: function () {
    return Object.keys(fmtAppInstance.pageState.activeDynamicScreens).length;
  },
  getAlertDivId: function () {
    const alertDivId = `${
      pageController.openedDynamicScreensCount() > 0
        ? `${pageController.updateZIndexes(true)[0]}`
        : fmtAppInstance.pageState.activeTab
    }-alerts`;
    return alertDivId;
  },
  showNavOverlay: function () {
    const navOverlay = document.getElementById("fmt-app-nav-overlay");
    navOverlay.classList.remove("d-none");
    navOverlay.style.zIndex = fmtAppGlobals.maxDynamicScreens + 1;
  },
  closeNavOverlay: function () {
    const navOverlay = document.getElementById("fmt-app-nav-overlay");
    navOverlay.classList.add("d-none");
    navOverlay.style.zIndex = "-1";
  },
};

//Functions - DB - Init

// TODO - Delete
export function FMTLoadUnits(onloadedFn) {
  FMTReadAllUnits(
    function (e) {
      let units = e.target.result;
      fmtAppInstance.unitsChart = {};
      for (let j in units) {
        let unit = units[j];
        fmtAppInstance.unitsChart[unit.name] = {
          value_in_grams: unit.value_in_grams,
          value_in_ml: unit.value_in_ml,
          type: unit.type,
          description: unit.description,
        };
      }
      console.debug(
        `Units loaded into Application instance ${JSON.stringify(
          fmtAppInstance.unitsChart
        )}`
      );
      if (onloadedFn) {
        onloadedFn();
      }
    },
    function () {
      throw ReferenceError("Failed reading units");
    }
  );
}

// TODO - Delete
export function FMTLoadAdditionalNutrients(onloadedFn) {
  FMTReadAllNutrients(
    function (e) {
      let addNutri = e.target.result;
      fmtAppInstance.additionalNutrients = {};
      for (let j in addNutri) {
        let nutri = addNutri[j];
        if (!fmtAppInstance.additionalNutrients[nutri.category]) {
          fmtAppInstance.additionalNutrients[nutri.category] = [];
        }
        let _nutri = {
          name: nutri.name,
          default_unit: nutri.default_unit,
          help: nutri.help || null,
        };
        fmtAppInstance.additionalNutrients[nutri.category].push(_nutri);
      }
      console.debug(
        `Additional Nutrients loaded into Application instance ${JSON.stringify(
          fmtAppInstance.additionalNutrients
        )}`
      );
      if (onloadedFn) {
        onloadedFn();
      }
    },
    function () {
      throw ReferenceError("Failed reading additional nutrients");
    }
  );
}

//TODO - Delete
export function FMTLoadProfile(profile_id, onloadedFn, onNoProfileFn) {
  fmtAppInstance.currentProfileId = profile_id;
  FMTReadProfile(
    fmtAppInstance.currentProfileId,
    function (e) {
      let profile = e.target.result;
      if (profile) {
        fmtAppInstance.currentProfile = profile;
        if (onloadedFn) {
          onloadedFn();
        }
      } else {
        if (onNoProfileFn) {
          onNoProfileFn();
        }
      }
    },
    //FIXME - make a standard error reporting call
    // eslint-disable-next-line no-unused-vars
    function (e) {
      let _report = JSON.stringify({
        globals: fmtAppGlobals,
        instance: fmtAppInstance,
      });
      let msg = `Failed loading profiles. Please report problem on Github and include the following data:\n${_report}`;
      throw ReferenceError(msg);
    }
  );
}

export function prepareEventHandlers() {
  //On click functions
  //Tabs
  $("#goto-overview").click(() => {
    pageController.showOverview(true);
  });
  $("#goto-foods").click(() => {
    pageController.showFoods();
  });
  $("#goto-profile").click(() => {
    pageController.showProfile();
  });
  $("#goto-settings").click(() => {
    pageController.showSettings();
  });
  $("#profile-sex-select").change((e) => {
    // @ts-ignore
    const sex = e.currentTarget.value;
    FMTProfileSelectSex(sex, "profile-sex");
  });
  $("#profile-activity-select").change((e) => {
    // @ts-ignore
    const activityLevel = e.currentTarget.value;
    FMTProfileSelectActivityLevel(
      activityLevel,
      "profile-activity-mult",
      "profile-active-level"
    );
  });
  $("#profile-macro-protein-units-select").focus((e) => {
    FMTProfileStorePreviousSelection(e);
  });
  $("#profile-macro-carb-units-select").focus((e) => {
    FMTProfileStorePreviousSelection(e);
  });
  $("#profile-macro-fat-units-select").focus((e) => {
    FMTProfileStorePreviousSelection(e);
  });
  $("#profile-macro-protein-units-select").change((e) => {
    FMTProfileSelectMacroUnits(
      e,
      "protein",
      "profile-macro-protein",
      "profile-macro-protein-result",
      "profile-daily-calories"
    );
    FMTProfileStorePreviousSelection(e);
  });
  $("#profile-macro-carb-units-select").change((e) => {
    FMTProfileSelectMacroUnits(
      e,
      "carbohydrate",
      "profile-macro-carb",
      "profile-macro-carb-result",
      "profile-daily-calories"
    );
    FMTProfileStorePreviousSelection(e);
  });
  $("#profile-macro-fat-units-select").change((e) => {
    FMTProfileSelectMacroUnits(
      e,
      "fat",
      "profile-macro-fat",
      "profile-macro-fat-result",
      "profile-daily-calories"
    );
    FMTProfileStorePreviousSelection(e);
  });
  $("#profile-macro-protein").keyup((e) => {
    if (
      // @ts-ignore
      isNumber(e.currentTarget.value) &&
      // @ts-ignore
      !e.currentTarget.value.endsWith(".")
    ) {
      const _e = {
        currentTarget: document.getElementById(
          "profile-macro-protein-units-select"
        ),
      };
      FMTProfileSelectMacroUnits(
        _e,
        "protein",
        "profile-macro-protein",
        "profile-macro-protein-result",
        "profile-daily-calories"
      );
    } else if (
      // @ts-ignore
      e.currentTarget.value == undefined ||
      // @ts-ignore
      e.currentTarget.value == ""
    ) {
      document.getElementById("profile-macro-protein-result").innerHTML = "";
    }
  });
  $("#profile-macro-carb").keyup((e) => {
    if (
      // @ts-ignore
      isNumber(e.currentTarget.value) &&
      // @ts-ignore
      !e.currentTarget.value.endsWith(".")
    ) {
      const _e = {
        currentTarget: document.getElementById(
          "profile-macro-carb-units-select"
        ),
      };
      FMTProfileSelectMacroUnits(
        _e,
        "carbohydrate",
        "profile-macro-carb",
        "profile-macro-carb-result",
        "profile-daily-calories"
      );
    } else if (
      // @ts-ignore
      e.currentTarget.value == undefined ||
      // @ts-ignore
      e.currentTarget.value == ""
    ) {
      document.getElementById("profile-macro-carb-result").innerHTML = "";
    }
  });
  $("#profile-macro-fat").keyup((e) => {
    if (
      // @ts-ignore
      isNumber(e.currentTarget.value) &&
      // @ts-ignore
      !e.currentTarget.value.endsWith(".")
    ) {
      const _e = {
        currentTarget: document.getElementById(
          "profile-macro-fat-units-select"
        ),
      };
      FMTProfileSelectMacroUnits(
        _e,
        "fat",
        "profile-macro-fat",
        "profile-macro-fat-result",
        "profile-daily-calories"
      );
    } else if (
      // @ts-ignore
      e.currentTarget.value == undefined ||
      // @ts-ignore
      e.currentTarget.value == ""
    ) {
      document.getElementById("profile-macro-fat-result").innerHTML = "";
    }
  });
  $("#profile-daily-calories").keyup(() => {
    const _e = {
      currentTarget: document.getElementById(
        "profile-macro-protein-units-select"
      ),
    };
    FMTProfileSelectMacroUnits(
      _e,
      "protein",
      "profile-macro-protein",
      "profile-macro-protein-result",
      "profile-daily-calories"
    );
    _e.currentTarget = document.getElementById(
      "profile-macro-carb-units-select"
    );
    FMTProfileSelectMacroUnits(
      _e,
      "carbohydrate",
      "profile-macro-carb",
      "profile-macro-carb-result",
      "profile-daily-calories"
    );
    _e.currentTarget = document.getElementById(
      "profile-macro-fat-units-select"
    );
    FMTProfileSelectMacroUnits(
      _e,
      "fat",
      "profile-macro-fat",
      "profile-macro-fat-result",
      "profile-daily-calories"
    );
  });
  $("#profile-macro-protein-fill").click(() => {
    let baseID = "profile-macro";
    let nutrient = "protein";
    let caloriesDiv = document.getElementById("profile-daily-calories");
    if (
      !caloriesDiv ||
      // @ts-ignore
      !(isNumber(caloriesDiv.value) && Number(caloriesDiv.value) > 0)
    ) {
      FMTShowAlertBar(
        "Calories must be set to fill macro",
        "profile-alerts",
        "primary"
      );
      return;
    }
    // @ts-ignore
    let calories = Number(caloriesDiv.value);
    FMTFillMacro(baseID, nutrient, calories);
  });
  $("#profile-macro-carb-fill").click(() => {
    let baseID = "profile-macro";
    let nutrient = "carb";
    let caloriesDiv = document.getElementById("profile-daily-calories");
    if (
      !caloriesDiv ||
      // @ts-ignore
      !(isNumber(caloriesDiv.value) && Number(caloriesDiv.value) > 0)
    ) {
      FMTShowAlertBar(
        "Calories must be set to fill macro",
        "profile-alerts",
        "primary"
      );
      return;
    }
    // @ts-ignore
    let calories = Number(caloriesDiv.value);
    FMTFillMacro(baseID, nutrient, calories);
  });
  $("#profile-macro-fat-fill").click(() => {
    let baseID = "profile-macro";
    let nutrient = "fat";
    let caloriesDiv = document.getElementById("profile-daily-calories");
    if (
      !caloriesDiv ||
      // @ts-ignore
      !(isNumber(caloriesDiv.value) && Number(caloriesDiv.value) > 0)
    ) {
      FMTShowAlertBar(
        "Calories must be set to fill macro",
        "profile-alerts",
        "primary"
      );
      return;
    }
    // @ts-ignore
    let calories = Number(caloriesDiv.value);
    FMTFillMacro(baseID, nutrient, calories);
  });

  $("#save-profile-details").click(() => {
    let onsuccessFn = function () {
      let msg = "Profile updated successfully!";
      console.debug(
        `Profile ${fmtAppInstance.currentProfileId} updated successfully`
      );
      FMTDisplayProfile(fmtAppInstance.currentProfileId);
      FMTShowAlertBar(msg, "profile-alerts", "success");
      document.getElementById("profile-mid-indicator").click();
    };
    let onerrorFn = function (msg) {
      // FMTShowAlert("profile-alerts", "danger", msg || "Error!", fmtAppGlobals.defaultAlertScroll);
      let _msg = "Error updating profile";
      console.error(msg || "Error!");
      FMTShowAlertBar(_msg, "profile-alerts", "danger");
    };
    FMTUpdateProfileForm(
      fmtAppInstance.currentProfileId,
      onsuccessFn,
      onerrorFn
    );
  });
  $("#save-profile-macro").click(() => {
    let onsuccessFn = function () {
      let msg = "Macro split updated successfully!";
      console.debug(
        `Profile ${fmtAppInstance.currentProfileId} updated successfully`
      );
      FMTDisplayProfile(fmtAppInstance.currentProfileId);
      FMTShowAlertBar(msg, "profile-alerts", "success");
    };
    let onerrorFn = function (msg) {
      // FMTShowAlert("profile-alerts", "danger", msg || "Error!", fmtAppGlobals.defaultAlertScroll);
      let _msg = "Error updating macro split";
      console.error(msg || "Error!");
      FMTShowAlertBar(_msg, "profile-alerts", "danger");
    };
    FMTUpdateMacroesForm(
      fmtAppInstance.currentProfileId,
      onsuccessFn,
      onerrorFn
    );
  });
  $("#foods-add").click(() => {
    const addBtn = document.getElementById("foods-add");
    let consumablesTableBodyID;
    const qualifier = addBtn.getAttribute("action");
    switch (qualifier) {
      case "recipe":
        consumablesTableBodyID = "foods-recipe-table-body";
        pageController.openAddRecipeDynamicScreen(consumablesTableBodyID);
        break;
      case "food":
      default:
        consumablesTableBodyID = "foods-food-table-body";
        pageController.openAddFoodDynamicScreen(consumablesTableBodyID);
        break;
    }
  });
  $("#foods-my-food-btn").click(() => {
    FMTToggleFoodMenu("foods", "food");
  });
  $("#foods-my-recipe-btn").click(() => {
    FMTToggleFoodMenu("foods", "recipe");
  });
  $("#add-food-screen-cancel").click(() => {
    if (fmtAppInstance.promptSettings.promptOnUnsavedFood) {
      let inputs = document
        .getElementById("add-food-screen")
        .getElementsByTagName("input");
      let prompt = false;
      for (let j = 0; j < inputs.length; j++) {
        let val = inputs[j].value;
        if (val != null && val !== "") {
          prompt = true;
          break;
        }
      }
      if (prompt) {
        FMTShowPrompt(
          "add-food-screen-alerts",
          "warning",
          "Unsaved Food, discard changes?",
          fmtAppGlobals.defaultAlertScroll,
          function (res) {
            if (res) {
              pageController.closeAddFoodDynamicScreen();
            } else {
              return;
            }
          }
        );
      } else {
        pageController.closeAddFoodDynamicScreen();
      }
    } else {
      pageController.closeAddFoodDynamicScreen();
    }
  });
  $("#add-food-screen-more").click(() => {
    FMTConsumableItemScreenShowMore("add-food-screen", "food");
  });
  $("#add-food-screen-less").click(() => {
    FMTConsumableItemScreenShowLess("add-food-screen", "food");
  });
  $("#add-food-screen-save").click(() => {
    const onerrorFn = function (err) {
      const msg = `Failed adding food - ${err}`;
      console.error(msg);
      FMTShowAlertBar(msg, `add-food-screen-alerts`, "danger");
    };
    const onsuccessFn = function (ev, food) {
      const foodId = ev.target.result;
      food.food_id = foodId;
      const msg = `Successfully added food: ${food.foodName}`;
      const saveBtn = document.getElementById("add-food-screen-save");
      if (saveBtn) {
        const foodsTableBodyID = saveBtn.getAttribute(
          "consumables-table-body-id"
        );
        const foodsTableBodyNode = document.getElementById(foodsTableBodyID);
        if (foodsTableBodyNode) {
          console.debug(
            `Firing onConsumableAdded event to ${foodsTableBodyID}`
          );
          const event = new Event("onConsumableAdded");
          //@ts-ignore
          event.consumableObj = food;
          foodsTableBodyNode.dispatchEvent(event);
        }
      }
      pageController.closeAddFoodDynamicScreen();
      const alertDivID = pageController.getAlertDivId();
      FMTShowAlertBar(msg, alertDivID, "success");
    };
    FMTSaveConsumableItemScreen(
      "add-food-screen",
      "add",
      {},
      "food",
      "Food Item",
      true,
      onsuccessFn,
      onerrorFn
    );
  });
  $("#edit-food-screen-cancel").click(() => {
    //TODO check for changes and prompt if needed
    pageController.closeEditFoodDynamicScreen();
  });
  $("#edit-food-screen-more").click(() => {
    FMTConsumableItemScreenShowMore("edit-food-screen", "food");
  });
  $("#edit-food-screen-less").click(() => {
    FMTConsumableItemScreenShowLess("edit-food-screen", "food");
  });
  $("#edit-food-screen-save").click((e) => {
    const dom_foodId = e.currentTarget.getAttribute("food_id");
    if (!FMTIsValidId(dom_foodId)) {
      console.error(`Invalid Food ID (${dom_foodId})`);
      return;
    }
    const foodId = Number(dom_foodId);

    const onerrorFn = function (err) {
      const msg = `Failed editing food - ${err}`;
      console.error(msg);
      FMTShowAlertBar(msg, `edit-food-screen-alerts`, "danger");
    };

    const onsuccessFn = function (ev, food) {
      const saveBtn = document.getElementById("edit-food-screen-save");
      if (saveBtn) {
        const foodsTableBodyID = saveBtn.getAttribute(
          "consumables-table-body-id"
        );
        const foodsTableBodyNode = document.getElementById(foodsTableBodyID);
        if (foodsTableBodyNode) {
          console.debug(
            `Firing onConsumableEdited event to ${foodsTableBodyID}`
          );
          const event = new Event("onConsumableEdited");
          //@ts-ignore
          event.consumableObj = food;
          foodsTableBodyNode.dispatchEvent(event);
        }
      }
      const msg = `Successfully updated food: ${
        // @ts-ignore
        document.getElementById("edit-food-screen-food-name").value
      }`;

      const mealIdentifierObj = {
        meal_year: saveBtn.getAttribute("meal_year"),
        meal_month: saveBtn.getAttribute("meal_month"),
        meal_day: saveBtn.getAttribute("meal_day"),
        meal_name: saveBtn.getAttribute("meal_name"),
        profile_id: saveBtn.getAttribute("profile_id"),
      };
      const validateMealIdentifierObjRes =
        FMTValidateMealIdentifier(mealIdentifierObj);
      /*            if (validateMealIdentifierObjRes.mealIdentifier == null || validateMealIdentifierObjRes.error != null) {
                console.error(validateMealIdentifierObjRes.error);
            }*/
      const mealIdentifier = validateMealIdentifierObjRes.mealIdentifier;

      pageController.closeEditFoodDynamicScreen();
      pageController.openViewFoodDynamicScreen(
        foodId,
        1,
        true,
        undefined,
        undefined,
        mealIdentifier,
        undefined,
        undefined
      );
      const alertDivID = pageController.getAlertDivId();
      FMTShowAlertBar(msg, alertDivID, "success");
    };

    FMTSaveConsumableItemScreen(
      "edit-food-screen",
      "edit",
      { consumableId: foodId },
      "food",
      "Food Item",
      true,
      onsuccessFn,
      onerrorFn
    );
  });
  $("#edit-food-screen-delete").click((e) => {
    FMTUIDeleteConsumable(e, "edit-food-screen", "food", "Food Item");
  });
  $("#view-food-screen-food-serving-input").keyup(function (event) {
    FMTUpdateConsumableValuesOnServingChange(
      event,
      "view-food-screen",
      "food",
      "Food Item"
    );
  });
  $("#view-recipe-screen-recipe-serving-input").keyup(function (event) {
    FMTUpdateConsumableValuesOnServingChange(
      event,
      "view-recipe-screen",
      "recipe",
      "Recipe Item"
    );
  });
  $("#edit-ingredient-screen-ingredient-serving-input").keyup(function (event) {
    if (isFunction(fmtAppInstance.editIngredientServingKeyupFn)) {
      fmtAppInstance.editIngredientServingKeyupFn(event);
    }
  });
  $("#view-food-screen-more").click(() => {
    FMTConsumableItemScreenShowMore("view-food-screen", "food");
  });
  $("#view-food-screen-less").click(() => {
    FMTConsumableItemScreenShowLess("view-food-screen", "food");
  });
  $("#view-food-screen-cancel").click(() => {
    pageController.closeViewFoodDynamicScreen();
  });
  $("#view-food-screen-edit").click((e) => {
    FMTUIEditBtnClick("view-food-screen", "food", "Food Item", e);
  });
  $("#view-food-screen-save").click((e) => {
    FMTUIAddtoMealBtnClick("view-food-screen", "food", "Food Item", e);
  });
  $("#view-food-screen-add").click(() => {
    if (isFunction(fmtAppInstance.viewFoodAddIngredientFn)) {
      fmtAppInstance.viewFoodAddIngredientFn();
      fmtAppInstance.viewFoodAddIngredientFn = null;
    }
  });
  $("#add-recipe-screen-cancel").click(() => {
    pageController.closeAddRecipeDynamicScreen();
  });
  $("#add-recipe-screen-recipe-ingredients-add").click(() => {
    if (isFunction(fmtAppInstance.addRecipeAddIngredientFn)) {
      fmtAppInstance.addRecipeAddIngredientFn();
    }
  });
  $("#add-recipe-screen-recipe-preparation-steps-add").click((e) => {
    const prepStepContainerDiv = e.currentTarget.parentElement;
    FMTUIAddPreparationStep(prepStepContainerDiv, false);
  });
  $("#add-recipe-screen-more").click(() => {
    FMTConsumableItemScreenShowMore("add-recipe-screen", "recipe");
  });
  $("#add-recipe-screen-less").click(() => {
    FMTConsumableItemScreenShowLess("add-recipe-screen", "recipe");
  });
  $("#add-recipe-screen-save").click(() => {
    if (isFunction(fmtAppInstance.addRecipeSaveRecipeFn)) {
      fmtAppInstance.addRecipeSaveRecipeFn();
    }
  });
  $("#view-recipe-screen-cancel").click(() => {
    pageController.closeViewRecipeDynamicScreen();
  });
  $("#view-recipe-screen-more").click(() => {
    FMTConsumableItemScreenShowMore("view-recipe-screen", "recipe");
  });
  $("#view-recipe-screen-less").click(() => {
    FMTConsumableItemScreenShowLess("view-recipe-screen", "recipe");
  });
  $("#view-recipe-screen-edit").click((e) => {
    FMTUIEditBtnClick("view-recipe-screen", "recipe", "Recipe Item", e);
  });
  $("#view-recipe-screen-save").click((e) => {
    FMTUIAddtoMealBtnClick("view-recipe-screen", "recipe", "Recipe Item", e);
  });
  $("#edit-recipe-screen-save").click(() => {
    if (isFunction(fmtAppInstance.editRecipeSaveRecipeFn)) {
      fmtAppInstance.editRecipeSaveRecipeFn();
    }
  });
  $("#edit-recipe-screen-cancel").click(() => {
    pageController.closeEditRecipeDynamicScreen();
  });
  $("#edit-recipe-screen-recipe-ingredients-add").click(() => {
    if (isFunction(fmtAppInstance.editRecipeAddIngredientFn)) {
      fmtAppInstance.editRecipeAddIngredientFn();
    }
  });
  $("#edit-recipe-screen-recipe-preparation-steps-add").click((e) => {
    const prepStepContainerDiv = e.currentTarget.parentElement;
    FMTUIAddPreparationStep(prepStepContainerDiv, false);
  });
  $("#edit-recipe-screen-more").click(() => {
    FMTConsumableItemScreenShowMore("edit-recipe-screen", "recipe");
  });
  $("#edit-recipe-screen-less").click(() => {
    FMTConsumableItemScreenShowLess("edit-recipe-screen", "recipe");
  });
  $("#edit-recipe-screen-delete").click((e) => {
    if (isFunction(fmtAppInstance.editRecipeDeleteFn)) {
      fmtAppInstance.editRecipeDeleteFn(e);
    }
  });
  $("#edit-ingredient-screen-delete").click(() => {
    if (isFunction(fmtAppInstance.editIngredientDeleteFn)) {
      fmtAppInstance.editIngredientDeleteFn();
    }
  });
  $("#edit-ingredient-screen-save").click(() => {
    if (isFunction(fmtAppInstance.editIngredientUpdateFn)) {
      fmtAppInstance.editIngredientUpdateFn();
    }
  });
  $("#edit-ingredient-screen-cancel").click(() => {
    pageController.closeEditIngredientDynamicScreen();
  });
  $("#edit-ingredient-screen-more").click(() => {
    FMTConsumableItemScreenShowMore("edit-ingredient-screen", "ingredient");
  });
  $("#edit-ingredient-screen-less").click(() => {
    FMTConsumableItemScreenShowLess("edit-ingredient-screen", "ingredient");
  });
  $("#add-to-recipe-screen-cancel").click(() => {
    pageController.closeAddToRecipeDynamicScreen();
  });
  $("#add-to-recipe-screen-add").click(() => {
    const addBtn = document.getElementById("add-to-recipe-screen-add");
    const foodsTableBodyID = "add-to-recipe-screen-food-table-body";
    const qualifier = addBtn.getAttribute("action");
    switch (qualifier) {
      case "food":
      default:
        pageController.openAddFoodDynamicScreen(foodsTableBodyID);
        break;
    }
  });
  /*    $("#overview-add-to-meal").click( (e) => {
        const overviewAddToMealBtn = document.getElementById("overview-add-to-meal");
        const mealIdentifierObj = {};
        mealIdentifierObj.meal_year = overviewAddToMealBtn.getAttribute("meal_year");
        mealIdentifierObj.meal_month = overviewAddToMealBtn.getAttribute("meal_month");
        mealIdentifierObj.meal_day = overviewAddToMealBtn.getAttribute("meal_day");
        mealIdentifierObj.meal_name = null;
        mealIdentifierObj.profile_id = fmtAppInstance.currentProfileId;
        pageController.openAddToMealDynamicScreen(mealIdentifierObj);
    });*/
  $("#add-to-meal-screen-cancel").click(() => {
    pageController.closeAddToMealDynamicScreen();
  });
  $("#add-to-meal-screen-add").click(() => {
    const addBtn = document.getElementById("add-to-meal-screen-add");
    let consumablesTableBodyID;
    const qualifier = addBtn.getAttribute("action");
    switch (qualifier) {
      case "recipe":
        consumablesTableBodyID = "add-to-meal-screen-recipe-table-body";
        pageController.openAddRecipeDynamicScreen(consumablesTableBodyID);
        break;
      case "food":
      default:
        consumablesTableBodyID = "add-to-meal-screen-food-table-body";
        pageController.openAddFoodDynamicScreen(consumablesTableBodyID);
        break;
    }
  });
  $("#add-to-meal-screen-my-food-btn").click(() => {
    FMTToggleFoodMenu("add-to-meal-screen", "food");
  });
  $("#add-to-meal-screen-my-recipe-btn").click(() => {
    FMTToggleFoodMenu("add-to-meal-screen", "recipe");
  });
  $("#edit-meal-entry-screen-delete").click(() => {
    const alertsDivId = "edit-meal-entry-screen-alerts";
    const delBtn = document.getElementById("edit-meal-entry-screen-delete");
    const dom_entry_id = delBtn.getAttribute("entry_id");
    if (!FMTIsValidId(dom_entry_id)) {
      const msg = `Invalid Entry ID (${dom_entry_id}). Please reload`;
      console.error(msg);
      // FMTShowAlert(alertsDivId, "danger", msg, fmtAppGlobals.defaultAlertScroll);
      return;
    }
    const entry_id = Number(dom_entry_id);
    const msg = `Are you sure you would like to delete this Entry?`;
    FMTShowPrompt(
      alertsDivId,
      "warning",
      msg,
      fmtAppGlobals.defaultAlertScroll,
      function (delEntry) {
        if (delEntry) {
          FMTRemoveMealEntry(
            entry_id,
            function () {
              pageController.closeEditMealEntryDynamicScreen();
              const openScreens = pageController.updateZIndexes(true);
              const msg = `Successfully deleted Entry!`;
              if (
                openScreens.length < 1 &&
                fmtAppInstance.pageState.activeTab === "overview"
              ) {
                pageController.showOverview();
                FMTShowAlertBar(msg, "overview-alerts", "success");
              }
            },
            function () {
              pageController.closeEditMealEntryDynamicScreen();
              const openScreens = pageController.updateZIndexes(true);
              const msg = `Failed deleting Entry!`;
              if (
                openScreens.length < 1 &&
                fmtAppInstance.pageState.activeTab === "foods"
              ) {
                pageController.showOverview();
                FMTShowAlertBar(msg, "overview-alerts", "danger");
              }
            }
          );
        } else {
          FMTShowAlertBar(`Entry not deleted!`, alertsDivId, "success");
        }
      }
    );
  });
  $("#edit-meal-entry-screen-save").click(() => {
    const baseScreenID = "edit-meal-entry-screen";
    const qualifier = "consumable";
    const objectType = "Meal Entry";
    const alertsDivId = `${baseScreenID}-alerts`;
    const updateBtn = document.getElementById(`${baseScreenID}-save`);
    const dom_entry_id = updateBtn.getAttribute("entry_id");
    if (!FMTIsValidId(dom_entry_id)) {
      const msg = `Invalid Meal Entry. Please reload`;
      console.error(msg);
      FMTShowAlert(
        alertsDivId,
        "danger",
        msg,
        fmtAppGlobals.defaultAlertScroll
      );
      return;
    }
    const entry_id = Number(dom_entry_id);
    const consumableValues = FMTSaveConsumableItemScreen(
      baseScreenID,
      "get-object",
      undefined,
      qualifier,
      objectType,
      true,
      undefined,
      undefined
    );
    console.log(consumableValues);
    FMTUpdateMealEntry(
      entry_id,
      consumableValues,
      function () {
        const msg = `Successfully updated Meal Entry`;
        pageController.closeEditMealEntryDynamicScreen();
        pageController.showOverview();
        FMTShowAlertBar(msg, "overview-alerts", "success");
      },
      function (e) {
        console.error(e);
        const msg = `Failed updating Meal Entry`;
        pageController.closeEditMealEntryDynamicScreen();
        pageController.showOverview();
        FMTShowAlertBar(msg, "overview-alerts", "danger");
      }
    );
  });
  $("#overview-total-calories").click(() => {
    document.getElementById("overview-total-calories").classList.add("d-none");
    document
      .getElementById("overview-total-calories-verb")
      .classList.remove("d-none");
  });
  $("#overview-total-calories-verb").click(() => {
    document
      .getElementById("overview-total-calories-verb")
      .classList.add("d-none");
    document
      .getElementById("overview-total-calories")
      .classList.remove("d-none");
  });
  $("#overview-total-carbs").click(() => {
    document.getElementById("overview-total-carbs").classList.add("d-none");
    document
      .getElementById("overview-total-carbs-verb")
      .classList.remove("d-none");
  });
  $("#overview-total-carbs-verb").click(() => {
    document
      .getElementById("overview-total-carbs-verb")
      .classList.add("d-none");
    document.getElementById("overview-total-carbs").classList.remove("d-none");
  });
  $("#overview-total-proteins").click(() => {
    document.getElementById("overview-total-proteins").classList.add("d-none");
    document
      .getElementById("overview-total-proteins-verb")
      .classList.remove("d-none");
  });
  $("#overview-total-proteins-verb").click(() => {
    document
      .getElementById("overview-total-proteins-verb")
      .classList.add("d-none");
    document
      .getElementById("overview-total-proteins")
      .classList.remove("d-none");
  });
  $("#overview-total-fats").click(() => {
    document.getElementById("overview-total-fats").classList.add("d-none");
    document
      .getElementById("overview-total-fats-verb")
      .classList.remove("d-none");
  });
  $("#overview-total-fats-verb").click(() => {
    document.getElementById("overview-total-fats-verb").classList.add("d-none");
    document.getElementById("overview-total-fats").classList.remove("d-none");
  });
  $("#edit-meal-entry-screen-cancel").click(() => {
    pageController.closeEditMealEntryDynamicScreen();
  });
  $("#edit-meal-entry-screen-consumable-serving-input").keyup(function (event) {
    FMTUpdateConsumableValuesOnServingChange(
      event,
      "edit-meal-entry-screen",
      "consumable",
      "Meal Entry"
    );
  });
  $("#edit-meal-entry-screen-more").click(() => {
    FMTConsumableItemScreenShowMore("edit-meal-entry-screen", "consumable");
  });
  $("#edit-meal-entry-screen-less").click(() => {
    FMTConsumableItemScreenShowLess("edit-meal-entry-screen", "consumable");
  });
  $("#settings-data-control-export").click(() => {
    const d = new Date();
    const fileName = `FMT_Data_export_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
    FMTDataToStructuredJSON(function (records) {
      FMTExportToJSON(
        records,
        function () {
          const link = document.createElement("a");
          link.setAttribute("download", fileName);
          link.href = fmtAppExport;
          link.click();
        },
        null,
        fileName
      );
    });
  });
  $("#settings-data-control-import").click(() => {
    if (platformInterface.hasPlatformInterface) {
      // This initiates the import process on the platform
      // When the user proceeds with selecting file, the platform will fire
      // [FMTImportData]
      platformInterface.FMTImportData();
    } else {
      document
        .getElementById("settings-data-control-import-indiv")
        .classList.remove("d-none");
    }
  });
  $("#settings-data-control-import-file").change(() => {
    const fileList = document.getElementById(
      "settings-data-control-import-file"
      // @ts-ignore
    ).files;
    if (fileList.length < 1) {
      document
        .getElementById("settings-data-control-import-indiv")
        .classList.add("d-none");
      return;
    }
    const file = fileList[0];
    document.getElementById(
      "settings-data-control-import-file-label"
    ).innerHTML = file.name;
    FMTShowPrompt(
      "settings-alerts",
      "warning",
      "Importing might cause loss of current application data. Are you sure?",
      undefined,
      function (res) {
        if (res) {
          const fileReader = new FileReader();
          fileReader.onloadend = function () {
            FMTImportFromStructuredJSON(fileReader.result);
          };
          fileReader.readAsText(file);
        } else {
          FMTShowAlert(
            "settings-alerts",
            "primary",
            "Import from file aborted!"
          );
          document
            .getElementById("settings-data-control-import-indiv")
            .classList.add("d-none");
          document.getElementById(
            "settings-data-control-import-file-label"
          ).innerHTML = "Choose file to Import";
        }
      }
    );
  });
  //Search functions
  $("#foods-food-search").keyup((e) => {
    // @ts-ignore
    let query = e.currentTarget.value;
    FMTQueryConsumablesTable("foods", "food", query);
  });
  $("#add-to-meal-screen-food-search").keyup((e) => {
    // @ts-ignore
    let query = e.currentTarget.value;
    FMTQueryConsumablesTable("add-to-meal-screen", "food", query);
  });
  $("#foods-recipe-search").keyup((e) => {
    // @ts-ignore
    let query = e.currentTarget.value;
    FMTQueryConsumablesTable("foods", "recipe", query);
  });
  $("#add-to-meal-screen-recipe-search").keyup((e) => {
    // @ts-ignore
    let query = e.currentTarget.value;
    FMTQueryConsumablesTable("add-to-meal-screen", "recipe", query);
  });
  $("#add-to-recipe-screen-food-search").keyup((e) => {
    // @ts-ignore
    let query = e.currentTarget.value;
    FMTQueryConsumablesTable("add-to-recipe-screen", "food", query);
  });
  $("#overview-date-prev").click(() => {
    FMTPreviousDay(FMTOverviewLoadCurrentDay);
  });
  $("#overview-date-next").click(() => {
    FMTNextDay(FMTOverviewLoadCurrentDay);
  });
  // @ts-ignore
  $(".carousel #profile-carousel").carousel({
    interval: false,
    wrap: false,
  });
  $("#profile-carousel").on("swiped-left", () => {
    // @ts-ignore
    $(".carousel").carousel("prev");
  });
  $("#profile-carousel").on("swiped-right", () => {
    // @ts-ignore
    $(".carousel").carousel("next");
  });
  // Workaround for weird Boostrap carousel behavior...
  document.getElementById("profile-first-indicator").click();
  // @ts-ignore
  $('[data-toggle="tooltip"]').tooltip();
  $("#profile-tdee-tooltip").on("shown.bs.tooltip", () => {
    setTimeout(() => {
      // @ts-ignore
      $("#profile-tdee-tooltip").tooltip("hide");
    }, 3000);
  });
  $("#profile-bmr-tooltip").on("shown.bs.tooltip", () => {
    setTimeout(() => {
      // @ts-ignore
      $("#profile-bmr-tooltip").tooltip("hide");
    }, 3000);
  });
  $("#profile-goto-macros").click(() => {
    document.getElementById("profile-last-indicator").click();
  });
  $("#profile-carousel-previous-chevron").click(() => {
    // @ts-ignore
    $(".carousel").carousel("prev");
  });
  $("#profile-carousel-next-chevron").click(() => {
    // @ts-ignore
    $(".carousel").carousel("next");
  });
}
