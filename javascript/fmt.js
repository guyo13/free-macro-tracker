//Instance
var fmtAppInstance = {};
//Instance - Db
fmtAppInstance.fmtDb = undefined;
//Instance - Settings
fmtAppInstance.displaySettings = {};
fmtAppInstance.displaySettings.showFoodIdColumn = true;
fmtAppInstance.promptSettings = {};
fmtAppInstance.promptSettings.promptOnUnsavedFood = true;
fmtAppInstance.promptSettings.promptOnNoProfileCreated = true;
fmtAppInstance.additionalNutrientsSettings = {};
fmtAppInstance.additionalNutrientsSettings.allowNonDefaultUnits = true;
//Instance - State - Page
fmtAppInstance.pageState = {};
fmtAppInstance.pageState.activeTab = null;
fmtAppInstance.pageState.activeDynamicScreens = {};
//Instance - State - Log
fmtAppInstance.today = null;
fmtAppInstance.currentDay = null;
//Instance - User defined metrics
fmtAppInstance.massUnitChart = null;
fmtAppInstance.additionalNutrients = null;
//Globals
var fmtAppGlobals = {};
//Globals - Links
fmtAppGlobals.projectURL = "https://github.com/guyo13/free-macro-tracker/issues";
//Globals - DB
fmtAppGlobals.fmtDb = undefined;
fmtAppGlobals.FMT_DB_NAME = "fmt";
fmtAppGlobals.FMT_DB_VER = 1;
fmtAppGlobals.FMT_DB_READONLY = "readonly";
fmtAppGlobals.FMT_DB_READWRITE = "readwrite";
fmtAppGlobals.FMT_DB_CURSOR_DIRS = ["next", "nextunique", "prev", "prevunique"];
//Globals - DB - Meal Entries Store constants
fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE = "fmt_meal_entries";
fmtAppGlobals.FMT_DB_MEAL_ENTRIES_KP = "entry_id";
fmtAppGlobals.FMT_DB_MEAL_ENTRIES_INDEXES = {"profile_id_date_index": {"kp": ["profile_id", "year", "month", "day"],
                                                                       "options": { unique: false }
                                                                      },
                                            };
//Globals - DB - Foods Store constants
fmtAppGlobals.FMT_DB_FOODS_STORE = "fmt_foods";
fmtAppGlobals.FMT_DB_FOODS_KP = "food_id";
fmtAppGlobals.FMT_DB_FOODS_INDEXES = {"food_name_index": {"kp": "foodName",
                                                          "options": { unique: false }
                                                         },
                                      "food_brand_index": {"kp": "foodBrand",
                                                           "options": { unique: false }
                                                          },
                                     };

//Globals - DB - Recipes Store constants
fmtAppGlobals.FMT_DB_RECIPES_STORE = "fmt_recipes";
fmtAppGlobals.FMT_DB_RECIPES_KP = "recipe_id";
fmtAppGlobals.FMT_DB_RECIPES_INDEXES = {"recipe_name_index": {"kp": "recipeName",
                                                              "options": { unique: false }
                                                         }
                                     };
//Globals - DB - Profile Store constants
fmtAppGlobals.FMT_DB_PROFILES_STORE = "fmt_profiles";
fmtAppGlobals.FMT_DB_PROFILES_KP = "profile_id";
//Globals - DB - Mass Units Store constants
fmtAppGlobals.FMT_DB_MASS_UNITS_STORE = "fmt_mass_units";
fmtAppGlobals.FMT_DB_MASS_UNITS_KP = "name";
//Globals - DB - Nutrients Store constants
fmtAppGlobals.FMT_DB_NUTRIENTS_STORE = "fmt_nutrients";
fmtAppGlobals.FMT_DB_NUTRIENTS_KP = ["category", "name"];
//Globals - DB - User Settings Store
fmtAppGlobals.FMT_DB_USER_SETTINGS_STORE = "fmt_user_settings";
fmtAppGlobals.FMT_DB_USER_SETTINGS_KP = "profile_id";
//Globals - DB - User Goals Store
fmtAppGlobals.FMT_DB_USER_GOALS_STORE = "fmt_user_goals";
fmtAppGlobals.FMT_DB_USER_GOALS_KP = ["profile_id", "year", "month", "day"];

//Globals - Page
fmtAppGlobals.tabIds = ["goto-overview","goto-foods", "goto-recipes", "goto-profile", "goto-advanced", "goto-export", "goto-import"];
fmtAppGlobals.dynamicScreenIds = ["add-food-screen", "edit-food-screen", "view-food-screen", "add-to-meal-screen"];
fmtAppGlobals.foodItemScreenStaticViewInputFields = ["food-name", "food-brand", /*"food-weight-input",*/ "food-calories", "food-proteins", "food-carbohydrates", "food-fats"];
fmtAppGlobals.dateDivIDs = ["overview-date-day-large", "overview-date-day-small"];
fmtAppGlobals.maxDynamicScreens = 1000;
//Globals - Units
fmtAppGlobals.supportedBodyweightUnits = ["Kg", "Lbs"];
fmtAppGlobals.supportedHeightUnits = ["Cm", "Inch"];
fmtAppGlobals.sexes = ["Male", "Female"];
fmtAppGlobals.supportedActivityLevels = ["Sedentary", "Light", "Moderate", "High", "Very High", "Custom"];

