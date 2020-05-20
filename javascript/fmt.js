//Instance
var fmtAppInstance = {};
//Globals
var fmtAppGlobals = {};
//Globals - DB
fmtAppGlobals.fmtDb = undefined;
fmtAppGlobals.FMT_DB_NAME = "fmt";
fmtAppGlobals.FMT_DB_VER = 1;
fmtAppGlobals.FMT_DB_READONLY = "readonly";
fmtAppGlobals.FMT_DB_READWRITE = "readwrite";
//Globals - DB - Entries Store constants
fmtAppGlobals.FMT_DB_ENTRIES_STORE = "fmt_food_log";
fmtAppGlobals.FMT_DB_ENTRIES_KP = "_id";
fmtAppGlobals.FMT_DB_DATE_INDEX_NAME = "date_index";
fmtAppGlobals.FMT_DB_DATE_INDEX_KEYS = ["year", "month", "day"];
fmtAppGlobals.FMT_DB_FOODID_INDEX_NAME = "foodid_index";
fmtAppGlobals.FMT_DB_FOODID_INDEX_KEYS = "food_id";
fmtAppGlobals.FMT_DB_MEALNAME_INDEX_NAME = "mealname_index";
fmtAppGlobals.FMT_DB_MEALNAME_INDEX_KEYS = "mealName";
fmtAppGlobals.FMT_DB_PROFILE_INDEX_NAME = "profile_index";
fmtAppGlobals.FMT_DB_PROFILE_INDEX_KEYS = "profile_id";
//Globals - DB - Foods Store constants
fmtAppGlobals.FMT_DB_FOODS_STORE = "fmt_foods";
fmtAppGlobals.FMT_DB_FOODS_KP = "food_id";
fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_NAME = "food_names_index";
fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_KEYS = "foodName";
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
fmtAppGlobals.tabIds = ["goto-overview","goto-foods", "goto-profile", "goto-advanced", "goto-export", "goto-import"];
//Globals - Units
fmtAppGlobals.supportedBodyweightUnits = ["Kg", "Lbs"];
fmtAppGlobals.supportedHeightUnits = ["Cm", "Inch"];
fmtAppGlobals.sexes = ["Male", "Female"];
fmtAppGlobals.supportedActivityLevels = ["Sedentary", "Light", "Moderate", "High", "Very High", "Custom"];
fmtAppGlobals.baseMassUnitChart = [{"name": "oz", "value_in_grams": 28.34952, "description": "Ounce"},
                               {"name": "lb", "value_in_grams": 453.5924, "description": "Pound"},
                               {"name": "st", "value_in_grams": 6350.293, "description": "Stone"},
                               {"name": "mcg", "value_in_grams": 0.000001, "description": "Microgram"}, 
                               {"name": "mg", "value_in_grams": 0.001, "description": "Milligram"},
                               {"name": "g", "value_in_grams": 1, "description": "Gram"},
                               {"name": "kg", "value_in_grams": 1000, "description": "Kilogram"}
                              ];
//Globals - UI - Default
fmtAppGlobals.defaultAlertScroll = {top: 0, left: 0, behavior: 'smooth'};

//Functions
//Functions - DB
function prepareDBv1() {
    console.debug("Preparing DB...");
    if (!fmtAppGlobals.fmtDb) {
        console.error("fmt DB null reference");
        return;
    }
    //Create entries objectStore
    let fmtEntriesStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_ENTRIES_STORE,
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
    let fmtFoodsStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE,
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
    let fmtRecipesStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_RECIPES_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_RECIPES_KP, autoIncrement: true});
    fmtRecipesStore.createIndex(fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_KEYS,
                                { unique: false });
    
    //Create profile objectStore
    let fmtProfileStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_PROFILE_KP, autoIncrement: false});
    
    //Create mass units objectStore
    let fmtMassUnitStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_MUNIT_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_MUNIT_KP, autoIncrement: false});
    fmtMassUnitStore.createIndex(fmtAppGlobals.FMT_DB_MUNIT_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_MUNIT_INDEX_KEYS,
                                { unique: false });
    for (let i in fmtAppGlobals.baseMassUnitChart) {
        console.debug(`Adding Mass unit entry: ${JSON.stringify(fmtAppGlobals.baseMassUnitChart[i])}`);
        fmtMassUnitStore.add(fmtAppGlobals.baseMassUnitChart[i]);
    }
    
    //Create nutrients objectStore
    let fmtNutrientsStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_NUTRI_STORE,
                                                                {keyPath: fmtAppGlobals.FMT_DB_NUTRI_KP, autoIncrement: false});
    fmtNutrientsStore.createIndex(fmtAppGlobals.FMT_DB_NUTRI_INDEX_NAME,
                                fmtAppGlobals.FMT_DB_NUTRI_INDEX_KEYS,
                                { unique: false });
}

