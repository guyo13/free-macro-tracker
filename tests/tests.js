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