fmtAppGlobals.dateConstants = {};
fmtAppGlobals.dateConstants.monthNames = {0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun", 6: "Jul", 7: "Aug",
                                          9: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"};
fmtAppGlobals.dateConstants.daySuffixes = {0: "th", 1: "st", 2: "nd", 3: "rd", 4: "th",
                                           5: "th", 6: "th", 7: "th", 8: "th", 9: "th"};
//Globals - UI - Default
fmtAppGlobals.defaultAlertScroll = {top: 0, left: 0, behavior: 'smooth'};

//Functions
//Functions - Generic
function isPercent(num) {
    if (!isNaN(num)) {
        if (num >= 0 && num <= 100) {return true;}
        else {return false;} 
    }
    else {return false;}
}
function getDateString(d) {
    if (!d) {return "";}
    try {
        let dateString = `${fmtAppGlobals.dateConstants.monthNames[d.getMonth()]} ${d.getDate()}${fmtAppGlobals.dateConstants.daySuffixes[d.getDate()%10]} ${d.getFullYear()}`;
        return dateString;
    }
    catch (error) {
        console.error(error);
        return "";
    }
    
}
function appendChildren(DOMElement, childrenArray) {
    for (let k=0; k<childrenArray.length; k++) {
        DOMElement.appendChild(childrenArray[k]);
    }
}
function isNumber(input) {
    if (input === "" || isNaN(input) || input == null) { return false; }
    else { return true; }
}
function isDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}
function isSameDay(d1, d2) {
    return (d1.getFullYear() === d2.getFullYear()
            && d1.getMonth() === d2.getMonth()
            && d1.getDate() === d2.getDate());
}
//Functions - DB
function prepareDBv1() {
    console.debug("Preparing DB...");
    if (!fmtAppInstance.fmtDb) {
        console.error("fmt DB null reference");
        return;
    }
    const baseMassUnitChart = [{"name": "oz", "value_in_grams": 28.34952, "description": "Ounce"},
                               {"name": "lb", "value_in_grams": 453.5924, "description": "Pound"},
                               {"name": "st", "value_in_grams": 6350.293, "description": "Stone"},
                               {"name": "mcg", "value_in_grams": 0.000001, "description": "Microgram"}, 
                               {"name": "mg", "value_in_grams": 0.001, "description": "Milligram"},
                               {"name": "g", "value_in_grams": 1, "description": "Gram"},
                               {"name": "kg", "value_in_grams": 1000, "description": "Kilogram"}
                              ];
    const baseAdditionalNutrients = [{"name" : "Sugars", "category": "Carbohydrates", "default_mass_unit": "g", "help": "Total Sugars"},
                                         {"name" : "Fiber", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Starch", "category": "Carbohydrates", "default_mass_unit": "g", "help": "Total Starch"},
                                         {"name" : "Glucose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Sucrose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Ribose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Amylose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Amylopectin", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Maltose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Galactose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Fructose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Lactose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name": "Saturated Fats", "category": "Fats", "default_mass_unit": "g", "help": "Total"},
                                         {"name": "Monounsaturated Fats", "category": "Fats", "default_mass_unit": "g", "help": "Total"},
                                         {"name": "Polyunsaturated Fats", "category": "Fats", "default_mass_unit": "g", "help": "Total"},
                                         {"name": "Omega-3", "category": "Fats", "default_mass_unit": "g"},
                                         {"name": "Omega-6", "category": "Fats", "default_mass_unit": "g"},
                                         {"name": "Trans Fats", "category": "Fats", "default_mass_unit": "g"},
                                         {"name": "Cholesterol", "category": "Sterols", "default_mass_unit": "mg"},
                                         {"name": "Calcium", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Sodium", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Potassium", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Phosphorus", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Magnesium", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Chloride", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Sulfur", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Vitamin A", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin C", "category": "Vitamins", "default_mass_unit": "mg"},
                                         {"name": "Vitamin E", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin K", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin D", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin B1", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin B2", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin B3", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin B5", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin B6", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin B7", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin B9", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin B12", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Choline", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Iron", "category": "Trace Minerals", "default_mass_unit": "mg"},
                                         {"name": "Zinc", "category": "Trace Minerals", "default_mass_unit": "mg"},
                                         {"name": "Selenium", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                         {"name": "Iodine", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                         {"name": "Copper", "category": "Trace Minerals", "default_mass_unit": "mg"},
                                         {"name": "Manganese", "category": "Trace Minerals", "default_mass_unit": "mg"},
                                         {"name": "Fluoride", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                         {"name": "Cobalt", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                         {"name": "Molybdenum", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                     {"name": "Alanine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Arginine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Aspartic acid", "category": "Amino Acids", "default_mass_unit": "mg", "help": "Aspartate"},
                                     {"name": "Asparagine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Cysteine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Glutamic acid", "category": "Amino Acids", "default_mass_unit": "mg", "help": "Glutamate"},
                                     {"name": "Glutamine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Glycine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Histidine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Isoleucine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Leucine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Lysine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Methionine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Phenylalanine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Proline", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Serine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Threonine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Tryptophan", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Tyrosine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Valine", "category": "Amino Acids", "default_mass_unit": "mg"},
                                     {"name": "Water", "category": "Other", "default_mass_unit": "g"},
                                     {"name": "Ash", "category": "Other", "default_mass_unit": "g"},
                                     {"name": "Alcohol", "category": "Other", "default_mass_unit": "g"},
                                        ];
    //Create Meal Entries objectStore
    let fmtMealEntriesStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_MEAL_ENTRIES_KP, autoIncrement: true});
    createIndexes(fmtMealEntriesStore, fmtAppGlobals.FMT_DB_MEAL_ENTRIES_INDEXES);
    
    //Create Foods objectStore
    let fmtFoodsStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE,
                                                              {keyPath: fmtAppGlobals.FMT_DB_FOODS_KP, autoIncrement: true});
    createIndexes(fmtFoodsStore, fmtAppGlobals.FMT_DB_FOODS_INDEXES);
    
    //Create Recipes objectStore
    let fmtRecipesStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_RECIPES_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_RECIPES_KP, autoIncrement: true});
    createIndexes(fmtRecipesStore, fmtAppGlobals.FMT_DB_RECIPES_INDEXES);
    
    //Create Profiles objectStore
    let fmtProfilesStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_PROFILES_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_PROFILES_KP, autoIncrement: false});
    
    //Create Mass Units objectStore and populate default entries
    let fmtMassUnitsStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_MASS_UNITS_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_MASS_UNITS_KP, autoIncrement: false});
    for (let i in baseMassUnitChart) {
        console.debug(`Adding Mass unit entry: ${JSON.stringify(baseMassUnitChart[i])}`);
        fmtMassUnitsStore.add(baseMassUnitChart[i]);
    }
    
    //Create Nutrients objectStore and populate default entries
    let fmtNutrientsStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_NUTRIENTS_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_NUTRIENTS_KP, autoIncrement: false});
    for (let i in baseAdditionalNutrients) {
        let nutri = baseAdditionalNutrients[i];
        console.debug(`Inserting Additional Nutrient entry: ${JSON.stringify(nutri)}`);
        fmtNutrientsStore.add(nutri);
    }
    //Create User Settings objectStore
    let fmtUserSettingsStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_USER_SETTINGS_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_USER_SETTINGS_KP, autoIncrement: false});
    //Create User Goals objectStore
    let fmtUserGoalsStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_USER_GOALS_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_USER_GOALS_KP, autoIncrement: false});
}
function getObjectStore(store_name, mode) {
    if (!fmtAppInstance.fmtDb) {
        console.error("fmt DB null reference");
        return;
    }
    var tx = fmtAppInstance.fmtDb.transaction(store_name, mode);
    return tx.objectStore(store_name);
}
function createIndexes(objectStore, indexesObj) {
    for (const indexName in indexesObj) {
        try {
            const indexKp = indexesObj[indexName].kp;
            const indexOptions = indexesObj[indexName].options;
            objectStore.createIndex(indexName, indexKp, indexOptions);            
        }
        catch (error) {
            console.error(error);
            console.log(indexesObj);
        }

    }
}
function getIndex(store_name, indexName) {
    const objectStore = getObjectStore(store_name, fmtAppGlobals.FMT_DB_READONLY);
    const index = objectStore.index(indexName);
    return index;
}
//Functions - Validation
function FMTValidateNutritionalValue(nutritionalValueObj, mUnitsChart) {
    if (mUnitsChart == null) {
        mUnitsChart = fmtAppInstance.massUnitChart;
    }
    const result = {};
    const nutritionalValue = {};
    let error = null;
    
    if (!isNumber(nutritionalValueObj.calories)) {
        error = `Calories must be a valid number (got ${nutritionalValueObj.calories}`;
        result.error = error;
        return result;
    }
    nutritionalValue.calories = Number(nutritionalValueObj.calories);
    
    if (!isNumber(nutritionalValueObj.proteins)) {
        error = `Proteins must be a valid number (got ${nutritionalValueObj.proteins}`;
        result.error = error;
        return result;
    }
    nutritionalValue.proteins = Number(nutritionalValueObj.proteins);
    
    if (!isNumber(nutritionalValueObj.carbohydrates)) {
        error = `Carbohydrates must be a valid number (got ${nutritionalValueObj.carbohydrates}`;
        result.error = error;
        return result;
    }
    nutritionalValue.carbohydrates = Number(nutritionalValueObj.carbohydrates);
    
    if (!isNumber(nutritionalValueObj.fats)) {
        error = `fats must be a valid number (got ${nutritionalValueObj.fats}`;
        result.error = error;
        return result;
    }
    nutritionalValue.fats = Number(nutritionalValueObj.fats);

    let additionalNutrients = nutritionalValueObj.additionalNutrients;
    nutritionalValue.additionalNutrients = {}
    
    if (additionalNutrients != null ) {
        for (const nutrientCategoryName in additionalNutrients) {
            const nutrientsInCat = additionalNutrients[nutrientCategoryName];
            if (Array.isArray(nutrientsInCat) && nutrientsInCat.length > 0) {
                const validatedNutrientsInCat = [];
                for (const j in nutrientsInCat) {
                    const validatedNutrient = {};
                    const nutrient = nutrientsInCat[j];
                    if (nutrient.name == null || nutrient.name === "") {
                        error = `Nutrient in Category "${nutrientCategoryName}" has empty name`;
                        result.error = error;
                        return result;
                    }
                    if (!isNumber(nutrient.mass)) {
                        error = `Nutrient "${nutrient.name}" (Category ${nutrientCategoryName}) has invalid value "${nutrient.mass}"`;
                        result.error = error;
                        return result;
                    }
                    if (!(nutrient.unit in mUnitsChart)) {
                        error = `Nutrient "${nutrient.name}" (Category ${nutrientCategoryName}) has unknown or invalid mass unit "${nutrient.unit}"`;
                        result.error = error;
                        return result;
                    }
                    validatedNutrient.name = nutrient.name;
                    validatedNutrient.mass = Number(nutrient.mass);
                    validatedNutrient.unit = nutrient.unit;
                    validatedNutrientsInCat.push(validatedNutrient);
                }
                if (validatedNutrientsInCat.length > 0) {
                    nutritionalValue.additionalNutrients[nutrientCategoryName] = validatedNutrientsInCat;
                }
            }
        }
    }
    
    result.nutritionalValue = nutritionalValue;
    return result;
}
/*foodObj - {foodName, foodBrand(optional), referenceWeight, weightUnits, nutritionalValue}
 *nutritionalValue - {calories, proteins, carbohydrates, fats, additionalNutrients}
 *additionalNutrients - {Category1:[nutrient11, ... , nutrient1N],..CategoryM:[nutrientM1, ... , nutrientMN],}
 *nutrient - {name,unit,mass}
*/
function FMTValidateFoodObject(foodObj, mUnitsChart) {
    const result = {};
    let food = {};
    if (foodObj.foodName == null || foodObj.foodName === "") {
        console.debug(`[FMTValidateFoodObject] - null foodName`);
        return {"food": null, "error": "Food Description must not be empty"};
    }
    else { food.foodName = foodObj.foodName; }
    food.foodBrand = foodObj.foodBrand;
    if (!isNumber(foodObj.referenceWeight) || Number(foodObj.referenceWeight) <= 0) {
        console.debug(`[FMTValidateFoodObject] - referenceWeight is not a positive number`);
        return {"food": null, "error": "Weight must be positive number"};
    }
    else { food.referenceWeight = Number(foodObj.referenceWeight); }
    if (foodObj.weightUnits == null) {
        console.debug(`[FMTValidateFoodObject] - null weightUnits`);
        return {"food": null, "error": "Invalid Weight units"};
    }
    else { food.weightUnits = foodObj.weightUnits; }
    if (foodObj.nutritionalValue == null) {
        console.debug(`[FMTValidateFoodObject] - null nutritionalValue`);
        return {"food": null, "error": "Nutritional Value must not be empty"};
    }
    else {
        let nutritionalValue = foodObj.nutritionalValue;
        food.nutritionalValue = {};
        if (!isNumber(nutritionalValue.calories)) {
            console.debug(`[FMTValidateFoodObject] - nutritionalValue.calories is NaN`);
            return {"food": null, "error": "Calories value must be a valid number"};
        }
        else { food.nutritionalValue.calories = Number(nutritionalValue.calories); }
        if (!isNumber(nutritionalValue.proteins)) {
            console.debug(`[FMTValidateFoodObject] - nutritionalValue.proteins is NaN`);
            return{"food": null, "error": "Proteins value must be a valid number"};
        }
        else { food.nutritionalValue.proteins = Number(nutritionalValue.proteins); }
        if (!isNumber(nutritionalValue.carbohydrates)) {
            console.debug(`[FMTValidateFoodObject] - nutritionalValue.carbohydrates is NaN`);
            return {"food": null, "error": "Carbohydrates value must be a valid number"};
        }
        else { food.nutritionalValue.carbohydrates = Number(nutritionalValue.carbohydrates); }
        if (!isNumber(nutritionalValue.fats)) {
            console.debug(`[FMTValidateFoodObject] - nutritionalValue.fats is NaN`);
            return {"food": null, "error": "Fats value must be a valid number"};
        }
        else { food.nutritionalValue.fats = Number(nutritionalValue.fats); }
        let additionalNutrients = nutritionalValue.additionalNutrients;
        food.nutritionalValue.additionalNutrients = {};
        if (additionalNutrients != null ) {
            for (const nutrientCategoryName in additionalNutrients) {
                const nutrientsInCat = additionalNutrients[nutrientCategoryName];
                if (Array.isArray(nutrientsInCat) && nutrientsInCat.length > 0) {
                    const validatedNutrientsInCat = [];
                    for (const j in nutrientsInCat) {
                        const validatedNutrient = {};
                        const nutrient = nutrientsInCat[j];
                        if (nutrient.name == null || nutrient.name === "") {
                            console.debug(`[FMTValidateFoodObject] - nutrient.name is null ${JSON.stringify(nutrient)}`);
                            const errMsg = `Nutrient in Category "${nutrientCategoryName}" has empty name`;
                            return {"food": null, "error": errMsg};
                        }
                        if (!isNumber(nutrient.mass)) {
                            console.debug(`[FMTValidateFoodObject] - nutrient.mass is not a number ${JSON.stringify(nutrient)}`);
                            const errMsg = `Nutrient "${nutrient.name}" (Category ${nutrientCategoryName}) has invalid value "${nutrient.mass}"`;
                            return {"food": null, "error": errMsg};
                        }
                        if (!(nutrient.unit in mUnitsChart)) {
                            console.debug(`[FMTValidateFoodObject] - nutrient.unit is not in Mass Unit chart ${JSON.stringify(nutrient)}\n${JSON.stringify(mUnitsChart)}`);
                            const errMsg = `Nutrient "${nutrient.name}" (Category ${nutrientCategoryName}) has unknown or invalid mass unit "${nutrient.unit}"`;
                            return {"food": null, "error": errMsg};
                        }
                        validatedNutrient.name = nutrient.name;
                        validatedNutrient.mass = Number(nutrient.mass);
                        validatedNutrient.unit = nutrient.unit;
                        validatedNutrientsInCat.push(validatedNutrient);
                    }
                    if (validatedNutrientsInCat.length > 0) {
                        food.nutritionalValue.additionalNutrients[nutrientCategoryName] = validatedNutrientsInCat;
                    }
                }
            }
        }
    }
    return {"food": food, "error": null};
}
/*massUnitObj {name, value_in_grams, description}*/
function FMTValidateMassUnitObject(massUnitObj) {
    let massUnit = {};
    if (massUnitObj.name == null || massUnitObj.name === "") {
        console.debug(`[FMTValidateMassUnitObject] - massUnitObj.name is null or empty string`);
        return;
    }
     if (!isNumber(massUnitObj.value_in_grams)) {
        console.debug(`[FMTValidateMassUnitObject] - massUnitObj.value_in_grams is NaN`);
        return;
    }
    massUnit.name = massUnitObj.name;
    massUnit.value_in_grams = massUnitObj.value_in_grams;
    massUnit.description = massUnitObj.description;
    return massUnit;
}
/*nutrientObj {name,category,default_mass_unit,help}*/
function FMTValidateNutrientObject(nutrientObj) {
    let nutrient = {};
    if (nutrientObj.name == null || massUnitObj.name === "") {
        console.debug(`[FMTValidateNutrientObject] - nutrientObj.name is null or empty string`);
        return;
    }
    if (nutrientObj.category == null || massUnitObj.category === "") {
        console.debug(`[FMTValidateNutrientObject] - nutrientObj.category is null or empty string`);
        return;
    }
        if (nutrientObj.default_mass_unit == null || massUnitObj.default_mass_unit === "") {
        console.debug(`[FMTValidateNutrientObject] - nutrientObj.default_mass_unit is null or empty string`);
        return;
    }
    nutrient.name = nutrientObj.name;
    nutrient.category = nutrientObj.category;
    nutrient.default_mass_unit = nutrientObj.default_mass_unit;
    nutrient.help = nutrientObj.help;
    return nutrient;
}
function FMTValidateMacroSplit(macroSplitObj) {
    const result = {};
    const macroSplit = {};
    let error = null;
    if (macroSplit == null) {
        result.macroSplit = macroSplit;
        return result;
    }
    if (macroSplitObj.Calories == null
        && macroSplitObj.Protein == null
        && macroSplitObj.Carbohydrate == null
        && macroSplitObj.Fat == null) {
        result.macroSplit = macroSplit;
        return result;
    }
    if (macroSplitObj.Calories != null && !isNumber(macroSplitObj.Calories)) {
        error = `Invalid Calories ${macroSplitObj.Calories}`;
        result.error = error;
        return result;
    }
    if (macroSplitObj.Protein != null && !isPercent(macroSplitObj.Protein)) {
        error = `Invalid Protein ${macroSplitObj.Protein}`;
        result.error = error;
        return result;
    }
    if (macroSplitObj.Carbohydrate != null && !isPercent(macroSplitObj.Carbohydrate)) {
        error = `Invalid Carbohydrate ${macroSplitObj.Carbohydrate}`;
        result.error = error;
        return result;
    }
    if (macroSplitObj.Fat != null && !isPercent(macroSplitObj.Fat)) {
        error = `Invalid Fat ${macroSplitObj.Fat}`;
        result.error = error;
        return result;
    }
    else {
        const sum = Number(macroSplitObj.Protein) + Number(macroSplitObj.Carbohydrate) + Number(macroSplitObj.Fat);
        if ( sum === 100) {
            macroSplit.Calories = Number(macroSplitObj.Calories);
            macroSplit.Protein = Number(macroSplitObj.Protein);
            macroSplit.Carbohydrate = Number(macroSplitObj.Carbohydrate);
            macroSplit.Fat = Number(macroSplitObj.Fat);
            result.macroSplit = macroSplit;
            return result;
        }
        else {
            error = `The sum of Protein, Carbohydrate and Fat Percentages must equal 100, current sum is ${sum}`;
            result.error = error;
            return result;
        }
    }
    error = `Error Validating Macro split!`;
    console.error(macroSplitObj);
    result.error = error;
    return result;
}
function FMTValidateProfile(profileObj) {
    const result = {};
    const profile = {};
    let error = null;
    if (!isNumber(profileObj.profile_id) || !Number.isInteger(Number(profileObj.profile_id))) {
        error = `Profile id must be an integer, got (${profileObj.profile_id})`;
        result.error = error;
        return result;
    }
    profile.profile_id = Number(profileObj.profile_id);
    
    profile.name = profileObj.name
    
    if (!isNumber(profileObj.bodyWeight)) {
        error = `Invalid body weight ${profileObj.bodyWeight}`;
        result.error = error;
        return result;
    }
    profile.bodyWeight = Number(profileObj.bodyWeight);
    
    if (fmtAppGlobals.supportedBodyweightUnits.indexOf(profileObj.bodyWeightUnits) < 0) {
        error = `Invalid body weight units ${profileObj.bodyWeightUnits}`;
        result.error = error;
        return result;
    }
    profile.bodyWeightUnits = profileObj.bodyWeightUnits;
    switch(profile.bodyWeightUnits) {
        case "Kg":
            profile.bodyWeightKg = profile.bodyWeight;
            break;
        case "Lbs":
            profile.bodyWeightKg = profile.bodyWeight / 2.2;
            break;
    }
    
    if (!isNumber(profileObj.height)) {
        error = `Invalid height ${profileObj.height}`;
        result.error = error;
        return result;
    }
    profile.height = Number(profileObj.height);
    
    if (fmtAppGlobals.supportedHeightUnits.indexOf(profileObj.heightUnits) < 0) {
        error = `Invalid height units ${profileObj.heightUnits}`;
        result.error = error;
        return result;
    }
    profile.heightUnits = profileObj.heightUnits;
    
    switch(profile.heightUnits) {
        case "Cm":
            profile.heightCm = profile.height;
            break;
        case "Inch":
            profile.heightCm = profile.height * 2.54;
            break;
    }
    if ( !(Number.isInteger(Number(profileObj.age)) && Number(profileObj.age) > 0) ) {
        error = `Invalid age ${profileObj.age}`;
        result.error = error;
        return result;
    }
    profile.age = Number(profileObj.age);
    
    if (fmtAppGlobals.sexes.indexOf(profileObj.sex) < 0) {
        error = `Invalid sex ${profileObj.sex}`;
        result.error = error;
        return result;
    }
    profile.sex = profileObj.sex;
    
    if (isNumber(profileObj.bodyfat) && isPercent(Number(profileObj.bodyfat))) {
        profile.bodyfat = Number(profileObj.bodyfat);
        profile.bodyfatReal = profile.bodyfat / 100;
        profile.formula = "Katch-McArdle";
    }
    else {
        profile.bodyfatReal = null;
        profile.bodyfat = null;
        profile.formula = "Mifflin-St Jeor";
    }
    if (fmtAppGlobals.supportedActivityLevels.indexOf(profileObj.activityLevel) < 0) {
        error = `Invalid activityLevel ${profileObj.activityLevel}`;
        result.error = error;
        return result;
    }
    profile.activityLevel = profileObj.activityLevel;
    
    if (!isNumber(profileObj.activityMultiplier)) {
        error = `Invalid activity multiplier ${profileObj.activityMultiplier}`;
        result.error = error;
        return result;
    }
    profile.activityMultiplier = Number(profileObj.activityMultiplier);
    
    switch(profile.formula) {
        case "Katch-McArdle":
            profile.bmr = katchMcArdle(profile.bodyWeightKg, profile.bodyfatReal);
            break;
        case "Mifflin-St Jeor":
        default:
            profile.bmr = mifflinStJeor(profile.bodyWeightKg, profile.heightCm, profile.age, profile.sex);
            break;
    }
    if (profile.bmr <= 0) {
        error = `Invalid BMR ${profile.bmr}`;
        result.error = error;
        return result;
    }
    
    profile.tdee = profile.bmr * profile.activityMultiplier;
    
    if (profileObj.tzMinutes !== undefined && !Number.isInteger(profileObj.tzMinutes)) {
        error = `Invalid timezone ${profileObj.tzMinutes}`;
        result.error = error;
        return result;
    }
    if (profileObj.date !== undefined && !isDate(new Date(profileObj.date))) {
        error = `Invalid date ${profileObj.date}`;
        result.error = error;
        return result;
    }
    
    if (profileObj.macroSplit != null) {
        const valMSplitRes = FMTValidateMacroSplit(profileObj.macroSplit);
        if (valMSplitRes.macroSplit == null || valMSplitRes.error != null) {
            result.error = valMSplitRes.error;
            return result;
        }
        profile.macroSplit = valMSplitRes.macroSplit;
    }
    else {
        profile.macroSplit = {};
    }
    
    result.profile = profile;
    result.error = null;
    return result;
}
function FMTValidateMealEntry(mealEntryObj) {
    const result = {};
    const mealEntry = {};
    let error = null;
    if (!isNumber(mealEntryObj.profile_id) || !Number.isInteger(Number(mealEntryObj.profile_id))) {
        error = `Profile id must be an integer, got (${mealEntryObj.profile_id})`;
        result.error = error;
        return result;
    }
    mealEntry.profile_id = Number(mealEntryObj.profile_id);
    
    if (!isDate(new Date(mealEntryObj.year, mealEntryObj.month, mealEntryObj.day))) {
        error = `Year Month and Day must be valid integers, got (${mealEntryObj.year}, ${mealEntryObj.month}, ${mealEntryObj.day})`;
        result.error = error;
        return result;
    }
    mealEntry.year = Number(mealEntryObj.year);
    mealEntry.month = Number(mealEntryObj.month);
    mealEntry.day = Number(mealEntryObj.day);
    if (mealEntryObj.mealName == null || mealEntryObj.mealName === "") {
        error = `Meal Name must not be null or empty string (got ${mealEntryObj.mealName})`;
        result.error = error;
        return result;
    }
    mealEntry.mealName = mealEntryObj.mealName;
    
    if (!!mealEntryObj.created && !isDate(new Date(mealEntryObj.created) ) ) {
        error = `'Created' value must be valid Date (got ${mealEntryObj.created})`;
        result.error = error;
        return result;
    }
    else { mealEntry.created = mealEntryObj.created; }
    
    
    if (!!mealEntryObj.lastModified && !isDate(new Date(mealEntryObj.lastModified) ) ) {
        error = `'lastModified ' value must be valid Date (got ${mealEntryObj.lastModified})`;
        result.error = error;
        return result;
    }
    else { mealEntry.lastModified  = mealEntryObj.lastModified; }
    
    if (mealEntryObj.tzMinutes !== undefined && !Number.isInteger(mealEntryObj.tzMinutes)) {
        error = `Invalid timezone ${mealEntryObj.tzMinutes}`;
        result.error = error;
        return result;
    }
    else { mealEntry.tzMinutes = mealEntryObj.tzMinutes; }
    
    if (!isNumber(mealEntryObj.consumable_id) || !Number.isInteger(Number(mealEntryObj.consumable_id ))) {
        error = `Consumable id must be an integer, got (${mealEntryObj.consumable_id})`;
        result.error = error;
        return result;
    }
    mealEntry.consumable_id = Number(mealEntryObj.consumable_id);
    
    if (mealEntryObj.consumableName == null || mealEntryObj.consumableName  === "") {
        error = `Consumable Name  must not be null or empty string (got ${mealEntryObj.consumableName})`;
        result.error = error;
        return result;
    }
    mealEntry.consumableName = mealEntryObj.consumableName;
    
    mealEntry.foodBrand = mealEntryObj.foodBrand;
    mealEntry.is_recipe = Boolean(mealEntryObj.is_recipe);
    
    if (!isNumber(mealEntryObj.weight) || Number(mealEntryObj.weight) <= 0) {
        error = `Weight is not a positive number (got ${mealEntryObj.weight})`;
        result.error = error;
        return result;
    }
    mealEntry.weight = mealEntryObj.weight;
    
    if (mealEntryObj.weightUnits == null || mealEntryObj.weightUnits === "") {
        error = `Weight Units must not be null`;
        result.error = error;
        return result;
    }
    mealEntry.weightUnits = mealEntryObj.weightUnits;
    
    if (mealEntryObj.nutritionalValue == null) {
        error = `Nutritional Value must not be empty`;
        result.error = error;
        return result;
    }
    const nutriValueValidateRes = FMTValidateNutritionalValue(mealEntryObj.nutritionalValue);
    if (nutriValueValidateRes.nutritionalValue == null || nutriValueValidateRes.error != null) {
        result.error = nutriValueValidateRes.error;
        return result;
    }
    mealEntry.nutritionalValue = nutriValueValidateRes.nutritionalValue;
    if ("entry_id" in mealEntryObj) {
        mealEntry.entry_id = mealEntryObj.entry_id;
    }
    
    result.mealEntry = mealEntry;
    return result;
}
function FMTValidateMealIdentifier(mealIdentifierObj) {
    const result = {};
    const mealIdentifier = {};
    let error = null;
    if (!isNumber(mealIdentifierObj.meal_year) || !Number.isInteger(Number(mealIdentifierObj.meal_year)) ) {
        error = `Meal Year must be a valid integer. Got (${mealIdentifierObj.meal_year})`;
        result.error = error;
        return result;
    }
    mealIdentifier.meal_year = Number(mealIdentifierObj.meal_year);

    if (!isNumber(mealIdentifierObj.meal_month) || !Number.isInteger(Number(mealIdentifierObj.meal_month)) ) {
        error = `Meal Month must be a valid integer. Got (${mealIdentifierObj.meal_month})`;
        result.error = error;
        return result;
    }
    mealIdentifier.meal_month = Number(mealIdentifierObj.meal_month);

    if (!isNumber(mealIdentifierObj.meal_day) || !Number.isInteger(Number(mealIdentifierObj.meal_day)) ) {
        error = `Meal Day must be a valid integer. Got (${mealIdentifierObj.meal_day})`;
        result.error = error;
        return result;
    }
    mealIdentifier.meal_day = Number(mealIdentifierObj.meal_day);

    if (!isNumber(mealIdentifierObj.profile_id) || !Number.isInteger(Number(mealIdentifierObj.profile_id)) ) {
        error = `Profile ID must be a valid integer. Got (${mealIdentifierObj.profile_id})`;
        result.error = error;
        return result;
    }
    mealIdentifier.profile_id = Number(mealIdentifierObj.profile_id);

    if (!!mealIdentifierObj.meal_name) {
        mealIdentifier.meal_name = mealIdentifierObj.meal_name;
    }
    else {
        mealIdentifier.meal_name = null;
    }

    result.mealIdentifier = mealIdentifier;
    return result;
}