/**
* @param {string} store_name
* @param {string} mode either "readonly" or "readwrite"
*/
function getObjectStore(store_name, mode) {
    if (!fmtAppGlobals.fmtDb) {
        console.error("fmt DB null reference");
        return;
    }
    var tx = fmtAppGlobals.fmtDb.transaction(store_name, mode);
    return tx.objectStore(store_name);
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

//Functions - DB - Profile
function FMTReadProfile(profileId, onsuccessFn, onerrorFn) {
    if (isNaN(profileId)) {
        console.error(`Invalid profile_id ${profileId}`);
        return null;
    }
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let getRequest = profileStore.get(profileId);
    getRequest.onerror = onerrorFn;
    getRequest.onsuccess = onsuccessFn;
}

function FMTReadAllProfiles(onsuccessFn, onerrorFn) {
    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let getRequest = profileStore.getAll();
    getRequest.onerror = onerrorFn;
    getRequest.onsuccess = onsuccessFn;
}

//Functions - Generic
function isPercent(num) {
    if (!isNaN(num)) {
        if (num >= 0 && num <= 100) {return true;}
        else {return false;} 
    }
    else {return false;}
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
    let alertElem = `<div class="alert alert-${alertLevel} col-12 col-lg-4 mb-1 alert-dismissible fade show" role="alert">${msg}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>\n<div class="w-100"></div>`;
    alertDiv.innerHTML = alertElem
    if (scrollOptions) {
        window.scroll(scrollOptions);    
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
    
    if (isNaN(profile.bodyWeight)) {throw TypeError(`Invalid body weight ${profile.bodyWeight}`);}
    
    if (fmtAppGlobals.supportedBodyweightUnits.indexOf(profile.bodyWeightUnits) < 0) {
        throw TypeError(`Invalid body weight units ${profile.bodyWeightUnits}`);}
    
    switch(profile.bodyWeightUnits) {
        case "Kg":
            profile.bodyWeightKg = profile.bodyWeight;
            break;
        case "Lbs":
            profile.bodyWeightKg = profile.bodyWeight / 2.2;
            break;
    }
    
    if (isNaN(profile.height)) {throw TypeError(`Invalid height ${profile.height}`);}
    
    if (fmtAppGlobals.supportedHeightUnits.indexOf(profile.heightUnits) < 0) {
        throw TypeError(`Invalid height units ${profile.heightUnits}`);}
    
    switch(profile.heightUnits) {
        case "Cm":
            profile.heightCm = profile.height;
            break;
        case "Inch":
            profile.heightCm = profile.height * 2.54;
            break;
    }
    if (isNaN(profile.age)) {throw TypeError(`Invalid age ${profile.age}`);}
    
    if (fmtAppGlobals.sexes.indexOf(profile.sex) < 0) {throw TypeError(`Invalid sex ${profile.sex}`);}
    
    if (profile.bodyfat !== null) {
        if (isPercent(profile.bodyfat)) {
            profile.bodyfatReal = profile.bodyfat / 100;
            profile.formula = "Katch-McArdle";
        }
        else {profile.bodyfatReal = null;}
    }
    else {profile.bodyfatReal = null;}
    if (fmtAppGlobals.supportedActivityLevels.indexOf(profile.activityLevel) < 0)
        {throw TypeError(`Invalid activityLevel ${profile.activityLevel}`);}
    if (isNaN(profile.activityMultiplier)) {throw TypeError(`Invalid activity multiplier ${profile.activityMultiplier}`);}
    
    switch(profile.formula) {
        case "Katch-McArdle":
            profile.bmr = katchMcArdle(profile.bodyWeightKg, profile.bodyfatReal);
            break;
        case "Mifflin-St Jeor":
        default:
            profile.bmr = mifflinStJeor(profile.bodyWeightKg, profile.heightCm, profile.age, profile.sex);
            break;
    }
    if (profile.bmr <= 0) {throw TypeError(`Invalid BMR ${profile.bmr}`);}
    
    profile.tdee = profile.bmr * profile.activityMultiplier;
    let date = new Date();
    profile.lastModified = date.toISOString();
    profile.tzMinutes = date.getTimezoneOffset();
    FMTReadProfile(profileId,
                function(e) {
                    let res = e.target.result || {};
                    let macroSplit = res.macroSplit || null;
                    profile.macroSplit = macroSplit;
                    console.debug(res);
                    console.debug(profile);
                    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, fmtAppGlobals.FMT_DB_READWRITE);
                    let updateRequest = profileStore.put(profile);
                    updateRequest.onerror = onerrorFn || function (e) {console.error(`Failed updating Profile id ${profileId}`);};
                    updateRequest.onsuccess = onsuccessFn || function(event) {console.debug(`Profile id ${profileId} successfuly updated!`)};
                },
                function (e) {console.error(`Failed getting Profile id ${profileId}`);}
               );
    
}
function FMTUpdateMacroesForm(profileId, onsuccessFn, onerrorFn) {
    if (isNaN(profileId)) {
        throw TypeError(`Invalid profile_id ${profileId}`);
    }
    let macroSplit = {};
    let Calories = document.getElementById("profile-daily-calories").value;
    let Protein = document.getElementById("profile-macro-protein").value;
    let Carbohydrate = document.getElementById("profile-macro-carb").value;
    let Fat = document.getElementById("profile-macro-fat").value;
    FMTReadProfile(profileId,
                function(e) {
                    let res = e.target.result;
                    console.debug(res);
                    if (res === undefined) {
                        let msg = `Profile with ID ${profileId} does not exist yet. Please create it first by filling in your Personal details and then click "Save Personal Details"`;
                        return FMTShowAlert("profile-alerts", "warning", msg, fmtAppGlobals.defaultAlertScroll);
                    }
                    if (!isNaN(Calories) && Calories>0) {macroSplit.Calories = Number(Calories);}
                    else {
                        return FMTShowAlert("profile-alerts", "danger", `Invalid Calories '${Calories}'`, fmtAppGlobals.defaultAlertScroll);
                    }
                    if (isPercent(Protein) && Protein>0) {macroSplit.Protein = Number(Protein);}
                    else {
                        return FMTShowAlert("profile-alerts", "danger", `Invalid Protein Percentage '${Protein}'`, fmtAppGlobals.defaultAlertScroll);
                         }
                    if (isPercent(Carbohydrate) && Carbohydrate>0) {macroSplit.Carbohydrate = Number(Carbohydrate);}
                    else {
                        return FMTShowAlert("profile-alerts", "danger", `Invalid Carbohydrate Percentage '${Carbohydrate}'`, fmtAppGlobals.defaultAlertScroll);
                    }
                    if (isPercent(Fat) && Fat>0) {macroSplit.Fat = Number(Fat);}
                    else {
                        return FMTShowAlert("profile-alerts", "danger", `Invalid Fat Percentage '${Fat}'`, fmtAppGlobals.defaultAlertScroll);
                    }
                    let sum = macroSplit.Carbohydrate + macroSplit.Fat + macroSplit.Protein; 
                    if (sum !== 100) {
                        return FTMDisplayProfile(profileId, function(e) {
                            let msg = `The sum of Protein, Carbohydrate and Fat Percentages must equal 100, current sum is ${sum}`;
                            return FMTShowAlert("profile-alerts", "danger", msg, fmtAppGlobals.defaultAlertScroll);
                        });
                    }
                    res.macroSplit = macroSplit;
                    let profileStore = getObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, fmtAppGlobals.FMT_DB_READWRITE);
                    let updateRequest = profileStore.put(res);
                    updateRequest.onerror = onerrorFn || function (e) {console.error(`Failed updating Macro Split for Profile id ${profileId}`)};
                    updateRequest.onsuccess = onsuccessFn || function (e) {console.debug(`Macro Split for Profile id ${profileId} updated successfully`)};
                },
                function (e) {console.error(`Failed getting Profile id ${profileId}`);}
               );
}
function FTMDisplayProfile(profileId, onsuccessFn, onerrorFn) {
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
                        document.getElementById("profile-daily-calories").value = macroSplit.Calories;
                        document.getElementById("profile-macro-protein").value = macroSplit.Protein;
                        document.getElementById("profile-macro-carb").value = macroSplit.Carbohydrate;
                        document.getElementById("profile-macro-fat").value = macroSplit.Fat;
                        document.getElementById("profile-macro-protein-grams").innerHTML = `${Math.round(macroSplit.Calories * macroSplit.Protein/100 / 4)} gram`;
                        document.getElementById("profile-macro-carb-grams").innerHTML = `${Math.round(macroSplit.Calories * macroSplit.Carbohydrate/100 / 4)} gram`;
                        document.getElementById("profile-macro-fat-grams").innerHTML = `${Math.round(macroSplit.Calories * macroSplit.Fat/100 / 9)} gram`;
                    }
                    if (onsuccessFn) {onsuccessFn();}
                },
                onerrorFn || function (e) {console.error(`Failed getting Profile id ${profileId}`);}
               );
}
//Classes

