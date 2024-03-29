let foodObj = {foodName: "testFood", foodBrand:"test brand", referenceWeight:100, weightUnits: "g", nutritionalValue: {calories:600, proteins:33, carbohydrates:22, fats:12, additionalNutrients: null}}; //OK
let foodObj2 = {foodName: "testFood", foodBrand:"test brand", referenceWeight:100, weightUnits: "g", nutritionalValue: {calories:600, proteins:33, carbohydrates:22, fats:12, additionalNutrients: {"polysat": {"unit": "g", "mass":1.2}, "fiber": {"unit":"mg", "mass": 450}}}}; // OK with Exceptions
let foodObj3 = {foodName: "testFood", foodBrand:"test brand", referenceWeight:100, weightUnits: "g", nutritionalValue: {calories:600, proteins:33, carbohydrates:22, fats:12, additionalNutrients: {"polysat": {"units": "g", "mass":1.2}, "fiber": {"units":"mg", "mass": 450}}}};// OK
let foodObj4 = {foodName: "testFood", foodBrand:"test brand", referenceWeight:100, weightUnits: "g", nutritionalValue: {calories:600, proteins:33, carbohydrates:22, fats:12}};//OK
let foodObj5 = {foodName: "testFood", foodBrand:"test brand", referenceWeight:100, weightUnits: "g", nutritionalValue: {calories:600, proteins:33, carbohydrates:"asdasd", fats:12}};//return null
FMTValidateFoodObject(foodObj);
FMTValidateFoodObject(foodObj2);
FMTValidateFoodObject(foodObj3);
FMTValidateFoodObject(foodObj4);
FMTValidateFoodObject(foodObj5);
FMTReadAllNutrients(function(e) {let res= e.target.result.filter(function(entry) {if (entry.category === "Minerals") return true;} ); console.log(res);});


function mealEntryAddTest(mepd, pidstart, pidstop, dstart, dstop, direction) {
    var count = 0;
    let mealObj= {};
    let mealNames = ["Breakfast", "Snack 1", "Snack 2", "Lunch", "Dinner"];
    let nutritionalValues = [{calories:60, proteins:12, carbohydrates:3, fats:5},
                             {calories:600, proteins:33, carbohydrates:22, fats:12, additionalNutrients: null},
                             {calories:550, proteins:20, carbohydrates:15, fats:3, additionalNutrients: { "Minerals": [{"name":"Calcium", "mass":10, "unit":"mg"},                                                                                                                                     {"name":"Chloride", "mass":15 ,"unit":"mg"}],
                                                                                                          "Amino Acids":[{"name":"Alanine", "mass":1500, "unit":"mg"},                                                      {"name":"Arginine", "mass":2000, "unit":"mg"}]
                                                                                                        }
                             },
                             {calories:425, proteins:18, carbohydrates:32.5, fats:5.5, additionalNutrients: {}}
                            ];
    const startTime = Date.now();
    mepd = mepd || 100;
    pidstart = pidstart || 1;
    pidstop = pidstop || 3;
    dstart = dstart || 1;
    dstop = dstop || 31;
    direction = direction || 1;

    for (let pid=pidstart; pid<pidstop; pid++) {

        mealObj.profile_id = pid;

        for (let d=dstart; d<dstop; d++) {
            let date = new Date();
            date.setDate(date.getDate() + d*direction);
            for (let i=0; i<mepd; i++) {
                mealObj.year = date.getFullYear();
                mealObj.month = date.getMonth();
                mealObj.day = date.getDate();
                let r = Math.floor(Math.random() + Math.random()*4);
                mealObj.mealName = mealNames[r];
                mealObj.consumable_id = Math.round(Math.random()*10000);
                let k = Math.random();
                mealObj.consumableBrand = (k < 0.5 ? null : "Test Brand");
                mealObj.consumableType = (k < 0.5 ? "Food Item" : "Recipe Item");
                mealObj.weight = Math.round(50 + Math.random() * 300);
                mealObj.weightUnits = "g";
                r = Math.floor(Math.random() + Math.random()*3);
                mealObj.nutritionalValue = nutritionalValues[r];
                mealObj.consumableName = `consumable ${r}` ;
                FMTAddMealEntry(mealObj);
            }
        }
    }
    const mealEntriesStore = getObjectStore(fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE, fmtAppGlobals.FMT_DB_READONLY);
    let request  = mealEntriesStore.openCursor();
    request.onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        count++;
        cursor.continue();
      } else {
        const endTime = Date.now();
        console.log(`Meal Entry count - ${count} == ${(pidstop-pidstart)*(dstop-dstart)*mepd} ? ${count == (pidstop-pidstart)*(dstop-dstart)*mepd}. Run time - ${(endTime - startTime)/1000} Seconds.`);
        navigator.storage.estimate().then((e) => {console.log(`Quota: ${e.quota/1000000} MB, Usage: ${e.usage/1000000} MB`)});
      }
    };
}
//mealEntryAddTest(50, 1, 2, -3, 31, 1);

console.log(fmtAppInstance.pageState.activeDynamicScreens)
console.log(pageController.updateZIndexes(true))
console.log(pageController.updateZIndexes())

function downloadData(fileName) {
		var link = document.createElement('a');
    link.setAttribute('download', fileName);
    link.href = fmtAppExport;
    //document.body.appendChild(link);
		link.click();
	}
FMTDataToStructuredJSON(function(records) {
  FMTExportToJSONBlob(records, function() { downloadData("FmtExport_Structured.json"); });
});
FMTDataToJSONArray(function(records) {
  FMTExportToJSONBlob(records, function() { downloadData("FmtExport_array.json"); });
});
setInterval(() => {document.getElementById("overview-date-next-day-lg").click()}, 50);

function testImport() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "application/json");
  input.onchange = function(e) {
    const fileList = input.files;
    console.log(input);
    if (fileList.length < 1) {
      console.log("empty file list");
      return
    }
    const file = fileList[0];
    const fileReader = new FileReader();
    fileReader.onloadend = function() {
      FMTImportFromStructuredJSON(fileReader.result);
    };
    fileReader.readAsText(file);
 };
  document.getElementById("overview").appendChild(input);
}
function testSumNutiValAndRecipe() {
  foods = null;
  FMTReadAllFoods(function(e) {
    foods = e.target.result;
    let nutri = [];
    foods.forEach( (f) => {
      nutri.push(f.nutritionalValue);
    });
    console.log(FMTSumNutritionalValues(nutri));
    const recipeObj = {};
    recipeObj.recipeName = "Test Recipe";
    recipeObj.recipeDescription = "A test recipe to check its working";
    recipeObj.recipeCreator = "Guy Or"
    recipeObj.referenceWeight = 1;
    recipeObj.weightUnits = "kg";
    recipeObj.ingredients = foods;
    recipeObj.preparationSteps = ["Design flows", "write backend", "fix bugs", "make UI", "refine UI", "fix bugs"];
    recipeObj.website = "https://www.guyor.net";
    FMTAddRecipe(recipeObj, function(e) {console.log(e.target.result);});
  });
}