//Functions - DB - Meal Entries
function FMTAddMealEntry(mealEntryObj, onsuccessFn, onerrorFn) {
    const res = FMTValidateMealEntry(mealEntryObj);
    if (res.error != null || res.mealEntry == null) {
        onerrorFn = onerrorFn || function() { console.error(res.error); };
        return onerrorFn();
    }
    let mealEntry = res.mealEntry;
    const date = new Date();
    mealEntry.created = date.toISOString();
    mealEntry.lastModified = date.toISOString();
    mealEntry.tzMinutes = date.getTimezoneOffset();
    let mealEntriesStore = getObjectStore(fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let addRequest = mealEntriesStore.add(mealEntry);
    addRequest.onerror = onerrorFn;
    addRequest.onsuccess = onsuccessFn;
}
function FMTUpdateMealEntry(entry_id, mealEntryObj, onsuccessFn, onerrorFn) {
    mealEntryObj.entry_id = entry_id;
    const res = FMTValidateMealEntry(mealEntryObj);
    if (res.error != null || res.mealEntry == null) {
        onerrorFn = onerrorFn || function() { console.error(res.error); };
        return onerrorFn();
    }
    let mealEntry = res.mealEntry;
    const date = new Date();
    mealEntry.lastModified = date.toISOString();
    mealEntry.tzMinutes = date.getTimezoneOffset();
    let mealEntriesStore = getObjectStore(fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let updateRequest = mealEntriesStore.put(mealEntry);
    updateRequest.onerror = onerrorFn;
    updateRequest.onsuccess = onsuccessFn;
}
function FMTRemoveMealEntry(entry_id, onsuccessFn, onerrorFn) {
    let mealEntriesStore = getObjectStore(fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let deleteRequest = mealEntriesStore.delete(entry_id);
    deleteRequest.onerror = onerrorFn;
    deleteRequest.onsuccess = onsuccessFn;
}
/*options{"queryType": "only"|"bound"|"lowerBound"|"upperBound",
"lowerOpen":false|true, "upperOpen":false|true, "yYear":int, "yMonth":int, "yDay":int,
"yProfileId": int", "direction": "next"|"nextunique"|"prev"|"prevunique"}*/
function FMTQueryMealEntriesByProfileAndDate(profile_id, year, month, day, onsuccessFn, onerrorFn, options) {
    if (!options) {
        options = {"queryType": "only"};
    }
    options.lowerOpen  = (options.lowerOpen == undefined                                 ? false      : options.lowerOpen);
    options.upperOpen  = (options.upperOpen == undefined                                 ? false      : options.upperOpen);
    options.yYear      = (options.yYear == undefined                                     ? year       : options.yYear);
    options.yMonth     = (options.yMonth == undefined                                    ? month      : options.yMonth);
    options.yDay       = (options.yDay == undefined                                      ? day        : options.yDay);
    options.yProfileId = (options.yProfileId == undefined                                ? profile_id : options.yProfileId);
    options.direction  = (fmtAppGlobals.FMT_DB_CURSOR_DIRS.indexOf(options.direction)< 0 ? "next"     : options.direction);
    
    //TODO validate year month day
    let keyRange = null;
    switch(options.queryType) {
        //Doesn't make a lot of sense to use either upperBound or lowerBound because we will then
        //retreive meal entries that belong to other users (via differing profile_ids)
        // It is included for completeness
        case "upperBound":
            keyRange = IDBKeyRange.upperBound([profile_id, year, month, day], options.upperOpen);
            break;
        case "lowerBound":
            keyRange = IDBKeyRange.lowerBound([profile_id, year, month, day], options.lowerOpen);
            break;
        case "bound":
            keyRange = IDBKeyRange.lowerBound([profile_id, year, month, day],
                                              [options.yProfileId, options.yYear, options.yMonth, options.yDay],
                                              options.lowerOpen,
                                              options.upperOpen);
            break;
        case "only":
            keyRange = IDBKeyRange.only([profile_id, year, month, day]);
            break;
        default:
            break;
    }
    onsuccessFn = onsuccessFn || function(e) { console.debug("[FMTQueryMealEntriesByProfileAndDate] onsuccess - ", keyRange, options) };
    onerrorFn = onerrorFn || function(e) { console.debug("[FMTQueryMealEntriesByProfileAndDate] onerror - ", keyRange, options) };
    const pid_date_index = getIndex(fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE, "profile_id_date_index");
    const cursorRequest = pid_date_index.openCursor(keyRange, options.direction);
    cursorRequest.onerror = onerrorFn;
    cursorRequest.onsuccess = onsuccessFn;
}
function FMTReadMealEntry(entry_id, onsuccessFn, onerrorFn) {
    onsuccessFn = onsuccessFn || function(e) { console.debug("[FMTReadMealEntry] onsuccess - ", entry_id, e) };
    onerrorFn = onerrorFn || function(e) { console.debug("[FMTReadMealEntry] onerror - ", entry_id, e) };
    const mealEntriesStore = getObjectStore(fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE, fmtAppGlobals.FMT_DB_READONLY);
    const getRequest = mealEntriesStore.get(entry_id);
    getRequest.onerror = onerrorFn;
    getRequest.onsuccess = onsuccessFn;
}

//Functions - DB - Profile
function FMTReadProfile(profileId, onsuccessFn, onerrorFn) {
    if (isNaN(profileId)) {
        const msg = `Invalid profile_id ${profileId}`;
        onerrorFn = onerrorFn || function(e) { console.error(msg); };
        return onerrorFn(msg);
    }
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILES_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let getRequest = profileStore.get(profileId);
    getRequest.onerror = onerrorFn || function (e) { console.error(`Failed getting Profile id ${profileId}`); };
    getRequest.onsuccess = onsuccessFn;
}
function FMTReadAllProfiles(onsuccessFn, onerrorFn) {
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILES_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let getRequest = profileStore.getAll();
    getRequest.onerror = onerrorFn;
    getRequest.onsuccess = onsuccessFn;
}
function FMTAddProfile(profileObj, onsuccessFn, onerrorFn) {
    let result = FMTValidateProfile(profileObj);
    if (result.profile == null || result.error != null) {
        onerrorFn = onerrorFn || function() { console.error(result.error) };
        return onerrorFn(result.error);
    }
    const profile = result.profile;
    let date = new Date();
    profile.lastModified = date.toISOString();
    profile.tzMinutes = date.getTimezoneOffset();
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let addRequest = profileStore.add(profile);
    addRequest.onerror = onerrorFn || function() {console.error(`Failed adding Profile ${JSON.stringify(profile)}`)};
    addRequest.onsuccess = onsuccessFn || function() {console.debug(`Success adding Profile ${JSON.stringify(profile)}`)};
}
function FMTUpdateProfile(profileId, profileObj, onsuccessFn, onerrorFn) {
    profileObj.profile_id = profileId;
    let result = FMTValidateProfile(profileObj);
    if (result.profile == null || result.error != null) {
        onerrorFn = onerrorFn || function(e) { console.error(result.error) };
        return onerrorFn(result.error);
    }
    const profile = result.profile;
    let date = new Date();
    profile.lastModified = date.toISOString();
    profile.tzMinutes = date.getTimezoneOffset();
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let updateRequest = profileStore.put(profile);
    updateRequest.onerror = onerrorFn || function() { console.error(`Failed updating Profile id ${profileId}`) };
    updateRequest.onsuccess = onsuccessFn || function() { console.debug(`Success updating Profile id ${profileId}`) };
}
function FMTDeleteProfile(profileId, onsuccessFn, onerrorFn) {
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let delRequest = profileStore.delete(profileId);
    delRequest.onerror = onerrorFn || function() { console.error(`Failed deleting  Profile id ${profileId}`) };
    delRequest.onsuccess = onsuccessFn || function() { console.debug(`Success deleting Profile id ${profileId}`) };
}

//Functions - DB - Foods
function FMTReadFood(foodId, onsuccessFn, onerrorFn) {
    let foodStore = getObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let getRequest = foodStore.get(foodId);
    getRequest.onerror = onerrorFn;
    getRequest.onsuccess = onsuccessFn;
}
function FMTReadAllFoods( onsuccessFn, onerrorFn) {
    let foodStore = getObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let getRequest = foodStore.getAll();
    getRequest.onerror = onerrorFn;
    getRequest.onsuccess = onsuccessFn;
}
/*onsuccessFn must implement success function accessing the cursor*/
function FMTIterateFoods( onsuccessFn, onerrorFn) {
    onerrorFn = onerrorFn || function(e) { console.error(`[FMTIterateFoods] - ${e}`);}
    let foodStore = getObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let getRequest = foodStore.openCursor();
    getRequest.onerror = onerrorFn;
    getRequest.onsuccess = onsuccessFn;
}
function FMTAddFood(foodObj, mUnitsChart, onsuccessFn, onerrorFn) {
    mUnitsChart = mUnitsChart || fmtAppInstance.massUnitChart;
    const result = FMTValidateFoodObject(foodObj, mUnitsChart);
    const food = result.food;
    if (food != null && result.error == null) {
        let date = new Date();
        food.lastModified = date.toISOString();
        food.tzMinutes = date.getTimezoneOffset();
        food.created = food.lastModified;
        let foodStore = getObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE, fmtAppGlobals.FMT_DB_READWRITE);
        let addRequest = foodStore.add(food);
        addRequest.onerror = onerrorFn || function(e) {console.debug(`[FMTAddFood] - failed adding food object - ${JSON.stringify(food)}`);};
        addRequest.onsuccess = function(e) {onsuccessFn(e, food);} || function(e) {console.debug(`[FMTAddFood] - food object added successfully ${JSON.stringify(food)}`)};
    }
    else {
        onerrorFn = onerrorFn || function() {console.debug(`[FMTAddFood] - food object validation failed - ${JSON.stringify(foodObj)}`);}
        onerrorFn(result.error);
    }
}
function FMTUpdateFood(foodId, foodObj, mUnitsChart, onsuccessFn, onerrorFn) {
    mUnitsChart = mUnitsChart || fmtAppInstance.massUnitChart;
    const result = FMTValidateFoodObject(foodObj, mUnitsChart);
    const food = result.food;
    if (food != null  && result.error == null) {
        let date = new Date();
        food.lastModified = date.toISOString();
        food.tzMinutes = date.getTimezoneOffset();
        food.food_id = foodId;
        let foodStore = getObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE, fmtAppGlobals.FMT_DB_READWRITE);
        let addRequest = foodStore.put(food);
        addRequest.onerror = onerrorFn || function(e) {console.debug(`[FMTUpdateFood] - failed updating food object - ${JSON.stringify(food)}`);};
        addRequest.onsuccess = onsuccessFn || function(e) {console.debug(`[FMTUpdateFood] - food object updated successfully ${JSON.stringify(food)}`)};
    }
    else {
        onerrorFn = onerrorFn || function() {console.debug(`[FMTUpdateFood] - food object validation failed - ${JSON.stringify(foodObj)}`);}
        onerrorFn(result.error);
    }
}
function FMTDeleteFood(foodId, onsuccessFn, onerrorFn) {
    let foodStore = getObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let delRequest = foodStore.delete(foodId);
    delRequest.onerror = onerrorFn || function(e) {console.debug(`[FMTDeleteFood] - failed deleting food object ${JSON.stringify(e.target.result)}`)};
    delRequest.onsuccess = onsuccessFn || function(e) {console.debug(`[FMTDeleteFood] - food object deleted successfully ${JSON.stringify(e.target.result)}`)};
}

//Functions - DB - Recipes

//Functions - DB - Nutrients
function FMTAddNutrient(nutrientObj, onsuccessFn, onerrorFn) {
    let nutrient = FMTValidateNutrientObject(nutrientObj);
    if (nutrient == null) {
        onerrorFn = onerrorFn || console.error(`Failed validating nutrient object ${nutrientObj}`);
        return onerrorFn();
    }
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRIENTS_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let addRequest = nutrientStore.add(nutrient);
    addRequest.onsuccess = onsuccessFn || function(e) { console.debug(`[FMTAddNutrient.onsuccess] - ${JSON.stringify(e)}`) };
    addRequest.onerror = onerrorFn || function(e) { console.debug(`[FMTAddNutrient.onerror] - ${JSON.stringify(e)}`) };
}
function FMTUpdateNutrient(nutrientObj, onsuccessFn, onerrorFn) {
    let nutrient = FMTValidateNutrientObject(nutrientObj);
    if (nutrient == null) {
        onerrorFn = onerrorFn || console.error(`Failed validating nutrient object ${nutrientObj}`);
        return onerrorFn();
    }
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRIENTS_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let addRequest = nutrientStore.put(nutrient);
    addRequest.onsuccess = onsuccessFn || function(e) { console.debug(`[FMTUpdateNutrient.onsuccess] - ${JSON.stringify(e)}`) };
    addRequest.onerror = onerrorFn || function(e) { console.debug(`[FMTUpdateNutrient.onerror] - ${JSON.stringify(e)}`) };
}
function FMTReadNutrient(nutrientCat, nutrientName, onsuccessFn, onerrorFn) {
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRIENTS_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = nutrientStore.get([nutrientCat, nutrientName]);
    readRequest.onsuccess = onsuccessFn || function(e) { console.debug(`[FMTReadNutrient.onsuccess] - ${JSON.stringify(e)}`) };
    readRequest.onerror = onerrorFn || function(e) { console.debug(`[FMTReadNutrient.onerror] - ${JSON.stringify(e)}`) };
}
function FMTReadAllNutrients(onsuccessFn, onerrorFn) {
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRIENTS_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = nutrientStore.getAll();
    readRequest.onsuccess = onsuccessFn || function(e) { console.debug(`[FMTReadAllNutrients.onsuccess] - ${JSON.stringify(e)}`) };
    readRequest.onerror = onerrorFn || function(e) { console.debug(`[FMTReadAllNutrients.onerror] - ${JSON.stringify(e)}`) };
}
/*onsuccessFn must implement success function accessing the cursor*/
function FMTIterateNutrients(onsuccessFn, onerrorFn) {
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRIENTS_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = nutrientStore.openCursor();
    readRequest.onsuccess = onsuccessFn || function(e) { console.debug(`[FMTIterateNutrients.onsuccess] - ${JSON.stringify(e)}`) };
    readRequest.onerror = onerrorFn || function(e) { console.debug(`[FMTIterateNutrients.onerror] - ${JSON.stringify(e)}`) };
}
function FMTDeleteNutrient(nutrientCat, nutrientName, onsuccessFn, onerrorFn) {
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRIENTS_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let deleteRequest = nutrientStore.delete([nutrientCat, nutrientName]);
    deleteRequest.onsuccess = onsuccessFn || function(e) { console.debug(`[FMTDeleteNutrient.onsuccess] - ${JSON.stringify(e)}`) };
    deleteRequest.onerror = onerrorFn || function(e) { console.debug(`[FMTDeleteNutrient.onerror] - ${JSON.stringify(e)}`) };
}

//Functions - DB - Mass Units
function FMTAddMassUnit(massUnitObj, onsuccessFn, onerrorFn) {
    let massUnit = FMTValidateMassUnitObject(massUnitObj);
    if (massUnit == null) {
        onerrorFn = onerrorFn || console.error(`Failed validating mass unit object ${massUnitObj}`);
        onerrorFn();
        return;
    }
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MASS_UNITS_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let addRequest = munitStore.add(massUnit);
    addRequest.onsuccess = onsuccessFn || console.debug(`Successfully added mass unit object ${massUnit}`);
    addRequest.onerror = onerrorFn || console.debug(`Error adding mass unit object ${massUnit}`);
}
function FMTUpdateMassUnit(massUnitObj, onsuccessFn, onerrorFn) {
    let massUnit = FMTValidateMassUnitObject(massUnitObj);
    if (massUnit == null) {
        onerrorFn = onerrorFn || console.error(`Failed validating mass unit object ${massUnitObj}`);
        onerrorFn();
        return;
    }
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MASS_UNITS_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let addRequest = munitStore.put(massUnit);
    addRequest.onsuccess = onsuccessFn || console.debug(`Successfully added mass unit object ${massUnit}`);
    addRequest.onerror = onerrorFn || console.debug(`Error adding mass unit object ${massUnit}`);
}
function FMTReadMassUnit(massUnitName, onsuccessFn, onerrorFn) {
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MASS_UNITS_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = munitStore.get(massUnitName);
    readRequest.onsuccess = onsuccessFn || console.debug(`Successfully read mass unit ${massUnitName}`);
    readRequest.onerror = onerrorFn || console.debug(`Failed reading mass unit ${massUnitName}`);
}
function FMTReadAllMassUnits(onsuccessFn, onerrorFn) {
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MASS_UNITS_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = munitStore.getAll();
    readRequest.onsuccess = onsuccessFn || console.debug(`Successfully read all mass units`);
    readRequest.onerror = onerrorFn || console.debug(`Failed reading all mass units`);
}
/*onsuccessFn must implement success function accessing the cursor*/
function FMTIterateMassUnits(onsuccessFn, onerrorFn) {
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MASS_UNITS_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = munitStore.openCursor();
    readRequest.onsuccess = onsuccessFn || console.debug(`Successfully iterate mass unit`);
    readRequest.onerror = onerrorFn || console.debug(`Failed mass units iteration`);
}
function FMTDeleteMassUnit(massUnitName, onsuccessFn, onerrorFn) {
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MASS_UNITS_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let deleteRequest = munitStore.delete(massUnitName);
    deleteRequest.onsuccess = onsuccessFn || console.debug(`Successfully delete mass unit ${massUnitName}`);
    deleteRequest.onerror = onerrorFn || console.debug(`Failed deleting mass unit ${massUnitName}`);
}

//Functions - Nutritional
function mifflinStJeorMen(weightKg, heightCm, ageYears) {
    let bmr = 10*weightKg + 6.25*heightCm - 5*ageYears + 5;
    return bmr;
}
function mifflinStJeorWomen(weightKg, heightCm, ageYears) {
    let bmr = 10*weightKg + 6.25*heightCm - 5*ageYears - 161;
    return bmr;
}
function mifflinStJeor(weightKg, heightCm, ageYears, sex) {
    switch(sex) {
        case "Male":
            return mifflinStJeorMen(weightKg, heightCm, ageYears);
        case "Female":
            return mifflinStJeorWomen(weightKg, heightCm, ageYears);
        default:
            return -1;
    }
}
function katchMcArdle(weightKg, bodyfatReal) {
    if (bodyfatReal > 0 && bodyfatReal < 1) {
        let bmr = 370 + 21.6*(1-bodyfatReal)*weightKg;
        return bmr;        
    }
    else {return -1;}
}

//Functions - UI - Generic
function FMTShowAlert(divId, alertLevel, msg, scrollOptions) {
    let alertDiv = document.getElementById(divId);
    let alertElem = `<div class="alert alert-${alertLevel} col-11 col-lg-8 mb-1 alert-dismissible fade show" role="alert">${msg}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
    alertDiv.innerHTML = alertElem;
    if (scrollOptions) {
        window.scroll(scrollOptions);    
    }
    return;   
}
function FMTDropdownToggleValue(targetDiv, text, attributes) {
    let elem = document.getElementById(targetDiv);
    if (!!elem) {
        elem.innerHTML = text;
        let attributeNames = Object.keys(attributes);
        for (let j=0; j<attributeNames.length; j++) {
            let attrName = attributeNames[j];
            let attrValue = attributes[attrName];
            elem.setAttribute(attrName, attrValue);
        }
        elem.dispatchEvent(new Event("massUnitChanged"));
    }
}
/*oncompleteFn - User defined functions that takes a boolean based on if user
* clicked "Yes" or "No"
*/
function FMTShowPrompt(divId, alertLevel, msg, scrollOptions, oncompleteFn) {
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
        $(`#__${divId}__yes`).click(function() {oncompleteFn(true);});
        $(`#__${divId}__no`).click(function() {oncompleteFn(false);});
    }
    return;
}