//Page
var pageController = {
    hasLocalStorage: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e) {
            return false;
        }
    },
    setTabActive: function(tabName) {
        if (fmtAppGlobals.tabIds.indexOf(tabName) <0 ) {
            return;
        }
        for (const i in fmtAppGlobals.tabIds) {
            let s = "#" + fmtAppGlobals.tabIds[i];
            $(s).removeClass("active");
            let areaToHideName = "#" + fmtAppGlobals.tabIds[i].split("-")[1];
            $(areaToHideName).hide();
        }
        let active = "#" + tabName;
        $(active).addClass("active");
        let areaName = "#" + tabName.split("-")[1];
        $(areaName).show();
    },
    showOverview: function () {pageController.setTabActive("goto-overview");},
    showFoods: function () {pageController.setTabActive("goto-foods");},
    showExport: function () {pageController.setTabActive("goto-export");},
    showProfile: function () {pageController.setTabActive("goto-profile");},
};

//Functions - DB - Init
function onDbSuccess(event) {
    fmtAppGlobals.fmtDb = event.target.result;
    fmtAppInstance.currentProfileId = 1;
    //Register Event Handlers
    prepareEventHandlers();
    //Load Profile
    FMTReadAllProfiles(function(e) {
                        let profiles = e.target.result;
                        if (profiles.length === 0) {
                            console.debug("No profiles exist yet!");
                            pageController.showProfile();
                            FMTShowAlert("profile-alerts", "success", "Please create a new Profile :)", fmtAppGlobals.defaultAlertScroll);
                        }
                        else {
                            console.debug(`Selected profile id ${fmtAppInstance.currentProfileId}`);
                        }
                    },
                    function(e) {
                        let _report = JSON.stringify({"globals": fmtAppGlobals, "instance": fmtAppInstance});
                        let msg = `Failed loading profiles. Please report problem on Github and include the following data:\n${_report}`
                        FMTShowAlert("overview-alerts", "danger", msg, fmtAppGlobals.defaultAlertScroll);
                        throw ReferenceError(msg);
                    }
                   );
}

