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
fmtAppInstance.pageState.activeDynamicScreen = null;
//Instance - State - Log
fmtAppInstance.today = null;
fmtAppInstance.currentDay = null;
//Instance - User defined metrics
fmtAppInstance.massUnitChart = null;
fmtAppInstance.additionalNutrients = null;
//Globals
var fmtAppGlobals = {};
//Globals - Links
fmtAppGlobals.issueReportURL = "https://github.com/guyo13/free-macro-tracker/issues";
//Globals - DB
fmtAppGlobals.fmtDb = undefined;
fmtAppGlobals.FMT_DB_NAME = "fmt";
fmtAppGlobals.FMT_DB_VER = 1;
fmtAppGlobals.FMT_DB_READONLY = "readonly";
fmtAppGlobals.FMT_DB_READWRITE = "readwrite";
//Globals - DB - Entries Store constants
fmtAppGlobals.FMT_DB_ENTRIES_STORE = "fmt_food_log";
fmtAppGlobals.FMT_DB_ENTRIES_KP = "_id";//, "profile_id"];
fmtAppGlobals.FMT_DB_DATE_INDEX_NAME = "date_index";
fmtAppGlobals.FMT_DB_DATE_INDEX_KEYS = ["year", "month", "day"];
fmtAppGlobals.FMT_DB_FOODID_INDEX_NAME = "foodid_index";
fmtAppGlobals.FMT_DB_FOODID_INDEX_KEYS = ["food_id", "foodName", "foodBrand"];
fmtAppGlobals.FMT_DB_MEALNAME_INDEX_NAME = "mealname_index";
fmtAppGlobals.FMT_DB_MEALNAME_INDEX_KEYS = "mealName";
fmtAppGlobals.FMT_DB_PROFILE_INDEX_NAME = "profile_index";
fmtAppGlobals.FMT_DB_PROFILE_INDEX_KEYS = "profile_id";
//Globals - DB - Foods Store constants
fmtAppGlobals.FMT_DB_FOODS_STORE = "fmt_foods";
fmtAppGlobals.FMT_DB_FOODS_KP = "food_id";
fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_NAME = "food_names_index";
fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_KEYS = ["foodName", "foodBrand"];
fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_NAME = "macroes_index";
fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_KEYS = ["nutritionalValue.calories",
                                           "nutritionalValue.proteins",
                                           "nutritionalValue.carbohydrates",
                                           "nutritionalValue.fats"];
//Globals - DB - Recipes Store constants
fmtAppGlobals.FMT_DB_RECIPES_STORE = "fmt_recipes";
fmtAppGlobals.FMT_DB_RECIPES_KP = "recipe_id";
fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_NAME = "recipe_names_index";
fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_KEYS = "recipe_name";
//Globals - DB - Profile Store constants
fmtAppGlobals.FMT_DB_PROFILE_STORE = "fmt_profile";
fmtAppGlobals.FMT_DB_PROFILE_KP = "profile_id";
//Globals - DB - Mass Units Store constants
fmtAppGlobals.FMT_DB_MUNIT_STORE = "fmt_mass_units";
fmtAppGlobals.FMT_DB_MUNIT_KP = "name";
fmtAppGlobals.FMT_DB_MUNIT_INDEX_NAME = "mass_unit_index";
fmtAppGlobals.FMT_DB_MUNIT_INDEX_KEYS = ["value_in_grams", "description"];
//Globals - DB - Nutrients Store constants
fmtAppGlobals.FMT_DB_NUTRI_STORE = "fmt_nutrients";
fmtAppGlobals.FMT_DB_NUTRI_KP = "name";
fmtAppGlobals.FMT_DB_NUTRI_INDEX_NAME = "nutri_category_index";
fmtAppGlobals.FMT_DB_NUTRI_INDEX_KEYS = "category";