//Functions - UI - Profile
function FMTUpdateProfileForm(profileId, onsuccessFn, onerrorFn) {
    if (isNaN(profileId)) {
        throw TypeError(`Invalid profile_id ${profileId}`);
    }
    let profile = {}
    profile.profile_id = profileId;
    profile.name = document.getElementById('profile-name').value || null;
    profile.bodyWeight = document.getElementById('profile-weight').value;
    profile.bodyWeightUnits = document.getElementById('profile-weight-units').getAttribute('units');
    profile.height = document.getElementById('profile-height').value;
    profile.heightUnits = document.getElementById('profile-height-units').getAttribute('units');
    profile.age = document.getElementById('profile-age').value;
    profile.sex = document.getElementById('profile-sex').getAttribute('sex');
    profile.bodyfat = document.getElementById('profile-bodyfat').value || null;
    profile.activityLevel = document.getElementById('profile-active-level').getAttribute("level");
    profile.activityMultiplier = document.getElementById('profile-activity-mult').getAttribute("value");
    profile.formula = "Mifflin-St Jeor";
    
    FMTReadProfile(profileId,
                function(e) {
                    let res = e.target.result || {};
                    let macroSplit = res.macroSplit || null;
                    profile.macroSplit = macroSplit;
                    console.debug(res);
                    console.debug(profile);
                    FMTUpdateProfile(profileId, profile, onsuccessFn, onerrorFn);
                },
                onerrorFn
               );
    
}
function FMTUpdateMacroesForm(profileId, onsuccessFn, onerrorFn) {
    if (isNaN(profileId)) {
        const msg = `Invalid profile_id ${profileId}`;
        onerrorFn = onerrorFn || function(e) { console.error(msg); }
        return onerrorFn(msg);
    }
    let macroSplit = {};
    macroSplit.Calories = document.getElementById("profile-daily-calories").value;
    macroSplit.Protein = document.getElementById("profile-macro-protein").value;
    macroSplit.Carbohydrate = document.getElementById("profile-macro-carb").value;
    macroSplit.Fat = document.getElementById("profile-macro-fat").value;
    FMTReadProfile(profileId,
                function(e) {
                    let res = e.target.result;
                    console.debug(res);
                    if (res === undefined) {
                        let msg = `Profile with ID ${profileId} does not exist yet. Please create it first by filling in your Personal details and then click "Save Personal Details"`;
                        onerrorFn || function (e) { console.error(`${msg}`) };
                        return onerrorFn(msg);
                    }
                    res.macroSplit = macroSplit;
                    FMTUpdateProfile(profileId, res, onsuccessFn, onerrorFn);
                },
                onerrorFn
               );
}
function FMTDisplayProfile(profileId, onsuccessFn, onerrorFn) {
    FMTReadProfile(profileId,
                function(e) {
                    let profile = e.target.result;
                    console.debug(`Loaded Profile: ${JSON.stringify(profile)}`);
                    if (profile === undefined) {
                        return;
                    }
                    if (profile.name) {document.getElementById("profile-name").value = profile.name;}
                    document.getElementById("profile-weight").value = profile.bodyWeight;
                    document.getElementById("profile-weight-units").innerHTML = profile.bodyWeightUnits;
                    document.getElementById("profile-weight-units").setAttribute("units", profile.bodyWeightUnits);
                    document.getElementById("profile-height").value = profile.height;
                    document.getElementById("profile-height-units").innerHTML = profile.heightUnits;
                    document.getElementById("profile-height-units").setAttribute("units", profile.heightUnits);
                    document.getElementById("profile-age").value = profile.age;
                    document.getElementById("profile-sex").innerHTML = profile.sex;
                    document.getElementById("profile-sex").setAttribute("sex", profile.sex);
                    if (!isNaN(profile.bodyfat)) {document.getElementById("profile-bodyfat").value = profile.bodyfat;}
                    document.getElementById("profile-active-level").innerHTML = profile.activityLevel;
                    document.getElementById("profile-active-level").setAttribute("level", profile.activityLevel);
                    document.getElementById("profile-activity-mult").setAttribute("value", profile.activityMultiplier);
                    document.getElementById("profile-activity-mult").innerHTML = profile.activityMultiplier;
                    let bmr = Math.round(profile.bmr);
                    let tdee = Math.round(profile.tdee);
                    document.getElementById("profile-bmr").setAttribute("value", bmr);
                    document.getElementById("profile-bmr").innerHTML = `${bmr} Kcal/Day`;
                    document.getElementById("profile-tdee").setAttribute("value", tdee);
                    document.getElementById("profile-tdee").innerHTML = `${tdee} Kcal/day`;
                    document.getElementById("profile-formula").setAttribute("value", profile.formula);
                    document.getElementById("profile-formula").innerHTML = profile.formula;
                    let macroSplit = profile.macroSplit;
                    if (macroSplit !== null) {
                        document.getElementById("profile-daily-calories").value = macroSplit.Calories || "";
                        document.getElementById("profile-macro-protein").value = macroSplit.Protein || "";
                        document.getElementById("profile-macro-carb").value = macroSplit.Carbohydrate || "";
                        document.getElementById("profile-macro-fat").value = macroSplit.Fat || "";
                        const gramP = Math.round(macroSplit.Calories * macroSplit.Protein/100 / 4);
                        const gramC = Math.round(macroSplit.Calories * macroSplit.Carbohydrate/100 / 4);
                        const gramF = Math.round(macroSplit.Calories * macroSplit.Fat/100 / 9);
                        if (!isNaN(gramC) && !isNaN(gramF) && !isNaN(gramP)) {
                            document.getElementById("profile-macro-protein-grams").innerHTML = `${gramP} gram`;
                            document.getElementById("profile-macro-carb-grams").innerHTML = `${gramC} gram`;
                            document.getElementById("profile-macro-fat-grams").innerHTML = `${gramF} gram`;                            
                        }
                    }
                    if (onsuccessFn) {onsuccessFn();}
                },
                onerrorFn || function (e) {console.error(`Failed getting Profile id ${profileId}`);}
               );
}

//Functions - UI - Mass Units
function FMTCreateMassUnitDropdownMenu(baseName, targetDivId, mUnitsChart, isStatic, defaultUnitName, readonly) {
    let tDiv = document.getElementById(targetDivId);
    if (!!tDiv) {
        let inputGroupId = `${baseName}-fmtigroup`;
        let inputGroup = document.getElementById(inputGroupId);
        if (!!inputGroup) {
            inputGroup.parentElement.removeChild(inputGroup);
        }
        inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group-append", "fmt-mass-unit-igroup");
        inputGroup.setAttribute("id", inputGroupId);
        let selectedBtn = document.createElement("button");
        let selectedBtnId = `${baseName}-units`;
        selectedBtn.classList.add("btn", "btn-outline-dark", "fmt-mass-unit-btn");
        selectedBtn.setAttribute("type", "button");
        selectedBtn.setAttribute("id", selectedBtnId);
        inputGroup.appendChild(selectedBtn);

        if (!isStatic) {
            let ddBtn = document.createElement("div");
            ddBtn.classList.add("btn", "btn-outline-dark", "dropdown-toggle", "dropdown-toggle-split");
            ddBtn.setAttribute("type", "button");
            ddBtn.setAttribute("data-toggle", "dropdown");
            ddBtn.setAttribute("aria-haspopup", "true");
            ddBtn.setAttribute("aria-expanded", "false");
            let span = document.createElement("span");
            span.classList.add("sr-only");
            span.innerHTML = "Toggle Dropdown";
            ddBtn.appendChild(span);
            inputGroup.appendChild(ddBtn);

            if (!readonly) {
                //Then also include dropdown menu. readonly is for view screen
                let ddMenu = document.createElement("div");
                let ddMenuId = `${baseName}-units-dropdown`;
                ddMenu.classList.add("dropdown-menu");
                ddMenu.setAttribute("id", ddMenuId);

                let mUnits = Object.keys(mUnitsChart);
                for (let j=0; j<mUnits.length; j++) {
                    let massUnitName = mUnits[j];
                    let massUnit = mUnitsChart[massUnitName];
                    let normMassUnitName = massUnitName.replace(" ", "_");
                    let mUnitId = `${baseName}-unit-${normMassUnitName}`;
                    let ddItem = document.createElement("a");
                    ddItem.classList.add("dropdown-item");
                    ddItem.setAttribute("href", `#${ddMenuId}`);
                    ddItem.setAttribute("id", mUnitId);
                    ddItem.innerHTML = massUnit.description;
                    ddItem.addEventListener("click", function(e) {
                        FMTDropdownToggleValue(selectedBtnId, massUnitName, {"unit": massUnitName});
                    });
                    ddMenu.appendChild(ddItem);
                }
                inputGroup.appendChild(ddMenu);
            }
        }
        tDiv.appendChild(inputGroup);
        if (!!defaultUnitName && (defaultUnitName) in mUnitsChart) {
            FMTDropdownToggleValue(selectedBtnId, defaultUnitName, {"unit": defaultUnitName});
        }
    }
    else {
        console.warn(`[FMTCreateMassUnitDropdownMenu] - Requested dropdown menu creation with base name ${baseName} in inexisting target Div ID ${targetDivId}`);
    }
}