function onUpgradeNeeded(event) {
    fmtAppGlobals.fmtDb = event.target.result;
    switch(fmtAppGlobals.fmtDb.version) {
        case 1:
            prepareDBv1();
            break;
        default:
            break;
    }
}
function prepareEventHandlers() {
    //On click functions
    //Handle Tabs
    for (const i in fmtAppGlobals.tabIds) {
        let tabId = fmtAppGlobals.tabIds[i];
        $("#" + tabId).click(function () {pageController.setTabActive(tabId)});
    }
    $("#goto-profile").click( (e) => {
        FTMDisplayProfile(fmtAppInstance.currentProfileId);
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
        let onsuccessFn = function(e) {
            console.debug(`Profile ${e.target.result.profile_id} updated successfully`);
            FTMDisplayProfile(fmtAppInstance.currentProfileId)
        };
        let onerrorFn = null;
        FMTUpdateProfileForm(fmtAppInstance.currentProfileId, onsuccessFn, onerrorFn);
        });
    $("#save-profile-macro").click( (e) => {
        let onsuccessFn = function(e) {
            console.debug(`Profile ${e.target.result.profile_id} updated successfully`);
            FTMDisplayProfile(fmtAppInstance.currentProfileId)
        };
        let onerrorFn = null;
        FMTUpdateMacroesForm(fmtAppInstance.currentProfileId, onsuccessFn, onerrorFn);
        });
}
//Main
$(document).ready(function() {
    //Initialize view
    pageController.showOverview();
    
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