//Globals - Page
fmtAppGlobals.tabIds = ["goto-overview","goto-foods", "goto-recipes", "goto-profile", "goto-advanced", "goto-export", "goto-import"];
fmtAppGlobals.dynamicScreenIds = ["add-food-screen", "edit-food-screen", "view-food-screen"];
fmtAppGlobals.foodItemScreenStaticViewInputFields = ["food-name", "food-brand", /*"food-weight-input",*/ "food-calories", "food-proteins", "food-carbohydrates", "food-fats"];
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
                                         {"name" : "Starch", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         /*{"name" : "Glucose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Sucrose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Amylose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Amylopectin", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Fructose", "category": "Carbohydrates", "default_mass_unit": "g"},
                                         {"name" : "Lactose", "category": "Carbohydrates", "default_mass_unit": "g"},*/
                                         {"name": "Saturated Fats", "category": "Fats", "default_mass_unit": "g"},
                                         {"name": "Monounsaturated Fats", "category": "Fats", "default_mass_unit": "g"},
                                         {"name": "Polyunsaturated Fats", "category": "Fats", "default_mass_unit": "g"},
                                         {"name": "Omega-3", "category": "Fats", "default_mass_unit": "g"},
                                         {"name": "Omega-6", "category": "Fats", "default_mass_unit": "g"},
                                         {"name": "Trans Fats", "category": "Fats", "default_mass_unit": "g"},
                                         {"name": "Cholesterol", "category": "Sterols", "default_mass_unit": "mg"},
                                         {"name": "Calcium", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Sodium", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Potassium", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Phosphorus", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Magnesium", "category": "Minerals", "default_mass_unit": "mg"},
                                         //{"name": "Chloride", "category": "Minerals", "default_mass_unit": "mg"},
                                         //{"name": "Sulfur", "category": "Minerals", "default_mass_unit": "mg"},
                                         {"name": "Vitamin C", "category": "Vitamins", "default_mass_unit": "mg"},
                                         {"name": "Vitamin K", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin D", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Vitamin B6", "category": "Vitamins", "default_mass_unit": "mg"},
                                         {"name": "Vitamin B12", "category": "Vitamins", "default_mass_unit": "mcg"},
                                         {"name": "Iron", "category": "Trace Minerals", "default_mass_unit": "mg"},
                                         {"name": "Zinc", "category": "Trace Minerals", "default_mass_unit": "mg"},
                                         {"name": "Selenium", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                         //{"name": "Iodine", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                         {"name": "Copper", "category": "Trace Minerals", "default_mass_unit": "mg"},
                                         {"name": "Manganese", "category": "Trace Minerals", "default_mass_unit": "mg"},
                                         {"name": "Fluoride", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                         //{"name": "Cobalt", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                         //{"name": "Molybdenum", "category": "Trace Minerals", "default_mass_unit": "mcg"},
                                        ];
    //Create entries objectStore
    let fmtEntriesStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_ENTRIES_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_ENTRIES_KP, autoIncrement: true});
    fmtEntriesStore.createIndex(fmtAppGlobals.FMT_DB_DATE_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_DATE_INDEX_KEYS,
                                { unique: false });
    fmtEntriesStore.createIndex(fmtAppGlobals.FMT_DB_FOODID_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_FOODID_INDEX_KEYS,
                                { unique: false });
    fmtEntriesStore.createIndex(fmtAppGlobals.FMT_DB_MEALNAME_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_MEALNAME_INDEX_KEYS,
                                { unique: false });
    fmtEntriesStore.createIndex(fmtAppGlobals.FMT_DB_PROFILE_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_PROFILE_INDEX_KEYS,
                                { unique: false });
    
    //Create foods objectStore
    let fmtFoodsStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE,
                                                              {keyPath: fmtAppGlobals.FMT_DB_FOODS_KP, autoIncrement: true});
    fmtFoodsStore.createIndex(fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_NAME,
                              fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_KEYS,
                              { unique: false });
    for (let i in fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_KEYS) {
        fmtFoodsStore.createIndex(`${fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_NAME}_${i}`,
                                  fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_KEYS[i],
                                  { unique: false});
    }
    
    //Create recipes objectStore
    let fmtRecipesStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_RECIPES_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_RECIPES_KP, autoIncrement: true});
    fmtRecipesStore.createIndex(fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_KEYS,
                                { unique: false });
    
    //Create profile objectStore
    let fmtProfileStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_PROFILE_KP, autoIncrement: false});
    
    //Create mass units objectStore
    let fmtMassUnitStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_MUNIT_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_MUNIT_KP, autoIncrement: false});
    fmtMassUnitStore.createIndex(fmtAppGlobals.FMT_DB_MUNIT_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_MUNIT_INDEX_KEYS,
                                { unique: false });
    for (let i in baseMassUnitChart) {
        console.debug(`Adding Mass unit entry: ${JSON.stringify(baseMassUnitChart[i])}`);
        fmtMassUnitStore.add(baseMassUnitChart[i]);
    }
    
    //Create nutrients objectStore
    let fmtNutrientsStore = fmtAppInstance.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_NUTRI_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_NUTRI_KP, autoIncrement: false});
    fmtNutrientsStore.createIndex(fmtAppGlobals.FMT_DB_NUTRI_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_NUTRI_INDEX_KEYS,
                                { unique: false });
    for (let i in baseAdditionalNutrients) {
        let nutri = baseAdditionalNutrients[i];
        console.debug(`Inserting Additional Nutrient entry: ${JSON.stringify(nutri)}`);
        fmtNutrientsStore.add(nutri);
    }
}
function getObjectStore(store_name, mode) {
    if (!fmtAppInstance.fmtDb) {
        console.error("fmt DB null reference");
        return;
    }
    var tx = fmtAppInstance.fmtDb.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

//Functions - Validation
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
        let additionalNutrients = nutritionalValue.additionalNutrients
        food.nutritionalValue.additionalNutrients = {}
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
            macroSplit.Calories = macroSplitObj.Calories;
            macroSplit.Protein = macroSplitObj.Protein;
            macroSplit.Carbohydrate = macroSplitObj.Carbohydrate;
            macroSplit.Fat = macroSplitObj.Fat;
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
//Functions - DB - Entries
function FMTAddEntry(entryObject) {
    //TODO validate object
    let entriesStore = getObjectStore(fmtAppGlobals.FMT_DB_ENTRIES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let date = new Date();
    entryObject.lastModified = date.toISOString();
    entryObject.tzMinutes = date.getTimezoneOffset();
    let addRequest = entriesStore.add(entryObject);
    
}
function FMTUpdateEntry(entryObject, entry_id) {
    //TODO validate object
    let entriesStore = getObjectStore(fmtAppGlobals.FMT_DB_ENTRIES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let date = new Date();
    entryObject.lastModified = date.toISOString();
    entryObject.tzMinutes = date.getTimezoneOffset();
    entryObject._id = entry_id;
    let updateRequest = entriesStore.put(entryObject);
}
function FMTRemoveEntry(entry_id) {
    let entriesStore = getObjectStore(fmtAppGlobals.FMT_DB_ENTRIES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let deleteRequest = entriesStore.delete(entry_id);
}
//TODO - Separate Profile CRUD from UI functions

//Functions - DB - Profile
function FMTReadProfile(profileId, onsuccessFn, onerrorFn) {
    if (isNaN(profileId)) {
        const msg = `Invalid profile_id ${profileId}`;
        onerrorFn = onerrorFn || function(e) { console.error(msg); };
        return onerrorFn(msg);
    }
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let getRequest = profileStore.get(profileId);
    getRequest.onerror = onerrorFn || function (e) { console.error(`Failed getting Profile id ${profileId}`); };
    getRequest.onsuccess = onsuccessFn;
}
function FMTReadAllProfiles(onsuccessFn, onerrorFn) {
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, fmtAppGlobals.FMT_DB_READONLY);
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
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, fmtAppGlobals.FMT_DB_READWRITE);
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
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let updateRequest = profileStore.put(profile);
    updateRequest.onerror = onerrorFn || function() { console.error(`Failed updating Profile id ${profileId}`) };
    updateRequest.onsuccess = onsuccessFn || function() { console.debug(`Success updating Profile id ${profileId}`) };
}
function FMTDeleteProfile(profileId, onsuccessFn, onerrorFn) {
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, fmtAppGlobals.FMT_DB_READWRITE);
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
        onerrorFn();
        return;
    }
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRI_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let addRequest = nutrientStore.add(nutrient);
    addRequest.onsuccess = onsuccessFn || console.debug(`Successfully added nutrient object ${nutrient}`);
    addRequest.onerror = onerrorFn || console.debug(`Error adding nutrient object ${nutrient}`);
}
function FMTUpdateNutrient(nutrientObj, onsuccessFn, onerrorFn) {
    let nutrient = FMTValidateNutrientObject(nutrientObj);
    if (nutrient == null) {
        onerrorFn = onerrorFn || console.error(`Failed validating nutrient object ${nutrientObj}`);
        onerrorFn();
        return;
    }
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRI_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let addRequest = nutrientStore.put(nutrient);
    addRequest.onsuccess = onsuccessFn || console.debug(`Successfully udated nutrient object ${nutrient}`);
    addRequest.onerror = onerrorFn || console.debug(`Error updating nutrient object ${nutrient}`);
}
function FMTReadNutrient(nutrientName, onsuccessFn, onerrorFn) {
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRI_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = nutrientStore.get(nutrientName);
    readRequest.onsuccess = onsuccessFn || console.debug(`Successfully read nutrient ${nutrientName}`);
    readRequest.onerror = onerrorFn || console.debug(`Failed reading nutrient ${nutrientName}`);
}
function FMTReadAllNutrients(onsuccessFn, onerrorFn) {
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRI_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = nutrientStore.getAll();
    readRequest.onsuccess = onsuccessFn || console.debug(`Successfully read all nutrients`);
    readRequest.onerror = onerrorFn || console.debug(`Failed reading nutrients`);
}
/*onsuccessFn must implement success function accessing the cursor*/
function FMTIterateNutrients(onsuccessFn, onerrorFn) {
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRI_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = nutrientStore.openCursor();
    readRequest.onsuccess = onsuccessFn || console.debug(`Successfully iterating nutrients`);
    readRequest.onerror = onerrorFn || console.debug(`Failed iterating nutrients`);
}
function FMTDeleteNutrient(nutrientName, onsuccessFn, onerrorFn) {
    let nutrientStore = getObjectStore(fmtAppGlobals.FMT_DB_NUTRI_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let deleteRequest = nutrientStore.delete(nutrientName);
    deleteRequest.onsuccess = onsuccessFn || console.debug(`Successfully deleted nutrient ${nutrientName}`);
    deleteRequest.onerror = onerrorFn || console.debug(`Failed deleting nutrient ${nutrientName}`);
}

//Functions - DB - Mass Units
function FMTAddMassUnit(massUnitObj, onsuccessFn, onerrorFn) {
    let massUnit = FMTValidateMassUnitObject(massUnitObj);
    if (massUnit == null) {
        onerrorFn = onerrorFn || console.error(`Failed validating mass unit object ${massUnitObj}`);
        onerrorFn();
        return;
    }
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MUNIT_STORE, fmtAppGlobals.FMT_DB_READWRITE);
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
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MUNIT_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let addRequest = munitStore.put(massUnit);
    addRequest.onsuccess = onsuccessFn || console.debug(`Successfully added mass unit object ${massUnit}`);
    addRequest.onerror = onerrorFn || console.debug(`Error adding mass unit object ${massUnit}`);
}
function FMTReadMassUnit(massUnitName, onsuccessFn, onerrorFn) {
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MUNIT_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = munitStore.get(massUnitName);
    readRequest.onsuccess = onsuccessFn || console.debug(`Successfully read mass unit ${massUnitName}`);
    readRequest.onerror = onerrorFn || console.debug(`Failed reading mass unit ${massUnitName}`);
}
function FMTReadAllMassUnits(onsuccessFn, onerrorFn) {
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MUNIT_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = munitStore.getAll();
    readRequest.onsuccess = onsuccessFn || console.debug(`Successfully read all mass units`);
    readRequest.onerror = onerrorFn || console.debug(`Failed reading all mass units`);
}
/*onsuccessFn must implement success function accessing the cursor*/
function FMTIterateMassUnits(onsuccessFn, onerrorFn) {
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MUNIT_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let readRequest = munitStore.openCursor();
    readRequest.onsuccess = onsuccessFn || console.debug(`Successfully iterate mass unit`);
    readRequest.onerror = onerrorFn || console.debug(`Failed mass units iteration`);
}
function FMTDeleteMassUnit(massUnitName, onsuccessFn, onerrorFn) {
    let munitStore = getObjectStore(fmtAppGlobals.FMT_DB_MUNIT_STORE, fmtAppGlobals.FMT_DB_READWRITE);
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
                        //throw ReferenceError(`Profile with ID ${profileId} does not exist.`);
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
function FMTDisplayFoodsTable(onsuccessFn, onerrorFn) {
    let foodTableBody = document.getElementById("food-table-body");
    foodTableBody.innerHTML = "";
    FMTIterateFoods(function(e) {
        let cursor = e.target.result;
        if (cursor) {
            let record = cursor.value;
            let foodRow = document.createElement("tr");
            foodRow.setAttribute("food_id", record.food_id);
            foodRow.classList.add("fmt-food-table-row");
            foodRow.innerHTML = `<th scope="row" class="fmt-food-id-cell ${fmtAppInstance.displaySettings.showFoodIdColumn? "" : "d-none"}">${record.food_id}</th><td class= "fmt-food-name-cell">${record.foodName}</td>${record.foodBrand != null ? `<td class="fmt-food-brand-cell">${record.foodBrand}</td>` : "<td class=\"fmt-food-brand-cell\"></td>"}`
            foodTableBody.appendChild(foodRow);
            cursor.continue();
        }
        else {
            onsuccessFn();
        }
    },
                onerrorFn );
}
function FMTQueryFoodsTable(query) {
    let tbody = document.getElementById("food-table-body");
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
function FMTFoodItemScreenPopulateSavedValues(baseScreenID, foodId, multiplier, readonly, focusDivId, currentWeightValue, currentWeightUnits) {
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
    document.getElementById(`${baseScreenID}-save`).removeAttribute("food_id");
    FMTFoodItemScreenShowLess(baseScreenID);
}
function FMTFoodItemScreenSave(baseScreenID, action, optionsObj, onsuccessFn, onerrorFn) {
    onerrorFn = onerrorFn || function() { console.error("[FMTFoodItemScreenSave] - Failed"); }
    if (baseScreenID == null) { console.error(`[FMTFoodItemScreenSave] - Invalid baseScreenID "${baseScreenID}"`); return onerrorFn(); }
    if (!(action == "add" || action == "edit")) { console.error(`[FMTFoodItemScreenSave] - Invalid action "${action}"`); return onerrorFn(); }
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
    onerrorFn = onerrorFn || function(e) {
        console.error(`[FMTFoodItemScreenSave] - Failed adding food: ${JSON.stringify(foodObj)}`);
        FMTShowAlert("add-food-screen-alerts", "danger",
                     `Failed adding food!\n${e}`,
                     fmtAppGlobals.defaultAlertScroll);
    };
    switch(action) {
        case "add":
            onsuccessFn = onsuccessFn || function(e, food) {
                console.debug(`[FMTFoodItemScreenSave] - Successfully added food: ${JSON.stringify(food)}, id ${e.target.result}`);
                pageController.closeAddFoodDynamicScreen();
                pageController.showFoods();
            };
            FMTAddFood(foodObj, mUnitsChart, onsuccessFn, onerrorFn);
            break;
        case "edit":
            onsuccessFn = onsuccessFn || function(e) {
                console.debug(`[FMTFoodItemScreenSave] - Successfully updated food: ${JSON.stringify(e.target.result)}`);
                pageController.closeEditFoodDynamicScreen();
                //pageController.showFoods();
            };
            FMTUpdateFood(optionsObj.foodId, foodObj, mUnitsChart, onsuccessFn, onerrorFn);
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
        pageController.showViewFoodDynamicScreen(foodId, multiplier, false, weightValue, weightUnits);
    }
}
//Functions - UI - Recipes
//Functions - UI - Overview
function FMTOverviewLoadCurrentDay(onsuccessFn, onerrorFn) {
    document.getElementById("overview-date-day-large").innerHTML = getDateString(fmtAppInstance.currentDay);
    document.getElementById("overview-date-day-small").innerHTML = getDateString(fmtAppInstance.currentDay);
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
        pageController.hideDynamicScreens();
    },
    showOverview: function () {pageController.setTabActive("goto-overview");},
    showFoods: function () {
        pageController.setTabActive("goto-foods");
        let onsuccessFn = function() {
            console.debug("Foods loaded successfully");
            $(".fmt-food-table-row").click(function(e) {
                const foodId = Number(e.currentTarget.getAttribute("food_id"));
                //TODO - Acceess this menu also from Overview TAB -> Check last value -> update multiplier
                pageController.showViewFoodDynamicScreen(foodId, 1, true);
            });
        };
        let onerrorFn = function(e) {
            FMTShowAlert("foods-alerts", "danger", "Failed loading food", fmtAppGlobals.defaultAlertScroll);
            console.error(e);
        };
        FMTDisplayFoodsTable(onsuccessFn, onerrorFn);
    },
    showRecipes: function () {pageController.setTabActive("goto-recipes");},
    showExport: function () {pageController.setTabActive("goto-export");},
    showImport: function () {pageController.setTabActive("goto-import");},
    showAdvanced: function () {pageController.setTabActive("goto-advanced");},
    showProfile: function () {
        pageController.setTabActive("goto-profile");
        FMTDisplayProfile(fmtAppInstance.currentProfileId);
    },
    hideDynamicScreens: function () {
        $(".fmt-dynamic-screen").hide();
        fmtAppInstance.pageState.activeDynamicScreen = null;
    },
    setDynamicScreenActive: function(dynamicScreenId) {
        if (fmtAppGlobals.dynamicScreenIds.indexOf(dynamicScreenId) < 0 ) {return;}
        $(`#${fmtAppInstance.pageState.activeTab}`).hide();
        fmtAppInstance.pageState.activeDynamicScreen = dynamicScreenId;
        $(`#${dynamicScreenId}`).show();
    },
    closeDynamicScreen: function(dynamicScreenId) {
        if (fmtAppGlobals.dynamicScreenIds.indexOf(dynamicScreenId) < 0 ) {return;}
        $(`#${fmtAppInstance.pageState.activeDynamicScreen}`).hide();
        fmtAppInstance.pageState.activeDynamicScreen = null;
        if (fmtAppInstance.pageState.activeTab != null && 
            fmtAppGlobals.tabIds.indexOf(`goto-${fmtAppInstance.pageState.activeTab}`) > -1) {
            pageController.setTabActive(`goto-${fmtAppInstance.pageState.activeTab}`);
        } else {
            console.warn(`Closed dynamic screen ${dynamicScreenId} but unexpected active Tab: ${fmtAppInstance.pageState.activeTab}`);
        }
    },
    showAddFoodDynamicScreen: function() {
        pageController.setDynamicScreenActive("add-food-screen");
        FMTFoodItemScreenClear("add-food-screen");
        FMTFoodItemScreenPopulate("add-food-screen");
    },
    closeAddFoodDynamicScreen: function() {
        pageController.closeDynamicScreen("add-food-screen");
        FMTFoodItemScreenClear("add-food-screen");
    },
    showEditFoodDynamicScreen: function(foodId) {
        if (!isNumber(foodId)) { console.error(`Food ID (${foodId}) is not a number`); return; }
        foodId = Number(foodId);
        pageController.setDynamicScreenActive("edit-food-screen");
        FMTFoodItemScreenClear("edit-food-screen");
        FMTFoodItemScreenPopulate("edit-food-screen", {"foodId": foodId});
        FMTFoodItemScreenPopulateSavedValues("edit-food-screen", foodId, 1, false, null);
        document.getElementById("edit-food-screen-delete").setAttribute("food_id", foodId);
    },
    closeEditFoodDynamicScreen: function() {
        pageController.closeDynamicScreen("edit-food-screen");
        FMTFoodItemScreenClear("edit-food-screen");
    },
    showViewFoodDynamicScreen: function(foodId, multiplier, clear, currentWeightValue, currentWeightUnits) {
        if (!isNumber(foodId)) { console.error(`Food ID (${foodId}) is not a number`); return; }
        if (!isNumber(multiplier)) { console.error(`Multiplier (${multiplier}) is not a number`); return; }
        foodId = Number(foodId);
        multiplier = Number(multiplier);
        if (clear !== false) { clear = clear || true; }
        pageController.setDynamicScreenActive("view-food-screen");
        if (clear) {
            FMTFoodItemScreenClear("view-food-screen");
            const eventListenerObj = {"view-food-screen-food-weight-units":
                                      {"massUnitChanged": FMTUpdateViewFoodValuesOnWeightChange,}
                                     };
            FMTFoodItemScreenPopulate("view-food-screen", {"foodId": foodId, "eventListenersObj": eventListenerObj });            
        }
        FMTFoodItemScreenPopulateSavedValues("view-food-screen", foodId, multiplier, true, "view-food-screen-food-weight-input", currentWeightValue, currentWeightUnits);
        document.getElementById("view-food-screen-edit").setAttribute("food_id", foodId);
    },
    closeViewFoodDynamicScreen: function() {
        pageController.closeDynamicScreen("view-food-screen");
        FMTFoodItemScreenClear("view-food-screen");
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
    FMTToday();
    FMTSetCurrentDate(fmtAppInstance.today);
    pageController.showOverview();
    prepareEventHandlers();
    FMTLoadMassUnits();
    FMTLoadAdditionalNutrients();
    FMTLoadProfile();
    FMTOverviewLoadCurrentDay();
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
        pageController.showOverview();
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
        pageController.showAddFoodDynamicScreen();
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
    $("#add-food-screen-save").click( (e) => { FMTFoodItemScreenSave("add-food-screen", "add", {}/*, onsuccessFn, onerrorFn*/); } );
    $("#edit-food-screen-cancel").click( (e) => {
        //TODO check for changes and prompt if needed
        pageController.closeEditFoodDynamicScreen();
    });
    $("#edit-food-screen-more").click( (e) => { FMTFoodItemScreenShowMore("edit-food-screen"); } );
    $("#edit-food-screen-less").click( (e) => { FMTFoodItemScreenShowLess("edit-food-screen"); } );
    $("#edit-food-screen-save").click( (e) => { 
        const foodId = Number(e.currentTarget.getAttribute("food_id"));
        if (!isNumber(foodId)) { console.error(`Food ID (${foodId}) is not a number`); return; }
        FMTFoodItemScreenSave("edit-food-screen", "edit", {"foodId": foodId}/*, onsuccessFn, onerrorFn*/); } );
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
                    pageController.showFoods();
                    FMTShowAlert("foods-alerts", "success", `Successfully deleted Food! (Food ID ${foodId})`, fmtAppGlobals.defaultAlertScroll);
                },
                              function(e) {
                    pageController.closeEditFoodDynamicScreen();
                    pageController.showFoods();
                    FMTShowAlert("foods-alerts", "danger", `Failed deleting Food! (Food ID ${foodId})`, fmtAppGlobals.defaultAlertScroll);
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
        pageController.showEditFoodDynamicScreen(foodId);
    });
    //Search functions
    $("#myfood-search").keyup( (e) => {
        let query = e.currentTarget.value;
        FMTQueryFoodsTable(query)
    });
    $(".fmt-prev-day-btn").click( (e) => { FMTPreviousDay(FMTOverviewLoadCurrentDay); } );
    $(".fmt-next-day-btn").click( (e) => { FMTNextDay(FMTOverviewLoadCurrentDay); } );
}
//Main
$(document).ready(function() {
    pageController.hideAllTabs();
    pageController.hideDynamicScreens();
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