//Functions - UI - Foods
function FMTCreateNutrientCategoryHeading(category, targetDivID) {
    const headingElements = [];
    const spacer = document.createElement("div");
    spacer.classList.add("w-100");
    headingElements.push(spacer);
    const headingCont = document.createElement("div");
    headingCont.classList.add("input-group", "mb-1");//, "col-12", "col-lg-8", "mb-1");
    const h5 = document.createElement("h5");
    h5.innerHTML = category;
    headingCont.appendChild(h5);
    headingElements.push(headingCont);
    const targetDiv = document.getElementById(targetDivID);
    appendChildren(targetDiv, headingElements);
}
function FMTCreateAdditionalNutrientWithUnitsInput(baseID, targetDivID, nutriObj, category, isStatic, mUnitsChart, readonly) {
    const elements = [];
    const normalizedCategory = category.replace(" ", "_");
    const normalizedNutriName = nutriObj.name.replace(" ", "_");
    const nutriBaseId = `${baseID}-${normalizedCategory}-${normalizedNutriName}`;
    const nutriId = `${nutriBaseId}-input`;
    const targetDiv = document.getElementById(targetDivID);
    if (!!targetDiv) {
        const spacer = document.createElement("div");
        spacer.classList.add("w-100");
        elements.push(spacer);
        const inGroupCont = document.createElement("div");
        inGroupCont.classList.add("input-group", "mb-1");//, "col-12", "col-lg-8", "mb-1");
        const addNutriInGroup = document.createElement("div");
        addNutriInGroup.classList.add("input-group-prepend", "fmt-food-input-field");
        addNutriInGroup.setAttribute("id", nutriBaseId);
        const span = document.createElement("span");
        span.classList.add("input-group-text");
        span.innerHTML = `${nutriObj.name}${nutriObj.help != null ? ` (${nutriObj.help})` : ''}`;
        addNutriInGroup.appendChild(span);
        const inputField = document.createElement("input");
        inputField.classList.add("form-control", "fmt-add-nutri");
        inputField.setAttribute("id", nutriId);
        inputField.setAttribute("type", "text");
        inputField.setAttribute("placeholder", nutriObj.name);
        inputField.setAttribute("aria-label", nutriObj.name);
        inputField.setAttribute("aria-describedby", "basic-addon2");
        inputField.setAttribute("nutrient-name", nutriObj.name);
        addNutriInGroup.appendChild(inputField);
        inGroupCont.appendChild(addNutriInGroup);
        elements.push(inGroupCont);
        appendChildren(targetDiv, elements);
        FMTCreateMassUnitDropdownMenu(nutriBaseId, nutriBaseId, mUnitsChart, isStatic, nutriObj.default_mass_unit, readonly);
    }
}
function FMTDisplayFoodsTable(targetDivID, onsuccessFn, onerrorFn, eventListeners) {
    const targetDiv = document.getElementById(targetDivID);
    if (!targetDiv) {
        console.warn(`[FMTDisplayFoodsTable] - targetDiv (ID = ${targetDivID}) doesn't exist`);
        if (onerrorFn) { onerrorFn(); }
    }
    
    let foodTableBody = document.getElementById(`${targetDivID}-food-table-body`);
    foodTableBody.innerHTML = "";
    FMTIterateFoods(function(e) {
        let cursor = e.target.result;
        if (cursor) {
            let record = cursor.value;
            let foodRow = document.createElement("tr");
            foodRow.setAttribute("food_id", record.food_id);
            foodRow.classList.add("fmt-food-table-row");
            foodRow.innerHTML = `<th scope="row" class="fmt-food-id-cell ${fmtAppInstance.displaySettings.showFoodIdColumn? "" : "d-none"}">${record.food_id}</th><td class= "fmt-food-name-cell">${record.foodName}</td>${record.foodBrand != null ? `<td class="fmt-food-brand-cell">${record.foodBrand}</td>` : "<td class=\"fmt-food-brand-cell\"></td>"}`
            const events = Object.keys(eventListeners);
            for (let k=0; k<events.length; k++) {
                const eventName = events[k];
                foodRow.addEventListener(eventName, eventListeners[eventName]);
            }
            foodTableBody.appendChild(foodRow);
            cursor.continue();
        }
        else {
            onsuccessFn();
        }
    },
                onerrorFn );
}
function FMTQueryFoodsTable(query, baseID) {
    let tbody = document.getElementById(`${baseID}-food-table-body`);
    let tableRows = tbody.getElementsByClassName("fmt-food-table-row");
    if (query === "") {
        for (let i=0; i < tableRows.length; i++) {
            let row = tableRows[i];
            row.classList.remove("d-none");
        }
    }
    else {
        query = query.toLowerCase();
        for (let i=0; i < tableRows.length; i++) {
            let row = tableRows[i];
            let _fcell = row.getElementsByClassName("fmt-food-name-cell");
            let _bcell = row.getElementsByClassName("fmt-food-brand-cell");
            let foodName = "";
            let foodBrand = "";
            if (_fcell.length > 0) {foodName = _fcell[0].innerHTML.toLowerCase();}
            if (_bcell.length > 0) {foodBrand = _bcell[0].innerHTML.toLowerCase();}
            if (foodName.indexOf(query) > -1 || foodBrand.indexOf(query) > -1) {row.classList.remove("d-none");}
            else {row.classList.add("d-none");}
        }
    }
}
function FMTFoodItemScreenPopulateAdditionalNutrients(baseScreenID, readonly) {
    if (!fmtAppInstance.additionalNutrients) {return false;}
    
    const mUnitsChart = fmtAppInstance.massUnitChart;
    const additionalNutriDivId = `${baseScreenID}-food-additional`;
    const additionalNutriDiv = document.getElementById(additionalNutriDivId);
    const categories = Object.keys(fmtAppInstance.additionalNutrients);
    const isStatic = !fmtAppInstance.additionalNutrientsSettings.allowNonDefaultUnits;
    const baseID = `${baseScreenID}-food-addi`;
    for (let j=0; j<categories.length; j++) {
        let category = categories[j];
        let nutrientsInCategory = fmtAppInstance.additionalNutrients[category];
        FMTCreateNutrientCategoryHeading(category, additionalNutriDivId);
        for (let k=0; k<nutrientsInCategory.length; k++) {
            const nutri = nutrientsInCategory[k];
            const elements = FMTCreateAdditionalNutrientWithUnitsInput(baseID,
                                                                       additionalNutriDivId,
                                                                       nutri,
                                                                       category,
                                                                       isStatic,
                                                                       mUnitsChart,
                                                                       readonly);
        }
    }
    return true;
}
//TODO - optionsObj {foodId(int),readonly(bool),date(str YYYY-MM-DD),mealName(str),eventListenersObj}
//evenListenerObj{"DOM ID1": {"event": fn},...,"DOM IDN": {"event": fn}}
function FMTFoodItemScreenPopulate(baseScreenID, optionsObj) {
    optionsObj = optionsObj || {"readonly": false};
    const weightBaseName = `${baseScreenID}-food-weight`;
    const weightTargetDiv = weightBaseName;
    const mUnitsChart = fmtAppInstance.massUnitChart;
    const readonly = optionsObj.readonly || false;
    FMTCreateMassUnitDropdownMenu(weightBaseName, weightTargetDiv, mUnitsChart, false, "g", readonly);
    
    const saveOrAddBtn = document.getElementById(`${baseScreenID}-save`);
    if (isNumber(optionsObj.foodId)) {
        saveOrAddBtn.setAttribute("food_id", optionsObj.foodId);
    }
    const res = FMTFoodItemScreenPopulateAdditionalNutrients(baseScreenID, readonly);
    if (!res) { console.warn("Failed populating user defined values in add food screen"); }
    if (optionsObj.eventListenersObj) {
        for (const elemName in optionsObj.eventListenersObj) {
            const element = document.getElementById(elemName);
            if (element) {
                for (const eventName in optionsObj.eventListenersObj[elemName]) {
                    element.addEventListener(eventName, optionsObj.eventListenersObj[elemName][eventName]);
                }
            }
        }
    }
}
function FMTFoodItemScreenPopulateSavedValues(baseScreenID, foodId, multiplier,
                                              readonly, focusDivId, currentWeightValue,
                                               currentWeightUnits , onCompleteFn) {
    if (multiplier !== 0) {
        multiplier = multiplier || 1;
    }
    let onerrorFn = function(e) {
        const msg = `[FMTFoodItemScreenPopulateSavedValues] - Failed loading Food Id (${foodId})`;
        console.error(msg);
        FMTShowAlert(`${baseScreenID}-alerts`, "danger", msg, fmtAppGlobals.defaultAlertScroll);
    };
    let onsuccessFn = function (e) {
        //TODO Add option to not validate
        const result = FMTValidateFoodObject(e.target.result, fmtAppInstance.massUnitChart);
        if (result.error != null) {
            const msg = `[FMTFoodItemScreenPopulateSavedValues] - Food Id (${foodId}) loaded but failed validation`;
            console.error(msg);
            console.error(e.target.result);
            FMTShowAlert(`${baseScreenID}-alerts`, "warning", msg, fmtAppGlobals.defaultAlertScroll);
            return;
        }
        const food = result.food;
        document.getElementById(`${baseScreenID}-food-name`).value = food.foodName;
        document.getElementById(`${baseScreenID}-food-brand`).value = food.foodBrand;
        if (!isNumber(currentWeightValue) || !(currentWeightUnits in fmtAppInstance.massUnitChart)) {
            document.getElementById(`${baseScreenID}-food-weight-input`).value = food.referenceWeight;
            document.getElementById(`${baseScreenID}-food-weight-input`).setAttribute("reference_weight", food.referenceWeight);
            document.getElementById(`${baseScreenID}-food-weight-input`).setAttribute("reference_weight_units", food.weightUnits);
            document.getElementById(`${baseScreenID}-food-weight-unit-${food.weightUnits}`).dispatchEvent(new Event("click"));
        }//Else dont touch these fields
        document.getElementById(`${baseScreenID}-food-calories`).value = food.nutritionalValue.calories * multiplier;
        document.getElementById(`${baseScreenID}-food-proteins`).value = food.nutritionalValue.proteins * multiplier;
        document.getElementById(`${baseScreenID}-food-carbohydrates`).value = food.nutritionalValue.carbohydrates * multiplier;
        document.getElementById(`${baseScreenID}-food-fats`).value = food.nutritionalValue.fats * multiplier;
        
        if (readonly) {
            for (const j in fmtAppGlobals.foodItemScreenStaticViewInputFields) {
                document.getElementById(`${baseScreenID}-${fmtAppGlobals.foodItemScreenStaticViewInputFields[j]}`).setAttribute("readonly", true);
            }
        }

        if (!!food.nutritionalValue.additionalNutrients) {
            for (const nutriCatName in food.nutritionalValue.additionalNutrients) {
                const nutrientsList = food.nutritionalValue.additionalNutrients[nutriCatName];
                for (const i in nutrientsList) {
                    const nutrient = nutrientsList[i];
                    if (nutrient.mass == 0) { continue; }
                    const baseElementId = `${baseScreenID}-food-addi-${nutriCatName.replace(" ", "_")}-${nutrient.name.replace(" ", "_")}`;
                    const inputElementId = `${baseElementId}-input`;
                    const mUnitDropdownItemId = `${baseElementId}-unit-${nutrient.unit}`;
                    const inputElement = document.getElementById(inputElementId);
                    const mUnitDropdownItem = document.getElementById(mUnitDropdownItemId);
                    if (inputElement && mUnitDropdownItem) {
                        inputElement.value = nutrient.mass * multiplier;
                        mUnitDropdownItem.dispatchEvent(new Event("click"));
                    }
                    else {
                        //TODO - Lazy Load inexisting nutrients/categories based on APP settings
                        console.warn(`[FMTFoodItemScreenPopulateSavedValues] - Food Id (${foodId}), could not find DOM elements "${inputElementId}", "${mUnitDropdownItemId}"`);
                    }
                }
            }
            if (readonly) {
                const addiNutriDiv = document.getElementById(`${baseScreenID}-food-additional`);
                const addiNutrients = addiNutriDiv.getElementsByClassName("fmt-add-nutri");
                for (let k=0; k<addiNutrients.length; k++) {
                    addiNutrients[k].setAttribute("readonly", true);
                }
                const ddToggles = addiNutriDiv.getElementsByClassName("dropdown-toggle");
                for (let k=0; k<ddToggles.length; k++) {
                    ddToggles[k].classList.add("d-none");
                }
            }
        }
        if (focusDivId) {
            const fDiv = document.getElementById(focusDivId)
            if (fDiv) { fDiv.focus(); }
        }
        if (onCompleteFn) { onCompleteFn(); }
    };
    FMTReadFood(foodId, onsuccessFn, onerrorFn);
}
function FMTFoodItemScreenShowMore(baseScreenID) {
    $(`#${baseScreenID}-more`).hide();
    $(`#${baseScreenID}-less`).removeClass("d-none");
    $(`#${baseScreenID}-less`).show();
    $(`#${baseScreenID}-food-additional`).removeClass("d-none");
    $(`#${baseScreenID}-food-additional`).show();
}
function FMTFoodItemScreenShowLess(baseScreenID) {
    $(`#${baseScreenID}-less`).hide();
    if (!$(`#${baseScreenID}-less`).hasClass("d-none")) {
        $(`#${baseScreenID}-less`).addClass("d-none");
    }
    $(`#${baseScreenID}-more`).show();
    $(`#${baseScreenID}-food-additional`).hide();
        if (!$(`#${baseScreenID}-food-additional`).hasClass("d-none")) {
        $(`#${baseScreenID}-food-additional`).addClass("d-none");
    }
}
function FMTFoodItemScreenClear(baseScreenID) {
    document.getElementById(`${baseScreenID}-alerts`).innerHTML = "";
    document.getElementById(`${baseScreenID}-food-name`).value = "";
    document.getElementById(`${baseScreenID}-food-brand`).value = "";
    document.getElementById(`${baseScreenID}-food-calories`).value = "";
    document.getElementById(`${baseScreenID}-food-proteins`).value = "";
    document.getElementById(`${baseScreenID}-food-carbohydrates`).value = "";
    document.getElementById(`${baseScreenID}-food-fats`).value = "";
    document.getElementById(`${baseScreenID}-food-weight-input`).value = "";
    document.getElementById(`${baseScreenID}-food-additional`).innerHTML = "";
    const saveBtn = document.getElementById(`${baseScreenID}-save`);
    saveBtn.removeAttribute("food_id");
    saveBtn.removeAttribute("meal_name");
    saveBtn.removeAttribute("meal_year");
    saveBtn.removeAttribute("meal_month");
    saveBtn.removeAttribute("meal_day");
    saveBtn.removeAttribute("profile_id");
    FMTFoodItemScreenShowLess(baseScreenID);
}
function FMTFoodItemScreenSave(baseScreenID, action, optionsObj, onsuccessFn, onerrorFn) {
    onerrorFn = onerrorFn || function(err) { console.error(`[FMTFoodItemScreenSave] - Failed ${err}`); }
    if (baseScreenID == null) { console.error(`[FMTFoodItemScreenSave] - Invalid baseScreenID "${baseScreenID}"`); return onerrorFn(); }
    if (!(action == "add" || action == "edit" || action == "get-object")) { console.error(`[FMTFoodItemScreenSave] - Invalid action "${action}"`); return onerrorFn(); }
    if (action == "edit" && (!optionsObj || !isNumber(optionsObj.foodId)) ) { console.error("[FMTFoodItemScreenSave] - Missing foodId for edit action"); return onerrorFn(); }
    const mUnitsChart = fmtAppInstance.massUnitChart;
    let foodObj = {}
    foodObj.foodName = document.getElementById(`${baseScreenID}-food-name`).value;
    foodObj.foodBrand = document.getElementById(`${baseScreenID}-food-brand`).value;
    foodObj.referenceWeight = document.getElementById(`${baseScreenID}-food-weight-input`).value;
    foodObj.weightUnits = document.getElementById(`${baseScreenID}-food-weight-units`).getAttribute("unit");
    foodObj.nutritionalValue = {};
    foodObj.nutritionalValue.calories = document.getElementById(`${baseScreenID}-food-calories`).value;
    foodObj.nutritionalValue.proteins = document.getElementById(`${baseScreenID}-food-proteins`).value;
    foodObj.nutritionalValue.carbohydrates = document.getElementById(`${baseScreenID}-food-carbohydrates`).value;
    foodObj.nutritionalValue.fats = document.getElementById(`${baseScreenID}-food-fats`).value;
    foodObj.nutritionalValue.additionalNutrients = {};
    const baseID = `${baseScreenID}-food-addi`;
    for (const category in fmtAppInstance.additionalNutrients) {
        const baseCatID = `${baseID}-${category.replace(" ", "_")}`;
        const nutrientsInCat = fmtAppInstance.additionalNutrients[category];
        if (Array.isArray(nutrientsInCat) && nutrientsInCat.length > 0) {
            let addNutri = [];
            for (const i in nutrientsInCat) {
                const nutriObj = nutrientsInCat[i];
                const baseNutriId = `${baseCatID}-${nutriObj.name.replace(" ", "_")}`;
                const inputElemId = `${baseNutriId}-input`;
                const unitElemId = `${baseNutriId}-units`;
                const nutriUserInput = document.getElementById(inputElemId).value;
                if (nutriUserInput == null || nutriUserInput === "") { continue; }
                const nutriUserUnit = document.getElementById(unitElemId).getAttribute("unit");
                addNutri.push({"name": nutriObj.name, "mass": nutriUserInput, "unit": nutriUserUnit});
            }
            if (addNutri.length > 0) { foodObj.nutritionalValue.additionalNutrients[category] = addNutri; }
        }
    }
    switch(action) {
        case "add":
            onsuccessFn = onsuccessFn || function(e, food) {
                console.debug(`[FMTFoodItemScreenSave] - Successfully added food: ${JSON.stringify(food)}, id ${e.target.result}`);
                pageController.closeAddFoodDynamicScreen();
            };
            FMTAddFood(foodObj, mUnitsChart, onsuccessFn, onerrorFn);
            break;
        case "edit":
            onsuccessFn = onsuccessFn || function(e) {
                console.debug(`[FMTFoodItemScreenSave] - Successfully updated food: ${JSON.stringify(e.target.result)}`);
                pageController.closeEditFoodDynamicScreen();
            };
            FMTUpdateFood(optionsObj.foodId, foodObj, mUnitsChart, onsuccessFn, onerrorFn);
            break;
        case "get-object":
            return foodObj;
            break;
    }
}
function FMTUpdateViewFoodValuesOnWeightChange(e) {
    document.getElementById("view-food-screen-alerts").innerHTML = "";
    const weightInputBtn = document.getElementById("view-food-screen-food-weight-input");
    let weightValue = weightInputBtn.value;
    let weightUnits = document.getElementById("view-food-screen-food-weight-units").getAttribute("unit");
    let multiplier = 1;
    if (!(weightUnits in fmtAppInstance.massUnitChart) ) {
        const msg = `Invalid or unknown weight units "${weightUnits}"`;
        console.error(msg);
        FMTShowAlert("view-food-screen-alerts", "danger", msg, fmtAppGlobals.defaultAlertScroll);
        return;
    }
    if (weightValue === "") { weightValue = 0; }
    if (isNumber(weightValue)) {
        weightValue = Number(weightValue);
        let referenceWeight = weightInputBtn.getAttribute("reference_weight");
        let referenceWeightUnits = weightInputBtn.getAttribute("reference_weight_units");
        if (!(referenceWeightUnits in fmtAppInstance.massUnitChart) ) {
            const msg = `Invalid or unknown reference weight units "${referenceWeightUnits}"`;
            console.error(msg);
            FMTShowAlert("view-food-screen-alerts", "danger", msg, fmtAppGlobals.defaultAlertScroll);
            return;
        }
        if (isNumber(referenceWeight) && Number(referenceWeight) > 0) {
            referenceWeight = Number(referenceWeight);
            if (weightUnits === referenceWeightUnits) { multiplier = weightValue/referenceWeight; }
            else {
                // (currentUnit.value_in_grams/targetUnit.value_in_grams)
                const unitMultiplier = (fmtAppInstance.massUnitChart[weightUnits].value_in_grams) / (fmtAppInstance.massUnitChart[referenceWeightUnits].value_in_grams);
                const weightValueConverted = weightValue * unitMultiplier;
                multiplier = weightValueConverted/referenceWeight;
            }
        }
    }
    let foodId = document.getElementById("view-food-screen-save").getAttribute("food_id");
    if (!isNumber(foodId)) {
        console.error(`Food ID (${foodId}) is not valid on view food weight change`);
        FMTShowAlert("view-food-screen-alerts", "danger", "Error while calculating nutritional value. Please reload page", fmtAppGlobals.defaultAlertScroll);
    }
    else {
        pageController.openViewFoodDynamicScreen(foodId, multiplier, false, weightValue, weightUnits);
    }
}
//Functions - UI - Recipes
//Functions - UI - Overview
function FMTOverviewCreateMealNode(mealEntryObj, validate) {
    let mealEntry = mealEntryObj;
    if (validate) {
        let res = FMTValidateMealEntry(mealEntryObj);
        if (res.mealEntry == null || res.error != null ) {
            console.error(`Error validating Meal Entry Object (${mealEntryObj}) . Error - ${res.error}`);
            return;
        }
        mealEntry = res.mealEntry;
    }
    const normalizedMealName = mealEntry.mealName.replace(" ", "_").replace("-", "_");
    const mealDiv = document.createElement("div");
    mealDiv.setAttribute("id", `overview-meal-${normalizedMealName}`);
    mealDiv.classList.add("fmt-meal", "container");
    
    
    const mealHeaderDiv = document.createElement("div");
    const mealEntriesDiv = document.createElement("div");
    const mealFooterDiv = document.createElement("div");
    mealHeaderDiv.setAttribute("id", `overview-meal-${normalizedMealName}-header`);
    mealEntriesDiv.setAttribute("id", `overview-meal-${normalizedMealName}-entries`);
    mealFooterDiv.setAttribute("id", `overview-meal-${normalizedMealName}-footer`);
    
    mealHeaderDiv.classList.add("fmt-meal-header", "row", "justify-content-center");
    mealEntriesDiv.classList.add("fmt-meal-entries", "row", "justify-content-center");
    mealFooterDiv.classList.add("fmt-meal-footer", "row", "justify-content-between", "pb-1");
    
    //Meal Header
    const mNameSpan = document.createElement("span");
    mNameSpan.classList.add("fmt-font-2", "float-left");
    mNameSpan.innerHTML = mealEntry.mealName;
    const mNameDiv = document.createElement("div");
    mNameDiv.classList.add("col");
    mNameDiv.appendChild(mNameSpan);
    
    const kCalSpan = document.createElement("span");
    kCalSpan.setAttribute("id", `overview-meal-${normalizedMealName}-calories-progress`);
    kCalSpan.classList.add("fmt-font-2", "float-right");
    //First Set to 0 later update
    kCalSpan.innerHTML = "0";
    const kCalDiv = document.createElement("div");
    kCalDiv.classList.add("col");
    kCalDiv.appendChild(kCalSpan);

    const optsBtn = document.createElement("button");
    optsBtn.classList.add("fmt-font-1", "float-right", "ml-3", "btn", "btn-outline-dark");
    optsBtn.innerHTML = "&#9776";
    optsBtn.setAttribute("type", "button");
    optsBtn.setAttribute("meal_name", mealEntry.mealName);
    optsBtn.setAttribute("meal_year", mealEntry.year);
    optsBtn.setAttribute("meal_month", mealEntry.month);
    optsBtn.setAttribute("meal_day", mealEntry.day);
    const optsBtnDiv = document.createElement("div");
    optsBtnDiv.classList.add("col-2", "col-lg-1");
    optsBtnDiv.appendChild(optsBtn);
    
    mealHeaderDiv.appendChild(mNameSpan);
    mealHeaderDiv.appendChild(kCalDiv);
    mealHeaderDiv.appendChild(optsBtnDiv);
    
    //Meal Footer
    const mealFooterAddDiv = document.createElement("div");
    mealFooterAddDiv.classList.add("col-12", "fmt-meal-footer-add", "fmt-center-text", "d-flex");
    const mealFooterAddBtn = document.createElement("button");
    mealFooterAddBtn.classList.add("fmt-font-2", "btn", "btn-outline-dark", "flex-fill");
    mealFooterAddBtn.innerHTML = "+";
    mealFooterAddBtn.addEventListener("click", function() {
        mealIdentifierObj = {};
        mealIdentifierObj.meal_year = mealEntryObj.year;
        mealIdentifierObj.meal_month = mealEntryObj.month;
        mealIdentifierObj.meal_day = mealEntryObj.day;
        mealIdentifierObj.meal_name = mealEntryObj.mealName;
        mealIdentifierObj.profile_id = mealEntryObj.profile_id;
        pageController.openAddToMealDynamicScreen(mealIdentifierObj);
    });
    mealFooterAddDiv.appendChild(mealFooterAddBtn);


    const carbSpanMd = document.createElement("span");
    const carbSpanSm = document.createElement("span");
    carbSpanMd.classList.add("fmt-font-1", "d-none", "d-sm-block", "fmt-meal-carbs");
    carbSpanSm.classList.add("fmt-font-1", "d-sm-none", "fmt-meal-carbs");
    carbSpanMd.innerHTML = "Carbohydrates";
    carbSpanSm.innerHTML = "Carbs";
    const mCarbsDiv = document.createElement("div");
    mCarbsDiv.classList.add("col-3", "fmt-center-text");
    mCarbsDiv.appendChild(carbSpanMd);
    mCarbsDiv.appendChild(carbSpanSm);
    
    const proteinSpan = document.createElement("span");
    proteinSpan.classList.add("fmt-font-1", "fmt-meal-proteins");
    proteinSpan.innerHTML = "Proteins";
    const mProtDiv = document.createElement("div");
    mProtDiv.classList.add("col-3", "fmt-center-text");
    mProtDiv.appendChild(proteinSpan);

    const fatsSpan = document.createElement("span");
    fatsSpan.classList.add("fmt-font-1", "fmt-meal-fats");
    fatsSpan.innerHTML = "Fats";
    const mFatsDiv = document.createElement("div");
    mFatsDiv.classList.add("col-3", "fmt-center-text");
    mFatsDiv.appendChild(fatsSpan);
    
    const w100 = document.createElement("div");
    w100.classList.add("w-100");
    
    const mCarbsProg = document.createElement("span");
    mCarbsProg.setAttribute("id", `overview-meal-${normalizedMealName}-carb-progress`);
    mCarbsProg.classList.add("fmt-font-1");
    //Inner HTML is 0 at creation and updated later with each meal
    mCarbsProg.innerHTML = "0";
    const mCarbsProgDiv = document.createElement("div");
    mCarbsProgDiv.classList.add("fmt-center-text",  "col-3", "ml-1", "mr-1");
    mCarbsProgDiv.appendChild(mCarbsProg);
    
    const mProtProg = document.createElement("span");
    mProtProg.setAttribute("id", `overview-meal-${normalizedMealName}-protein-progress`);
    mProtProg.classList.add("fmt-font-1");
    mProtProg.innerHTML = "0";
    const mProtProgDiv = document.createElement("div");
    mProtProgDiv.classList.add("fmt-center-text",  "col-3");
    mProtProgDiv.appendChild(mProtProg);
    
    const mFatsProg = document.createElement("span");
    mFatsProg.setAttribute("id", `overview-meal-${normalizedMealName}-fat-progress`);
    mFatsProg.classList.add("fmt-font-1");
    mFatsProg.innerHTML = "0";
    const mFatsProgDiv = document.createElement("div");
    mFatsProgDiv.classList.add("fmt-center-text",  "col-3", "ml-1", "mr-1");
    mFatsProgDiv.appendChild(mFatsProg);
    
    mealFooterDiv.appendChild(mealFooterAddDiv);
    mealFooterDiv.appendChild(mCarbsDiv);
    mealFooterDiv.appendChild(mProtDiv);
    mealFooterDiv.appendChild(mFatsDiv);
    mealFooterDiv.appendChild(w100);
    mealFooterDiv.appendChild(mCarbsProgDiv);
    mealFooterDiv.appendChild(mProtProgDiv);
    mealFooterDiv.appendChild(mFatsProgDiv);
    
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
        if (res.mealEntry == null || res.error != null ) {
            console.error(`Error validating Meal Entry Object (${mealEntryObj}) . Error - ${res.error}`);
            return;
        }
        mealEntry = res.mealEntry;
    }
    const normalizedMealName = mealEntry.mealName.replace(" ", "_").replace("-", "_");
    
    const mealEntryDiv = document.createElement("div");
    const mealEntryId = `overview-meal-${mealEntry.entry_id}`;
    mealEntryDiv.classList.add("fmt-meal-entry", "col", "row");
    mealEntryDiv.setAttribute("id", mealEntryId);
    mealEntryDiv.setAttribute("entry_id", mealEntry.entry_id);
    mealEntryDiv.setAttribute("calories", mealEntry.nutritionalValue.calories);
    mealEntryDiv.setAttribute("carbohydrates", mealEntry.nutritionalValue.carbohydrates);
    mealEntryDiv.setAttribute("proteins", mealEntry.nutritionalValue.proteins);
    mealEntryDiv.setAttribute("fats", mealEntry.nutritionalValue.fats);
    mealEntryDiv.addEventListener("click", function(e) {
        const mealDiv = document.getElementById(mealEntryId);
        console.log(`Meal Entry with ID ${mealDiv.getAttribute("entry_id")} Clicked`);
        //TODO
    });
    
    const consNameSpan = document.createElement("span");
    consNameSpan.classList.add("fmt-font-1", "float-left");
    consNameSpan.innerHTML = `${mealEntry.consumableName}`;
    const consNameDiv = document.createElement("div");
    consNameDiv.classList.add("col-6");
    consNameDiv.appendChild(consNameSpan);
    
    const consKcalSpan = document.createElement("span");
    consKcalSpan.classList.add("fmt-font-1", "float-right");
    consKcalSpan.innerHTML = `${mealEntry.nutritionalValue.calories}kCal`;
    const consKcalDiv = document.createElement("div");
    consKcalDiv.classList.add("col-6");
    consKcalDiv.appendChild(consKcalSpan);
    
    const consDetailsSpan = document.createElement("span");
    consDetailsSpan.classList.add("fmt-font-sm", "float-left");
    consDetailsSpan.innerHTML = `${!!mealEntry.foodBrand ? `${mealEntry.foodBrand}, `: ""}${mealEntry.weight}${mealEntry.weightUnits}`;
    const consDetailsDiv = document.createElement("div");
    consDetailsDiv.classList.add("col-6");
    consDetailsDiv.appendChild(consDetailsSpan);
    
    const consNutriValueSpan = document.createElement("span");
    consNutriValueSpan.classList.add("fmt-font-sm", "float-left");
    consNutriValueSpan.innerHTML = `Carb:${mealEntry.nutritionalValue.carbohydrates} Protein:${mealEntry.nutritionalValue.proteins} Fat:${mealEntry.nutritionalValue.fats}`;
    const consNutriValueDiv = document.createElement("div");
    consNutriValueDiv.classList.add("col-6");
    consNutriValueDiv.appendChild(consNutriValueSpan);
    
    mealEntryDiv.appendChild(consNameDiv);
    mealEntryDiv.appendChild(consKcalDiv);
    mealEntryDiv.appendChild(consDetailsDiv);
    mealEntryDiv.appendChild(consNutriValueDiv);
    return mealEntryDiv;
}
function FMTOverviewUpdateMealProgress(targetID) {
    const mealDiv = document.getElementById(targetID);
    const mealEntries = mealDiv.getElementsByClassName("fmt-meal-entry");
    const totalNutriValue = {"calories": 0, "proteins": 0, "carbohydrates": 0, "fats": 0};
    for (let i=0; i<mealEntries.length; i++) {
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
    const proteinProgSpan = document.getElementById(`${targetID}-protein-progress`);
    const fatProgSpan = document.getElementById(`${targetID}-fat-progress`);
    calProgSpan.innerHTML = totalNutriValue.calories;
    carbProgSpan.innerHTML = totalNutriValue.carbohydrates;
    proteinProgSpan.innerHTML = totalNutriValue.proteins;
    fatProgSpan.innerHTML = totalNutriValue.fats;
};
function FMTOverviewUpdateTotalProgress(sourceID) {
    const mealsContainerDiv = document.getElementById(sourceID);
    const mealEntries = mealsContainerDiv.getElementsByClassName("fmt-meal-entry");
    const totalNutriValue = {"calories": 0, "proteins": 0, "carbohydrates": 0, "fats": 0};
    for (let i=0; i<mealEntries.length; i++) {
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
    onProfileReadFn = function(e) {
        let profile = e.target.result;
        if (profile == null) {
            FMTShowAlert("overview-alerts", "danger", "Failed Reading Profile", fmtAppGlobals.defaultAlertScroll);
            return;
        }
        const calProgBar = document.getElementById("calories-progress-bar");
        const carbProgBar = document.getElementById("carb-progress-bar");
        const proteinProgBar = document.getElementById("protein-progress-bar");
        const fatProgBar = document.getElementById("fat-progress-bar");
        
        calProgBar.innerHTML = totalNutriValue.calories;
        calPercent = (totalNutriValue.calories / profile.macroSplit.Calories) * 100;
        calProgBar.setAttribute("aria-valuenow", calPercent);
        calProgBar.style.width = `${calPercent >= 100? 100 : calPercent}%`;
        if (calPercent > 100) {
            calProgBar.classList.add("bg-danger");
        }
        else {
            calProgBar.classList.remove("bg-danger");
        }
        
        carbProgBar.innerHTML = totalNutriValue.carbohydrates;
        carbPercent = (totalNutriValue.carbohydrates / (profile.macroSplit.Carbohydrate/100 * profile.macroSplit.Calories / 4 )) * 100;
        carbProgBar.setAttribute("aria-valuenow", carbPercent);
        carbProgBar.style.width = `${carbPercent >= 100? 100 : carbPercent}%`;
        if (carbPercent > 100) {
            carbProgBar.classList.add("bg-danger");
        }
        else {
            carbProgBar.classList.remove("bg-danger");
        }
        
        proteinProgBar.innerHTML = totalNutriValue.proteins;
        proteinPercent = (totalNutriValue.proteins / (profile.macroSplit.Protein/100 * profile.macroSplit.Calories / 4 )) * 100;
        proteinProgBar.setAttribute("aria-valuenow", proteinPercent);
        proteinProgBar.style.width = `${proteinPercent >= 100? 100 : proteinPercent}%`;
        if (proteinPercent > 100) {
            proteinProgBar.classList.add("bg-danger");
        }
        else {
            proteinProgBar.classList.remove("bg-danger");
        }
        
        fatProgBar.innerHTML = totalNutriValue.fats;
        fatPercent = (totalNutriValue.fats / (profile.macroSplit.Fat/100 * profile.macroSplit.Calories / 9 )) * 100;
        fatProgBar.setAttribute("aria-valuenow", fatPercent);
        fatProgBar.style.width = `${fatPercent >= 100? 100 : fatPercent}%`;
        if (fatPercent > 100) {
            fatProgBar.classList.add("bg-danger");
        }
        else {
            fatProgBar.classList.remove("bg-danger");
        }
        
    };
    FMTReadProfile(fmtAppInstance.currentProfileId, onProfileReadFn);
}
function FMTOverviewAddMealEntry(mealEntryObj, validate) {
    let mealEntry = mealEntryObj;
    if (validate) {
        let res = FMTValidateMealEntry(mealEntryObj);
        if (res.mealEntry == null || res.error != null ) {
            console.error(`Error validating Meal Entry Object (${mealEntryObj}) . Error - ${res.error}`);
            return;
        }
        mealEntry = res.mealEntry;
    }
    const normalizedMealName = mealEntry.mealName.replace(" ", "_").replace("-", "_");
    let mealDiv = document.getElementById(`overview-meal-${normalizedMealName}`);
    if (!mealDiv) {
        mealDiv = FMTOverviewCreateMealNode(mealEntry, false);
        document.getElementById("overview-meals-container").appendChild(mealDiv);
        mealDiv = document.getElementById(`overview-meal-${normalizedMealName}`);
    }
    let mealEntryDiv = FMTOverviewCreateMealEntryNode(mealEntry, false);
    const w100 = document.createElement("div");
    w100.classList.add("w-100");
    const mealEntriesDiv = document.getElementById(`overview-meal-${normalizedMealName}-entries`);
    mealEntriesDiv.appendChild(mealEntryDiv);
    mealEntriesDiv.appendChild(w100);
    FMTOverviewUpdateMealProgress(`overview-meal-${normalizedMealName}`);
}
function FMTOverviewSetDateStrings(dateStr) {
    for (let i=0; i < fmtAppGlobals.dateDivIDs.length; i++) {
        const _id = fmtAppGlobals.dateDivIDs[i];
        document.getElementById(_id).innerHTML = dateStr;
    }
}
function FMTOverviewLoadCurrentDay(onsuccessFn, onerrorFn) {
    //Handle dates
    FMTToday();
    const cYear = fmtAppInstance.today.getFullYear();
    const cMonth = fmtAppInstance.today.getMonth();
    const cDay = fmtAppInstance.today.getDate();

    const tomorrow = new Date(cYear, cMonth, cDay+1);
    const yesterday = new Date(cYear, cMonth, cDay-1);

    if ( isSameDay(fmtAppInstance.currentDay, fmtAppInstance.today) ) { FMTOverviewSetDateStrings("Today"); }
    else if (isSameDay(fmtAppInstance.currentDay, yesterday) ) { FMTOverviewSetDateStrings("Yesterday"); }
    else if (isSameDay(fmtAppInstance.currentDay, tomorrow) ) { FMTOverviewSetDateStrings("Tomorrow"); }
    else {
        FMTOverviewSetDateStrings(getDateString(fmtAppInstance.currentDay));
    }
    //Query for Meals based on current Profile ID and currentDate
    let queryOpts = {"queryType": "only"};
    let entryCount = 0;
    document.getElementById("overview-meals-container").innerHTML = "";
    let lastMealEntry;
    onOpenCursorSuccessFn = function(event) {
        let cursor = event.target.result;
        if (cursor) {
            let mealEntryObj = cursor.value;
            FMTOverviewAddMealEntry(mealEntryObj, true);
            entryCount++;
            lastMealEntry = mealEntryObj;
            cursor.continue();
        }
        else {
            //Sync tasks
            console.debug(`Loaded ${entryCount} meal entry records`);
            const overviewAddToMealBtn = document.getElementById("overview-add-to-meal");
            if (lastMealEntry) {
                overviewAddToMealBtn.setAttribute("meal_year", lastMealEntry.year);
                overviewAddToMealBtn.setAttribute("meal_month", lastMealEntry.month);
                overviewAddToMealBtn.setAttribute("meal_day", lastMealEntry.day);
                overviewAddToMealBtn.setAttribute("profile_id", lastMealEntry.profile_id);
            }
            else {
                overviewAddToMealBtn.setAttribute("meal_year", fmtAppInstance.currentDay.getFullYear());
                overviewAddToMealBtn.setAttribute("meal_month", fmtAppInstance.currentDay.getMonth());
                overviewAddToMealBtn.setAttribute("meal_day", fmtAppInstance.currentDay.getDate());
                overviewAddToMealBtn.setAttribute("profile_id", fmtAppInstance.currentProfileId);
            }
            //Async tasks
            FMTOverviewUpdateTotalProgress("overview-meals-container");
        }
    }
    
    FMTQueryMealEntriesByProfileAndDate(fmtAppInstance.currentProfileId,
                                        fmtAppInstance.currentDay.getFullYear(),
                                        fmtAppInstance.currentDay.getMonth(),
                                        fmtAppInstance.currentDay.getDate(),
                                        onOpenCursorSuccessFn, onerrorFn, queryOpts);
}
//Functions - State
//Functions - State - Date
function FMTToday() { fmtAppInstance.today = new Date(); }
function FMTSetCurrentDate(currentDate, onsuccessFn, onerrorFn) {
    onerrorFn = onerrorFn || function(e) { console.error(`currentDate (${currentDate}) is not a valid Date object`); };
    if (!isDate(currentDate)) {return onerrorFn();}
    fmtAppInstance.currentDay = currentDate;
    if (onsuccessFn) { onsuccessFn(); }
}
function FMTPreviousDay(onsuccessFn, onerrorFn) {
    onerrorFn = onerrorFn || function (e) { console.error(`currentDay (${fmtAppInstance.currentDay}) is not a valid Date object`); }
    if (!isDate(fmtAppInstance.currentDay)) { return onerrorFn(); }
    fmtAppInstance.currentDay.setDate(fmtAppInstance.currentDay.getDate() - 1);
    if (onsuccessFn) { onsuccessFn(); }
}
function FMTNextDay(onsuccessFn, onerrorFn) {
    onerrorFn = onerrorFn || function (e) { console.error(`currentDay (${fmtAppInstance.currentDay}) is not a valid Date object`); }
    if (!isDate(fmtAppInstance.currentDay)) { return onerrorFn(); }
    fmtAppInstance.currentDay.setDate(fmtAppInstance.currentDay.getDate() + 1);
    if (onsuccessFn) { onsuccessFn(); }
}

//Page
var pageController = {
    hasLocalStorage: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e) {
            return false;
        }
    },
    hideAllTabs: function () {
            for (const i in fmtAppGlobals.tabIds) {
            let s = "#" + fmtAppGlobals.tabIds[i];
            $(s).removeClass("active");
            let areaToHideName = "#" + fmtAppGlobals.tabIds[i].split("-")[1];
            $(areaToHideName).hide();
        }
    },
    setTabActive: function(tabName) {
        if (fmtAppGlobals.tabIds.indexOf(tabName) < 0 ) {return;}
        pageController.hideAllTabs();
        let active = "#" + tabName;
        $(active).addClass("active");
        let tabId = tabName.split("-")[1];
        let areaName = "#" + tabId;
        $(areaName).show();
        fmtAppInstance.pageState.activeTab = tabId;
        pageController.closeDynamicScreens();
    },
    showOverview: function (showToday) {
        pageController.setTabActive("goto-overview");
        if (showToday === true) {
            FMTToday();
            FMTSetCurrentDate(fmtAppInstance.today);
        }
        FMTOverviewLoadCurrentDay();
    },
    showFoods: function () {
        pageController.setTabActive("goto-foods");
        let onsuccessFn = function() {
            console.debug("[showFoods] - Foods loaded successfully");
            //$(".fmt-food-table-row").click();
        };
        let onerrorFn = function(e) {
            FMTShowAlert("foods-alerts", "danger", "Failed loading food", fmtAppGlobals.defaultAlertScroll);
            console.error(e);
        };
        const events = {"click": function(e) {
                            const foodId = Number(e.currentTarget.getAttribute("food_id"));
                            pageController.openViewFoodDynamicScreen(foodId, 1, true);
                            document.getElementById("foods-alerts").innerHTML = "";
                            }
                       };
        FMTDisplayFoodsTable("foods", onsuccessFn, onerrorFn, events);
    },
    showRecipes: function () {pageController.setTabActive("goto-recipes");},
    showExport: function () {pageController.setTabActive("goto-export");},
    showImport: function () {pageController.setTabActive("goto-import");},
    showAdvanced: function () {pageController.setTabActive("goto-advanced");},
    showProfile: function () {
        pageController.setTabActive("goto-profile");
        document.getElementById("profile-alerts").innerHTML = "";
        FMTDisplayProfile(fmtAppInstance.currentProfileId);
    },
    updateZIndexes: function(reverse) {
        let sortedScreenNames = Object.keys(fmtAppInstance.pageState.activeDynamicScreens).sort(function(a ,b) {
            return fmtAppInstance.pageState.activeDynamicScreens[a] - fmtAppInstance.pageState.activeDynamicScreens[b];
        });
        for (let i=sortedScreenNames.length-1; i>=0; i--) {
            const screenName = sortedScreenNames[i];
            const zIndex = i+1;
            document.getElementById(screenName).style.zIndex = zIndex;
            fmtAppInstance.pageState.activeDynamicScreens[screenName] = zIndex;
        }
        if (reverse) {
            return sortedScreenNames.reverse();    
        }
        return sortedScreenNames;
    },
    closeDynamicScreens: function () {
        $(".fmt-dynamic-screen").hide();
        let screenNames = Object.keys(fmtAppInstance.pageState.activeDynamicScreens);
        for (let i=0; i<screenNames.length; i++) {
            const screenName = screenNames[i];
            delete fmtAppInstance.pageState.activeDynamicScreens[screenName];
        }
    },
    openDynamicScreen: function(dynamicScreenId) {
        if (fmtAppGlobals.dynamicScreenIds.indexOf(dynamicScreenId) < 0 ) {return;}
        $(`#${dynamicScreenId}`).show();
        fmtAppInstance.pageState.activeDynamicScreens[dynamicScreenId] = fmtAppGlobals.maxDynamicScreens;
        pageController.updateZIndexes();
    },
    closeDynamicScreen: function(dynamicScreenId) {
        if (fmtAppGlobals.dynamicScreenIds.indexOf(dynamicScreenId) < 0 ) {return;}
        if (!(dynamicScreenId in fmtAppInstance.pageState.activeDynamicScreens)) {
            console.debug(`Dynamic screen ${dynamicScreenId} is already closed`);
            return;
        }
        $(`#${dynamicScreenId}`).hide();
        delete fmtAppInstance.pageState.activeDynamicScreens[dynamicScreenId];
        pageController.updateZIndexes();
    },
    openAddFoodDynamicScreen: function() {
        pageController.openDynamicScreen("add-food-screen");
        FMTFoodItemScreenClear("add-food-screen");
        FMTFoodItemScreenPopulate("add-food-screen");
    },
    closeAddFoodDynamicScreen: function() {
        pageController.closeDynamicScreen("add-food-screen");
        FMTFoodItemScreenClear("add-food-screen");
        document.getElementById("foods-alerts").innerHTML = "";
    },
    openEditFoodDynamicScreen: function(foodId) {
        if (!isNumber(foodId)) { console.error(`Food ID (${foodId}) is not a number`); return; }
        foodId = Number(foodId);
        pageController.openDynamicScreen("edit-food-screen");
        FMTFoodItemScreenClear("edit-food-screen");
        FMTFoodItemScreenPopulate("edit-food-screen", {"foodId": foodId});
        FMTFoodItemScreenPopulateSavedValues("edit-food-screen", foodId, 1, false, null);
        document.getElementById("edit-food-screen-delete").setAttribute("food_id", foodId);
    },
    closeEditFoodDynamicScreen: function() {
        pageController.closeDynamicScreen("edit-food-screen");
        FMTFoodItemScreenClear("edit-food-screen");
    },
    openViewFoodDynamicScreen: function(foodId, multiplier, clear, currentWeightValue, currentWeightUnits, mealIdentifierObj) {
        //Argument Validation
        if (!isNumber(foodId)) { console.error(`Food ID (${foodId}) is not a number`); return; }
        if (!isNumber(multiplier)) { console.error(`Multiplier (${multiplier}) is not a number`); return; }
        foodId = Number(foodId);
        multiplier = Number(multiplier);
        if (clear !== false) { clear = clear || true; }
        //Open Screen
        pageController.openDynamicScreen("view-food-screen");
        //Sync Tasks
        if (clear) {
            FMTFoodItemScreenClear("view-food-screen");
            const eventListenerObj = {"view-food-screen-food-weight-units":
                                      {"massUnitChanged": FMTUpdateViewFoodValuesOnWeightChange,}
                                     };
            FMTFoodItemScreenPopulate("view-food-screen", {"foodId": foodId, "eventListenersObj": eventListenerObj });
        }
        const addToMealBtn = document.getElementById("view-food-screen-save");
        const editFoodBtn = document.getElementById("view-food-screen-edit");
        editFoodBtn.setAttribute("food_id", foodId);
        if (!!mealIdentifierObj) {
            const validateMealIdentifierObjRes = FMTValidateMealIdentifier(mealIdentifierObj);
            if (validateMealIdentifierObjRes.mealIdentifier == null || validateMealIdentifierObjRes.error != null) {
                console.error(validateMealIdentifierObjRes.error);
                FMTShowAlert("view-food-screen-alerts", "danger", `Application state corrupted or was tampered with.\nKindly reload Free Macro Tracker :)`);
                return;
            }
            const mealIdentifier = validateMealIdentifierObjRes.mealIdentifier;
            if (!!mealIdentifier.meal_name) {
                addToMealBtn.setAttribute("meal_name", mealIdentifier.meal_name);
            }
            else {
                addToMealBtn.removeAttribute("meal_name");
                //TODO - and prompt for meal Name
            }
            addToMealBtn.setAttribute("meal_year", mealIdentifier.meal_year);
            addToMealBtn.setAttribute("meal_month", mealIdentifier.meal_month);
            addToMealBtn.setAttribute("meal_day", mealIdentifier.meal_day);
            addToMealBtn.setAttribute("profile_id", mealIdentifier.profile_id);
        }
        //Async Tasks
        FMTFoodItemScreenPopulateSavedValues("view-food-screen", foodId, multiplier, true, "view-food-screen-food-weight-input", currentWeightValue, currentWeightUnits);
    },
    closeViewFoodDynamicScreen: function() {
        pageController.closeDynamicScreen("view-food-screen");
        FMTFoodItemScreenClear("view-food-screen");
    },
    openAddToMealDynamicScreen: function(mealIdentifierObj) {
        pageController.openDynamicScreen("add-to-meal-screen");
        let onsuccessFn = function() {
            console.debug("[openAddToMealDynamicScreen] - Foods loaded successfully");
        };
        let onerrorFn = function(e) {
            FMTShowAlert("add-to-meal-screen-alerts", "danger", "Failed loading food", fmtAppGlobals.defaultAlertScroll);
            console.error(e);
        };
        const events = {"click": function(e) {
                    const foodId = Number(e.currentTarget.getAttribute("food_id"));
                    pageController.openViewFoodDynamicScreen(foodId, 1, true, undefined, undefined, mealIdentifierObj);
                    }
               };
        FMTDisplayFoodsTable("add-to-meal-screen", onsuccessFn, onerrorFn, events);
    },
    closeAddToMealDynamicScreen: function() {
        pageController.closeDynamicScreen("add-to-meal-screen");
    },
};

