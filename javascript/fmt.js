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
//Globals - DB - Foods Store constants
fmtAppGlobals.FMT_DB_FOODS_STORE = "fmt_foods";
fmtAppGlobals.FMT_DB_FOODS_KP = "food_id";
fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_NAME = "food_names_index";
fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_KEYS = "foodName";
fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_NAME = "macroes_index";
fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_KEYS = ["nutritionalValue.calories",
                                           "nutritionalValue.macronutrients.proteins",
                                           "nutritionalValue.macronutrients.carbohydrates",
                                           "nutritionalValue.macronutrients.fats"];
//Globals - DB - Recipes Store constants
fmtAppGlobals.FMT_DB_RECIPES_STORE = "fmt_recipes";
fmtAppGlobals.FMT_DB_RECIPES_KP = "recipe_id";
fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_NAME = "recipe_names_index";
fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_KEYS = "recipe_name";
//Globals - DB - Profile Store constants
fmtAppGlobals.FMT_DB_PROFILE_STORE = "fmt_profile";
fmtAppGlobals.FMT_DB_PROFILE_KP = ["year", "month", "day"];
fmtAppGlobals.FMT_PROFILE_INDEX_NAME = "profile_index";
fmtAppGlobals.FMT_PROFILE_INDEX_KEYS = [];

//Globals - Page
fmtAppGlobals.tabIds = ["goto-overview","goto-foods", "goto-profile", "goto-export", "goto-import"];

//Functions
function prepareDb() {
    console.debug("Preparing DB...");
    if (!fmtAppGlobals.fmtDb) {
        console.error("fmt DB null reference");
        return;
    }
    //Create entries objectStore
    let fmtEntriesStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_ENTRIES_STORE, {keyPath: fmtAppGlobals.FMT_DB_ENTRIES_KP, autoIncrement: true});
    fmtEntriesStore.createIndex(fmtAppGlobals.FMT_DB_DATE_INDEX_NAME, fmtAppGlobals.FMT_DB_DATE_INDEX_KEYS, { unique: false });
    fmtEntriesStore.createIndex(fmtAppGlobals.FMT_DB_FOODID_INDEX_NAME, fmtAppGlobals.FMT_DB_FOODID_INDEX_KEYS, { unique: false });
    fmtEntriesStore.createIndex(fmtAppGlobals.FMT_DB_MEALNAME_INDEX_NAME, fmtAppGlobals.FMT_DB_MEALNAME_INDEX_KEYS, { unique: false });
    
    //Create foods objectStore
    let fmtFoodsStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_FOODS_STORE, {keyPath: fmtAppGlobals.FMT_DB_FOODS_KP, autoIncrement: true});
    fmtFoodsStore.createIndex(fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_NAME, fmtAppGlobals.FMT_DB_FOOD_NAMES_INDEX_KEYS, { unique: false });
    for (let i in fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_KEYS) {
        fmtFoodsStore.createIndex(`${fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_NAME}_${i}`, fmtAppGlobals.FMT_DB_FOOD_MACROES_INDEX_KEYS[i], { unique: false});
    }
    
    //Create recipes objectStore
    let fmtRecipesStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_RECIPES_STORE, {keyPath: fmtAppGlobals.FMT_DB_RECIPES_KP, autoIncrement: true});
    fmtRecipesStore.createIndex(fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_NAME, fmtAppGlobals.FMT_DB_RECIPE_NAMES_INDEX_KEYS, { unique: false });
    
    //Create profile objectStore
    let fmtProfileStore = fmtAppGlobals.fmtDb.createObjectStore(fmtAppGlobals.FMT_DB_PROFILE_STORE, {keyPath: fmtAppGlobals.FMT_DB_PROFILE_KP, autoIncrement: false});
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

function onDbSuccess(event) {
    fmtAppGlobals.fmtDb = event.target.result;
}

function onUpgradeNeeded(event) {
    fmtAppGlobals.fmtDb = event.target.result;
    switch(fmtAppGlobals.fmtDb.version) {
        case 1:
            prepareDb();
            break;
        default:
            break;
    }
}

function FMTAddEntry(entryObject) {
    //Each entryObject should contain -
    /*
     * @param {int} year
     * @param {int} month
     * @param {int} day
     * @param {int} food_id
     * @param {int} weight
     * @param {String} weightUnits optional - must be translatable to weight unit defined by the Food identified by foodId
     * @param {String} mealName
     */
    //TODO validate object
    let entriesStore = getObjectStore(fmtAppGlobals.FMT_DB_ENTRIES_STORE, fmtAppGlobals.FMT_DB_READWRITE);
    let date = new Date();
    entryObject.lastModified = date.toISOString();
    entryObject.tzMinutes = date.getTimezoneOffset();
    let addRequest = entriesStore.add(entryObject);
    
}
function FMTUpdateEntry(entryObject, entry_id) {
    //Each entryObject should contain -
    /*
     * @param {int} year
     * @param {int} month
     * @param {int} day
     * @param {int} food_id
     * @param {int} weight
     * @param {String} weightUnits optional - must be translatable to weight unit defined by the Food identified by foodId
     * @param {String} mealName
     */
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
    let updateRequest = entriesStore.delete(entry_id);
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

//Main
$(document).ready(function() {
    //Handle Tabs
    for (const i in fmtAppGlobals.tabIds) {
        let tabId = fmtAppGlobals.tabIds[i];
        $("#" + tabId).click(function () {pageController.setTabActive(tabId)});
    }
    
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