//Functions - DB - Init
function FMTLoadMassUnits() {
    FMTReadAllMassUnits(function(e) {
        let massUnits = e.target.result;
        fmtAppInstance.massUnitChart = {};
        for (let j in massUnits) {
            let unit = massUnits[j];
            fmtAppInstance.massUnitChart[unit.name] = {"value_in_grams": unit.value_in_grams,
                                                       "description": unit.description};
        }
        console.debug(`Mass units loaded into Application instance ${JSON.stringify(fmtAppInstance.massUnitChart)}`);
    },
    function(e) {throw ReferenceError("Failed reading mass units");}); 
}
function FMTLoadAdditionalNutrients() {
    FMTReadAllNutrients(function(e) {
        let addNutri = e.target.result;
        fmtAppInstance.additionalNutrients = {};
        for (let j in addNutri) {
            let nutri = addNutri[j];
            if (!fmtAppInstance.additionalNutrients[nutri.category]) {
                fmtAppInstance.additionalNutrients[nutri.category] = [];
            }
            let _nutri = {"name": nutri.name,
                          "default_mass_unit": nutri.default_mass_unit||null,
                          "help": nutri.help || null};
            fmtAppInstance.additionalNutrients[nutri.category].push(_nutri);
        }
        console.debug(`Additional Nutrients loaded into Application instance ${JSON.stringify(fmtAppInstance.additionalNutrients)}`);
    },
    function(e) {throw ReferenceError("Failed reading additional nutrients");});
}
function FMTLoadProfile() {
    fmtAppInstance.currentProfileId = 1;
    FMTReadAllProfiles(function(e) {
        let profiles = e.target.result;
        if (profiles.length === 0) {
            console.debug("No profiles exist yet!");
            if (fmtAppInstance.promptSettings.promptOnNoProfileCreated) {
                pageController.showProfile();
                FMTShowAlert("profile-alerts", "success", "Please create a new Profile :)", fmtAppGlobals.defaultAlertScroll);   
            }
        }
        else {
            console.debug(`Selected profile id ${fmtAppInstance.currentProfileId}`);
        }
    },
       //FIXME - make a standard error reporting call
    function(e) {
        let _report = JSON.stringify({"globals": fmtAppGlobals, "instance": fmtAppInstance});
        let msg = `Failed loading profiles. Please report problem on Github and include the following data:\n${_report}`
        FMTShowAlert("overview-alerts", "danger", msg, fmtAppGlobals.defaultAlertScroll);
        throw ReferenceError(msg);
    }
   );
}
function onDbSuccess(event) {  
    fmtAppInstance.fmtDb = event.target.result;
    prepareEventHandlers();
    FMTLoadMassUnits();
    FMTLoadAdditionalNutrients();
    FMTLoadProfile();
    pageController.showOverview(true);
}

function onUpgradeNeeded(event) {
    fmtAppInstance.fmtDb = event.target.result;
    switch(fmtAppInstance.fmtDb.version) {
        case 1:
            prepareDBv1();
            break;
        default:
            break;
    }
}
function prepareEventHandlers() {
    //On click functions
    //Tabs
    $("#goto-overview").click( (e) => {
        pageController.showOverview(true);
    });
    $("#goto-foods").click( (e) => {
        pageController.showFoods();
    });
    $("#goto-recipes").click( (e) => {
        pageController.showRecipes();
    });
    $("#goto-profile").click( (e) => {
        pageController.showProfile();
    });
    $("#goto-advanced").click( (e) => {
        pageController.showAdvanced();
    });
    $("#goto-export").click( (e) => {
        pageController.showExport();
    });
    $("#goto-import").click( (e) => {
        pageController.showImport();
    });
    $("#profile-weight-units-kg").click( (e) => {
        let DOMWeightUnits = document.getElementById("profile-weight-units");
        DOMWeightUnits.innerHTML = "Kg";
        DOMWeightUnits.setAttribute("units", "Kg");
        });
    $("#profile-weight-units-lbs").click( (e) => {
        let DOMWeightUnits = document.getElementById("profile-weight-units");
        DOMWeightUnits.innerHTML = "Lbs";
        DOMWeightUnits.setAttribute("units", "Lbs");
        });
    $("#profile-height-units-cm").click( (e) => {
        let DOMHeightUnits = document.getElementById("profile-height-units");
        DOMHeightUnits.innerHTML = "Cm";
        DOMHeightUnits.setAttribute("units", "Cm");
        });
    $("#profile-height-units-inch").click( (e) => {
        let DOMHeightUnits = document.getElementById("profile-height-units");
        DOMHeightUnits.innerHTML = "Inch";
        DOMHeightUnits.setAttribute("units", "Inch");
        });
    $("#profile-sex-male").click( (e) => {
        let DOMSex = document.getElementById("profile-sex");
        DOMSex.innerHTML = "Male";
        DOMSex.setAttribute("sex", "Male");
        });
    $("#profile-sex-female").click( (e) => {
        let DOMSex = document.getElementById("profile-sex");
        DOMSex.innerHTML = "Female";
        DOMSex.setAttribute("sex", "Female");
        });
    $("#profile-active-level-sed").click( (e) => {
        let DOMActiveLevel = document.getElementById("profile-active-level");
        DOMActiveLevel.innerHTML = "Sedentary";
        DOMActiveLevel.setAttribute("level", "Sedentary");
        let DOMActiveLevelMult = document.getElementById("profile-activity-mult");
        DOMActiveLevelMult.setAttribute("value", 1.2);
        DOMActiveLevelMult.innerHTML = 1.2;
        });
    $("#profile-active-level-light").click( (e) => {
        let DOMActiveLevel = document.getElementById("profile-active-level");
        DOMActiveLevel.innerHTML = "Light";
        DOMActiveLevel.setAttribute("level", "Light");
        let DOMActiveLevelMult = document.getElementById("profile-activity-mult");
        DOMActiveLevelMult.setAttribute("value", 1.375);
        DOMActiveLevelMult.innerHTML = 1.375;
        });
    $("#profile-active-level-mod").click( (e) => {
        let DOMActiveLevel = document.getElementById("profile-active-level");
        DOMActiveLevel.innerHTML = "Moderate";
        DOMActiveLevel.setAttribute("level", "Moderate");
        let DOMActiveLevelMult = document.getElementById("profile-activity-mult");
        DOMActiveLevelMult.setAttribute("value", 1.55);
        DOMActiveLevelMult.innerHTML = 1.55;
        });
    $("#profile-active-level-high").click( (e) => {
        let DOMActiveLevel = document.getElementById("profile-active-level");
        DOMActiveLevel.innerHTML = "High";
        DOMActiveLevel.setAttribute("level", "High");
        let DOMActiveLevelMult = document.getElementById("profile-activity-mult");
        DOMActiveLevelMult.setAttribute("value", 1.725);
        DOMActiveLevelMult.innerHTML = 1.725;
        });
    $("#profile-active-level-vhigh").click( (e) => {
        let DOMActiveLevel = document.getElementById("profile-active-level");
        DOMActiveLevel.innerHTML = "Very High";
        DOMActiveLevel.setAttribute("level", "Very High");
        let DOMActiveLevelMult = document.getElementById("profile-activity-mult");
        DOMActiveLevelMult.setAttribute("value", 1.9);
        DOMActiveLevelMult.innerHTML = 1.9;
        });
    $("#profile-active-level-custom").click( (e) => {
        let mult = prompt("Enter Custom Multiplier:");
        console.debug(mult);
        if (!isNaN(mult)) {
            let DOMActiveLevel = document.getElementById("profile-active-level");
            DOMActiveLevel.innerHTML = "Custom";
            DOMActiveLevel.setAttribute("level", "Custom");
            let DOMActiveLevelMult = document.getElementById("profile-activity-mult");
            DOMActiveLevelMult.setAttribute("value", mult);
            DOMActiveLevelMult.innerHTML = mult;
        }
        });
    $("#save-profile-details").click( (e) => {
        let onsuccessFn = function(ev) {
            console.debug(`Profile ${fmtAppInstance.currentProfileId} updated successfully`);
            FMTDisplayProfile(fmtAppInstance.currentProfileId)
        };
        let onerrorFn = function(msg) { FMTShowAlert("profile-alerts", "danger", msg || "Error!", fmtAppGlobals.defaultAlertScroll); };
        FMTUpdateProfileForm(fmtAppInstance.currentProfileId, onsuccessFn, onerrorFn);
        });
    $("#save-profile-macro").click( (e) => {
        let onsuccessFn = function(ev) {
            console.debug(`Profile ${fmtAppInstance.currentProfileId} updated successfully`);
            FMTDisplayProfile(fmtAppInstance.currentProfileId)
        };
        let onerrorFn = function(msg) { FMTShowAlert("profile-alerts", "danger", msg || "Error!", fmtAppGlobals.defaultAlertScroll); };
        FMTUpdateMacroesForm(fmtAppInstance.currentProfileId, onsuccessFn, onerrorFn);
        });
    $("#foods-add-food").click( (e) => {
        pageController.openAddFoodDynamicScreen();
    });
    $("#add-food-screen-cancel").click( (e) => {
        if(fmtAppInstance.promptSettings.promptOnUnsavedFood) {
            let inputs = document.getElementById("add-food-screen").getElementsByTagName("input");
            let prompt = false;
            for(let j=0; j < inputs.length; j++) {
                let val = inputs[j].value;
                if (val != null && val !== "") {
                    prompt = true;
                    break;
                }
            }
            if (prompt) {
                FMTShowPrompt("add-food-screen-alerts",
                              "warning",
                              "Unsaved Food, discard changes?",
                              fmtAppGlobals.defaultAlertScroll,
                              function(res) {
                                if (res) {
                                    pageController.closeAddFoodDynamicScreen();
                                    
                                }
                                else {
                                    return;
                                }
                });
            }
            else {
                pageController.closeAddFoodDynamicScreen();
            }
        }
        else {
            pageController.closeAddFoodDynamicScreen();
        }
    });
    $("#add-food-screen-more").click( (e) => { FMTFoodItemScreenShowMore("add-food-screen"); } );
    $("#add-food-screen-less").click( (e) => { FMTFoodItemScreenShowLess("add-food-screen"); } );
    $("#add-food-screen-save").click( (e) => {
        onerrorFn = function(err) {
            const msg = `Failed adding food - ${err}`;
            console.error(msg);
            FMTShowAlert(`add-food-screen-alerts`, "danger", msg, fmtAppGlobals.defaultAlertScroll);
        }
        onsuccessFn = function(ev, food) {
            const msg = `Successfully added food: ${(food.foodName)}`;
            pageController.closeAddFoodDynamicScreen();
            const openScreens = pageController.updateZIndexes(true);
            if (openScreens.length < 1 && fmtAppInstance.pageState.activeTab === "foods") {
                pageController.showFoods();
                FMTShowAlert(`${fmtAppInstance.pageState.activeTab}-alerts`, "success", msg);
            }
            else {
                if (openScreens[0] === "add-to-meal-screen") { pageController.openAddToMealDynamicScreen(); }
                else { pageController.openDynamicScreen(openScreens[0]); }
                FMTShowAlert(`${openScreens[0]}-alerts`, "success", msg);
            }
        }
        FMTFoodItemScreenSave("add-food-screen", "add", {}, onsuccessFn, onerrorFn);
    });
    $("#edit-food-screen-cancel").click( (e) => {
        //TODO check for changes and prompt if needed
        pageController.closeEditFoodDynamicScreen();
    });
    $("#edit-food-screen-more").click( (e) => { FMTFoodItemScreenShowMore("edit-food-screen"); } );
    $("#edit-food-screen-less").click( (e) => { FMTFoodItemScreenShowLess("edit-food-screen"); } );
    $("#edit-food-screen-save").click( (e) => {
        onerrorFn = function(err) {
            const msg = `Failed editing food - ${err}`;
            console.error(msg);
            FMTShowAlert(`edit-food-screen-alerts`, "danger", msg, fmtAppGlobals.defaultAlertScroll);
        }
        onsuccessFn = function(ev) {
            const msg = `Successfully updated food: ${(document.getElementById("edit-food-screen-food-name").value)}`;
            pageController.closeEditFoodDynamicScreen();
            const openScreens = pageController.updateZIndexes(true);
            if (openScreens.length < 1 && fmtAppInstance.pageState.activeTab === "foods") {
                pageController.showFoods();
                FMTShowAlert(`${fmtAppInstance.pageState.activeTab}-alerts`, "success", msg);
            }
            else {
                if (openScreens[0] === "add-to-meal-screen") { pageController.openAddToMealDynamicScreen(); }
                else { pageController.openDynamicScreen(openScreens[0]); }
                FMTShowAlert(`${openScreens[0]}-alerts`, "success", msg);
            }
        }
        const foodId = Number(e.currentTarget.getAttribute("food_id"));
        if (!isNumber(foodId)) { console.error(`Food ID (${foodId}) is not a number`); return; }
        FMTFoodItemScreenSave("edit-food-screen", "edit", {"foodId": foodId}, onsuccessFn, onerrorFn);
    });
    $("#edit-food-screen-delete").click( (e) => {
        let foodId = e.currentTarget.getAttribute("food_id");
        if (!isNumber(foodId)) {
            const msg = `Invalid Food ID (${foodId}). Please reload`;
            FMTShowAlert("edit-food-screen-alerts", "danger", msg, fmtAppGlobals.defaultAlertScroll);
            return;
        }
        foodId = Number(foodId);
        const msg = `Are you sure you would like to delete this Food ? (Food ID ${foodId})`;
        FMTShowPrompt("edit-food-screen-alerts", "warning", msg, fmtAppGlobals.defaultAlertScroll,
                      function(delFood) {
            if (delFood) {
                FMTDeleteFood(foodId,
                              function(e) {
                    pageController.closeEditFoodDynamicScreen();
                    const openScreens = pageController.updateZIndexes(true);
                    const msg = `Successfully deleted Food! (Food ID ${foodId})`;
                    if (openScreens.length < 1 && fmtAppInstance.pageState.activeTab === "foods") {
                        pageController.showFoods();
                        FMTShowAlert("foods-alerts", "success", msg, fmtAppGlobals.defaultAlertScroll);
                    }
                    else {
                        if (openScreens[0] === "add-to-meal-screen") { pageController.openAddToMealDynamicScreen(); }
                        else { pageController.openDynamicScreen(openScreens[0]); }
                        FMTShowAlert(`${openScreens[0]}-alerts`, "success", msg);
                    }
                },
                              function(e) {
                    pageController.closeEditFoodDynamicScreen();
                    const openScreens = pageController.updateZIndexes(true);
                    const msg = `Failed deleting Food! (Food ID ${foodId})`;
                    if (openScreens.length < 1 && fmtAppInstance.pageState.activeTab === "foods") {
                        pageController.showFoods();
                        FMTShowAlert("foods-alerts", "danger", msg, fmtAppGlobals.defaultAlertScroll);
                    }
                    else {
                        if (openScreens[0] === "add-to-meal-screen") { pageController.openAddToMealDynamicScreen(); }
                        else { pageController.openDynamicScreen(openScreens[0]); }
                        FMTShowAlert(`${openScreens[0]}-alerts`, "danger", msg);
                    }
                });
            }
            else {
                FMTShowAlert("edit-food-screen-alerts", "success", `Food not deleted! (Food ID ${foodId})`, fmtAppGlobals.defaultAlertScroll);
            }
        });
    });
    $("#view-food-screen-food-weight-input").keyup(FMTUpdateViewFoodValuesOnWeightChange);
    $("#view-food-screen-more").click( (e) => { FMTFoodItemScreenShowMore("view-food-screen"); } );
    $("#view-food-screen-less").click( (e) => { FMTFoodItemScreenShowLess("view-food-screen"); } );
    $("#view-food-screen-cancel").click( (e) => { pageController.closeViewFoodDynamicScreen(); } );
    $("#view-food-screen-edit").click( (e) => {
        let foodId = e.currentTarget.getAttribute("food_id");
        if (!isNumber(foodId)) {
            const msg = `Invalid Food ID (${foodId}). Please reload`;
            FMTShowAlert("view-food-screen-alerts", "danger", msg, fmtAppGlobals.defaultAlertScroll);
            return;
        }
        pageController.closeViewFoodDynamicScreen();
        pageController.openEditFoodDynamicScreen(foodId);
    });
    $("#view-food-screen-save").click( (e) => {
        const addToMealBtn = document.getElementById("view-food-screen-save");
        const mealIdentifierObj = {};
        mealIdentifierObj.meal_year = addToMealBtn.getAttribute("meal_year");
        mealIdentifierObj.meal_month = addToMealBtn.getAttribute("meal_month");
        mealIdentifierObj.meal_day = addToMealBtn.getAttribute("meal_day");
        mealIdentifierObj.meal_name = addToMealBtn.getAttribute("meal_name");
        mealIdentifierObj.profile_id = addToMealBtn.getAttribute("profile_id") || fmtAppInstance.currentProfileId;

        if (!mealIdentifierObj.meal_year
            || !mealIdentifierObj.meal_month
            || !mealIdentifierObj.meal_day
            || !mealIdentifierObj.meal_name) {
            console.warn("Missing value on meal identifier");
            return;
        }
        const validateMealIdentifierObjRes = FMTValidateMealIdentifier(mealIdentifierObj);
        if (validateMealIdentifierObjRes.mealIdentifier == null || validateMealIdentifierObjRes.error != null) {
            console.error(validateMealIdentifierObjRes.error);
            FMTShowAlert("view-food-screen-alerts", "danger", `Application state corrupted or was tampered with.\nKindly reload Free Macro Tracker :)`);
            return;
        }
        const mealIdentifier = validateMealIdentifierObjRes.mealIdentifier;
        //Collect values from screen and insert to DB
        const consumableValues = FMTFoodItemScreenSave("view-food-screen", "get-object");
        const mealEntryObj = {};
        mealEntryObj.profile_id = mealIdentifier.profile_id;
        mealEntryObj.year = mealIdentifier.meal_year;
        mealEntryObj.month = mealIdentifier.meal_month;
        mealEntryObj.day = mealIdentifier.meal_day;
        mealEntryObj.mealName = mealIdentifier.meal_name;
        mealEntryObj.consumable_id = Number(addToMealBtn.getAttribute("food_id"));
        mealEntryObj.consumableName = consumableValues.foodName;
        mealEntryObj.foodBrand = consumableValues.foodBrand;
        mealEntryObj.is_recipe = false;
        mealEntryObj.weight = consumableValues.referenceWeight;
        mealEntryObj.weightUnits = consumableValues.weightUnits;
        mealEntryObj.nutritionalValue = consumableValues.nutritionalValue;
        FMTAddMealEntry(mealEntryObj,
                       function(e) {
            console.debug("Successfully added meal entry");
            console.log(mealEntryObj);
            pageController.closeViewFoodDynamicScreen();
            pageController.showOverview(false);
        },
                       function(e) {
            const msg = "Failed adding meal entry";
            console.error(msg);
            console.error(mealEntryObj);
            FMTShowAlert("view-food-screen-alerts", "danger", msg);
        });

    });
    $("#overview-add-to-meal").click( (e) => { 
        const overviewAddToMealBtn = document.getElementById("overview-add-to-meal");
        const mealIdentifierObj = {};
        mealIdentifierObj.meal_year = overviewAddToMealBtn.getAttribute("meal_year");
        mealIdentifierObj.meal_month = overviewAddToMealBtn.getAttribute("meal_month");
        mealIdentifierObj.meal_day = overviewAddToMealBtn.getAttribute("meal_day");
        mealIdentifierObj.meal_name = null;
        mealIdentifierObj.profile_id = fmtAppInstance.currentProfileId;
        pageController.openAddToMealDynamicScreen(mealIdentifierObj);
    });
    $("#add-to-meal-screen-cancel").click( (e) => { 
        pageController.closeAddToMealDynamicScreen();
    });
    $("#add-to-meal-screen-add-food").click( (e) => {
        pageController.openAddFoodDynamicScreen();
    });
    //Search functions
    $("#foods-food-search").keyup( (e) => {
        let query = e.currentTarget.value;
        FMTQueryFoodsTable(query, "foods");
    });
    $("#add-to-meal-screen-food-search").keyup( (e) => {
        let query = e.currentTarget.value;
        FMTQueryFoodsTable(query, "add-to-meal-screen");
    });
    $(".fmt-prev-day-btn").click( (e) => { FMTPreviousDay(FMTOverviewLoadCurrentDay); } );
    $(".fmt-next-day-btn").click( (e) => { FMTNextDay(FMTOverviewLoadCurrentDay); } );
}
//Main
$(document).ready(function() {
    pageController.hideAllTabs();
    pageController.closeDynamicScreens();
    if (typeof Array.isArray === 'undefined') {
      Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      }
    };
    //Check if IndexedDB supported
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!window.indexedDB) {
        document.getElementById("page-title").innerHTML += '<div class="alert alert-danger col-12" role="alert">IndexedDB is not supported on this browser. Can\'t use app!</div>';
        return;
    }
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    //Start IndexedDB
    var dbOpenReq = indexedDB.open(fmtAppGlobals.FMT_DB_NAME, fmtAppGlobals.FMT_DB_VER);
    dbOpenReq.onupgradeneeded = onUpgradeNeeded;
    dbOpenReq.onsuccess = onDbSuccess;
});