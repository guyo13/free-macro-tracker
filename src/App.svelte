<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import unitRepositoryProvider, {
    type IUnitRepository,
  } from "./db/unitRepository";
  import { onMount } from "svelte";
  import {
    FMTToday,
    prepareEventHandlers,
    pageController,
    platformInterface,
  } from "./fmt";
  import fmtAppInstance from "./app/instance";
  import { createUnitChart, type IUnit } from "./models/units";
  import repositoriesProvider from "./db/repositoriesProvider";
  import nutrientRepositoryProvider, {
    type INutrientRepository,
  } from "./db/nutrientRepository";
  import type { INutrientDefinition } from "./models/nutrient";
  import profileRepositoryProvider, {
    type IProfileRepository,
  } from "./db/profileRepository";
  import type { RecordId } from "./models/record";
  import type { IUserProfile } from "./models/userProfile";
  import SplashScreen from "./components/SplashScreen.svelte";
  import OnboardingScreen from "./components/OnboardingScreen.svelte";
  import { hasLocalStorage } from "./utils/browser";
  import Navbar from "./components/Navbar.svelte";
  import Settings from "./components/pages/Settings.svelte";
  import Dashboard from "./components/pages/Dashboard.svelte";
  import Profile from "./components/pages/Profile.svelte";
  import FoodsAndRecipes from "./components/pages/FoodsAndRecipes.svelte";

  const DEFAULT_PROFILE_ID = 1;
  let isLoading = true;
  let isOnboarding = false;

  function setUnitChart(units: IUnit[]) {
    fmtAppInstance.unitsChart = createUnitChart(units);
    console.debug(
      `Units loaded into Application instance ${JSON.stringify(
        fmtAppInstance.unitsChart
      )}`
    );
  }

  function setAdditionalNutrients(nutrients: INutrientDefinition[]) {
    fmtAppInstance.additionalNutrients = {};
    const categories = new Set(nutrients.map((x) => x.category));
    for (const category of categories.values()) {
      fmtAppInstance.additionalNutrients[category] = [];
    }
    for (const nutrientDefinition of nutrients) {
      const category = nutrientDefinition.category;
      fmtAppInstance.additionalNutrients[category].push(nutrientDefinition);
    }
    console.debug(
      `Additional Nutrients loaded into Application instance ${JSON.stringify(
        fmtAppInstance.additionalNutrients
      )}`
    );
  }

  // TODO - Refactor into reactive variable
  function setCurrentProfileId(id: RecordId) {
    fmtAppInstance.currentProfileId = id;
  }
  // TODO - Refactor into reactive variable
  function setCurrentProfile(userProfile: IUserProfile) {
    fmtAppInstance.currentProfile = userProfile;
  }

  // TODO - Use a Store?
  function setSkipProfile() {
    if (hasLocalStorage()) {
      window.localStorage.setItem("profileCreationSkippedByUser", "true");
    }
  }

  function isProfileCreationSkippedByUser() {
    return (
      hasLocalStorage() &&
      window.localStorage.getItem("profileCreationSkippedByUser") == "true"
    );
  }

  function handleSkipProfileCreationClick() {
    pageController.showOverview();
    setSkipProfile();
    isOnboarding = false;
  }

  function handleCreateProfileClick() {
    pageController.showProfile();
    isOnboarding = false;
  }

  // Called when the app has finished loading.
  // Notifies the platform when finished loading.
  function onAppFinishedLoading() {
    console.debug(`${platformInterface.platform} platform interface detected!`);
    if (platformInterface.hasPlatformInterface) {
      platformInterface.FMTFinishedLoading();
    }
  }

  onMount(() => {
    pageController.hideAllTabs();
    pageController.closeDynamicScreens();
    prepareEventHandlers();
    const unsubscribe = repositoriesProvider
      .synced([
        unitRepositoryProvider,
        nutrientRepositoryProvider,
        profileRepositoryProvider,
      ])
      .subscribe(async (repositories) => {
        if (!repositories) return;
        const [unitRepository, nutrientRepository, profileRepository] =
          repositories as [
            IUnitRepository,
            INutrientRepository,
            IProfileRepository
          ];

        try {
          // TODO - Temporary so that we can use existing DB methods before implementing all repositories.
          fmtAppInstance.fmtDb = unitRepository.connection.idbInstance;
          const userUnits = await unitRepository.getAllUnits();
          console.debug(`Successfully read all units`);
          setUnitChart(userUnits);
          const additionalNutrients =
            await nutrientRepository.getAllNutrients();
          setAdditionalNutrients(additionalNutrients);

          // TODO - Remove this
          setCurrentProfileId(DEFAULT_PROFILE_ID);
          const userProfile = await profileRepository.getProfile(
            DEFAULT_PROFILE_ID
          );
          setCurrentProfile(userProfile);
          if (userProfile || isProfileCreationSkippedByUser()) {
            pageController.showOverview(true);
            onAppFinishedLoading();
          } else {
            console.warn("No user Profile could be loaded");
            FMTToday();
            fmtAppInstance.currentDay = fmtAppInstance.today;
            onAppFinishedLoading();
            isOnboarding = true;
          }
        } catch (err) {
          console.error(err);
        } finally {
          isLoading = false;
        }
      });
    return unsubscribe;
  });
</script>

{#if isLoading}
  <SplashScreen />
{:else if isOnboarding}
  <OnboardingScreen
    onSkipProfileClick={handleSkipProfileCreationClick}
    onCreateProfileClick={handleCreateProfileClick}
  />
{/if}
<main class={isLoading || isOnboarding ? "d-none" : ""}>
  <Dashboard/>
  <FoodsAndRecipes/>
  <Profile/>
  <Settings />
  <!--Dynamic Screens-->
  <div id="add-food-screen" class="fmt-dynamic-screen container-fluid">
    <div id="add-food-screen-alerts" class="row justify-content-center" />
    <div class="fmt-column full-height">
      <!-- Heading -->
      <div class="row justify-content-center mt-3 fmt-flex-1">
        <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
          <div class="fmt-flex-4 fmt-truncate">
            <span class="fmt-font-2">Add Food</span>
          </div>
          <div
            id="add-food-screen-cancel"
            class="fmt-flex-1 fmt-right-text"
            style="cursor: pointer;"
          >
            <button class="fal fa-times btn fmt-text-btn1" type="button" />
          </div>
        </div>
      </div>
      <!-- Content -->
      <div
        id="add-food-screen-content"
        class="row justify-content-center fmt-screen-content fmt-align-start fmt-flex-11"
      >
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Item Name"
              id="add-food-screen-food-name"
              required
            />
            <label for="add-food-screen-food-name" class="form__label"
              >Item Name</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Item Brand"
              id="add-food-screen-food-brand"
              required
            />
            <label for="add-food-screen-food-brand" class="form__label"
              >Brand</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex" id="add-food-screen-food-serving">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Serving Size"
              id="add-food-screen-food-serving-input"
              required
            />
            <label for="add-food-screen-food-serving-input" class="form__label"
              >Serving</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <h4 class="fmt-font-2">Nutritional Facts</h4>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Calories"
              id="add-food-screen-food-calories"
              required
            />
            <label for="add-food-screen-food-calories" class="form__label"
              >Calories</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Proteins"
              id="add-food-screen-food-proteins"
              required
            />
            <label for="add-food-screen-food-proteins" class="form__label"
              >Proteins</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Carbohydrates"
              id="add-food-screen-food-carbohydrates"
              required
            />
            <label for="add-food-screen-food-carbohydrates" class="form__label"
              >Carbohydrates</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Fats"
              id="add-food-screen-food-fats"
              required
            />
            <label for="add-food-screen-food-fats" class="form__label"
              >Fats</label
            >
          </div>
        </div>
        <div
          id="add-food-screen-food-microes"
          class="col-12 col-lg-8 fmt-no-pad d-none mt-1"
        >
          <div class="col-12 col-lg-8 mb-1">
            <h4 class="fmt-font-1-5">Micronutrients</h4>
          </div>
          <div id="add-food-screen-food-additional" class="col-12 col-lg-8" />
        </div>
      </div>
      <!-- Footer -->
      <div
        id="add-food-screen-footer"
        class="row justify-content-center fmt-align-end fmt-flex-1 mb-1"
      >
        <div class="col-12 col-lg-8 d-flex">
          <div class="input-group fmt-flex-1">
            <button
              id="add-food-screen-save"
              class="btn btn-outline-primary flex-fill ml-1 mr-1"
              type="button">Save Food</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="add-food-screen-more"
              class="btn btn-outline-dark flex-fill"
              type="button">Show More</button
            >
            <button
              id="add-food-screen-less"
              class="btn btn-outline-dark flex-fill d-none"
              type="button">Show Less</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="edit-food-screen" class="fmt-dynamic-screen container-fluid">
    <div id="edit-food-screen-alerts" class="row justify-content-center" />
    <div class="fmt-column full-height">
      <!-- Heading -->
      <div class="row justify-content-center mt-3 fmt-flex-1">
        <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
          <div class="fmt-flex-4 fmt-truncate">
            <span id="edit-food-screen-heading" class="fmt-font-2"
              >Edit Food</span
            >
          </div>
          <div
            id="edit-food-screen-cancel"
            class="fmt-flex-1 fmt-right-text"
            style="cursor: pointer;"
          >
            <button class="fal fa-times btn fmt-text-btn1" type="button" />
          </div>
        </div>
      </div>
      <!-- Content -->
      <div
        id="edit-food-screen-content"
        class="row justify-content-center fmt-screen-content fmt-align-start fmt-flex-11"
      >
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Item Name"
              id="edit-food-screen-food-name"
              required
            />
            <label for="edit-food-screen-food-name" class="form__label"
              >Item Name</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Item Brand"
              id="edit-food-screen-food-brand"
              required
            />
            <label for="edit-food-screen-food-brand" class="form__label"
              >Brand</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex" id="edit-food-screen-food-serving">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Serving Size"
              id="edit-food-screen-food-serving-input"
              required
            />
            <label for="edit-food-screen-food-serving-input" class="form__label"
              >Serving</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <h4 class="fmt-font-2">Nutritional Facts</h4>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Calories"
              id="edit-food-screen-food-calories"
              required
            />
            <label for="edit-food-screen-food-calories" class="form__label"
              >Calories</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Proteins"
              id="edit-food-screen-food-proteins"
              required
            />
            <label for="edit-food-screen-food-proteins" class="form__label"
              >Proteins</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Carbohydrates"
              id="edit-food-screen-food-carbohydrates"
              required
            />
            <label for="edit-food-screen-food-carbohydrates" class="form__label"
              >Carbohydrates</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Fats"
              id="edit-food-screen-food-fats"
              required
            />
            <label for="edit-food-screen-food-fats" class="form__label"
              >Fats</label
            >
          </div>
        </div>
        <div
          id="edit-food-screen-food-microes"
          class="col-12 col-lg-8 fmt-no-pad d-none mt-1"
        >
          <div class="col-12 col-lg-8 mb-1">
            <h4 class="fmt-font-1-5">Micronutrients</h4>
          </div>
          <div id="edit-food-screen-food-additional" class="col-12 col-lg-8" />
        </div>
      </div>
      <!-- Footer -->
      <div
        id="edit-food-screen-footer"
        class="row justify-content-center fmt-align-end fmt-flex-1 mb-1"
      >
        <div class="col-12 col-lg-8 d-flex">
          <div class="input-group fmt-flex-1">
            <button
              id="edit-food-screen-delete"
              class="btn btn-danger flex-fill"
              type="button">Delete</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="edit-food-screen-save"
              class="btn btn-outline-primary flex-fill ml-1 mr-1"
              type="button">Save</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="edit-food-screen-more"
              class="btn btn-outline-dark flex-fill"
              type="button">More</button
            >
            <button
              id="edit-food-screen-less"
              class="btn btn-outline-dark flex-fill d-none"
              type="button">Less</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="view-food-screen" class="fmt-dynamic-screen container-fluid">
    <div id="view-food-screen-alerts" class="row justify-content-center" />
    <div class="fmt-column full-height">
      <!-- Heading -->
      <div class="row justify-content-center mt-3 fmt-flex-1">
        <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
          <div class="fmt-flex-4 fmt-truncate">
            <span id="view-food-screen-heading" class="fmt-font-2"
              >View Food</span
            >
          </div>
          <div
            id="view-food-screen-cancel"
            class="fmt-flex-1 fmt-right-text"
            style="cursor: pointer;"
          >
            <button class="fal fa-times btn fmt-text-btn1" type="button" />
          </div>
        </div>
      </div>
      <!-- Content -->
      <div
        id="view-food-screen-content"
        class="row justify-content-center fmt-screen-content fmt-align-start fmt-flex-11"
      >
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex fmt-align-start fmt-space-between">
            <div
              class="fmt-flex-column fmt-align-center fmt-font-color-primary"
            >
              <span>Calories</span>
              <span id="view-food-screen-food-calories" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-violet">
              <span>Carbs</span>
              <span id="view-food-screen-food-carbohydrates" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-info">
              <span>Proteins</span>
              <span id="view-food-screen-food-proteins" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-orange">
              <span>Fats</span>
              <span id="view-food-screen-food-fats" />
            </div>
          </div>
        </div>
        <div
          id="view-food-screen-add-to-meal"
          class="row justify-content-center d-none"
        >
          <div class="col-12 col-lg-8 mb-1">
            <div class="form__group d-flex">
              <input
                type="number"
                class="form__field fmt-input-field"
                placeholder="Meal Year"
                id="view-food-screen-meal-year"
                required
              />
              <label for="view-food-screen-meal-year" class="form__label"
                >Year</label
              >
            </div>
          </div>
          <div class="col-12 col-lg-8 mb-1">
            <div class="form__group d-flex">
              <input
                type="number"
                class="form__field fmt-input-field"
                placeholder="Meal Month"
                id="view-food-screen-meal-month"
                required
              />
              <label for="view-food-screen-meal-month" class="form__label"
                >Month (1-12)</label
              >
            </div>
          </div>
          <div class="col-12 col-lg-8 mb-1">
            <div class="form__group d-flex">
              <input
                type="number"
                class="form__field fmt-input-field"
                placeholder="Meal Day"
                id="view-food-screen-meal-day"
                required
              />
              <label for="view-food-screen-meal-day" class="form__label"
                >Day (1-31)</label
              >
            </div>
          </div>
          <div class="col-12 col-lg-8 mb-1">
            <div class="form__group d-flex">
              <input
                type="text"
                class="form__field fmt-input-field"
                placeholder="Meal Name"
                id="view-food-screen-meal-name"
                required
              />
              <label for="view-food-screen-meal-name" class="form__label"
                >Meal Name</label
              >
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Item Name"
              id="view-food-screen-food-name"
              required
            />
            <label for="view-food-screen-food-name" class="form__label"
              >Description</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Item Brand"
              id="view-food-screen-food-brand"
              required
            />
            <label for="view-food-screen-food-brand" class="form__label"
              >Brand</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex" id="view-food-screen-food-serving">
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Serving Size"
              id="view-food-screen-food-serving-input"
              required
            />
            <label for="view-food-screen-food-serving-input" class="form__label"
              >Serving</label
            >
          </div>
        </div>
        <div
          id="view-food-screen-food-microes"
          class="col-12 col-lg-8 fmt-no-pad d-none mt-1"
        >
          <div class="col-12 col-lg-8 mb-1">
            <h4 class="fmt-font-1-5">Micronutrients</h4>
          </div>
          <div id="view-food-screen-food-additional" class="col-12 col-lg-8" />
        </div>
      </div>
      <!-- Footer -->
      <div
        id="view-food-screen-footer"
        class="row justify-content-center fmt-align-end fmt-flex-1 mb-1"
      >
        <div class="col-12 col-lg-8 d-flex">
          <div class="input-group fmt-flex-1">
            <button
              id="view-food-screen-edit"
              class="btn btn-outline-dark flex-fill"
              type="button">Edit</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <!--Add To Meal-->
            <button
              id="view-food-screen-save"
              class="btn btn-outline-success flex-fill ml-1 mr-1"
              type="button">Add</button
            >
            <!--Add Ingredient-->
            <button
              id="view-food-screen-add"
              class="btn btn-outline-success flex-fill ml-1 mr-1 d-none"
              type="button">Add</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="view-food-screen-more"
              class="btn btn-outline-dark flex-fill"
              type="button">More</button
            >
            <button
              id="view-food-screen-less"
              class="btn btn-outline-dark flex-fill d-none"
              type="button">Less</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="add-recipe-screen" class="fmt-dynamic-screen container-fluid">
    <div id="add-recipe-screen-alerts" class="row justify-content-center" />
    <div class="fmt-column full-height">
      <!-- Heading -->
      <div class="row justify-content-center mt-3 fmt-flex-1">
        <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
          <div class="fmt-flex-4">
            <h4 class="fmt-font-2">Create Recipe</h4>
          </div>
          <div
            id="add-recipe-screen-cancel"
            class="fmt-flex-1 fmt-right-text"
            style="cursor: pointer;"
          >
            <button class="fal fa-times btn fmt-text-btn1" type="button" />
          </div>
        </div>
      </div>
      <!-- Content -->
      <div
        id="add-recipe-screen-content"
        class="row justify-content-center fmt-screen-content fmt-align-start fmt-flex-11"
      >
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex fmt-align-start fmt-space-between">
            <div
              class="fmt-flex-column fmt-align-center fmt-font-color-primary"
            >
              <span>Calories</span>
              <span id="add-recipe-screen-recipe-calories" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-violet">
              <span>Carbs</span>
              <span id="add-recipe-screen-recipe-carbohydrates" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-info">
              <span>Proteins</span>
              <span id="add-recipe-screen-recipe-proteins" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-orange">
              <span>Fats</span>
              <span id="add-recipe-screen-recipe-fats" />
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Recipe Name"
              id="add-recipe-screen-recipe-name"
              required
            />
            <label for="add-recipe-screen-recipe-name" class="form__label"
              >Recipe Name</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Creator"
              id="add-recipe-screen-recipe-brand"
              required
            />
            <label for="add-recipe-screen-recipe-brand" class="form__label"
              >Creator (Optional)</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex" id="add-recipe-screen-recipe-serving">
            <input
              type="number"
              class="form__field fmt-input-field-select"
              placeholder="Serving Size"
              id="add-recipe-screen-recipe-serving-input"
              required
            />
            <label
              for="add-recipe-screen-recipe-serving-input"
              class="form__label">Serving Size</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <textarea
              type="text"
              class="form__field fmt-input-field"
              placeholder="Description"
              id="add-recipe-screen-recipe-description"
              required
            />
            <label
              for="add-recipe-screen-recipe-description"
              class="form__label">Description</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mt-1">
          <h4 class="fmt-font-1-5">Ingredients</h4>
        </div>
        <div
          id="add-recipe-screen-recipe-ingredients"
          class="col-12 col-lg-8 mb-1"
        >
          <button
            id="add-recipe-screen-recipe-ingredients-add"
            class="fmt-input-field btn fmt-btn-outline-gray flex-fill fmt-btn-no-focus fmt-form-btn mt-2"
            type="button">Add Ingredient</button
          >
        </div>
        <div class="col-12 col-lg-8 mt-1">
          <h4 class="fmt-font-1-5">Preparation Steps</h4>
        </div>
        <div
          id="add-recipe-screen-recipe-preparation-steps"
          class="col-12 col-lg-8 mb-1"
        >
          <button
            id="add-recipe-screen-recipe-preparation-steps-add"
            class="fmt-input-field btn fmt-btn-outline-gray flex-fill fmt-btn-no-focus fmt-form-btn mt-2"
            type="button">Add Step</button
          >
        </div>
        <div class="col-12 col-lg-8 mt-1">
          <h4 class="fmt-font-1-5">Social Media</h4>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Video URL"
              id="add-recipe-screen-recipe-video-url"
              required
            />
            <label for="add-recipe-screen-recipe-video-url" class="form__label"
              >Video Link</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Website Link"
              id="add-recipe-screen-recipe-website"
              required
            />
            <label for="add-recipe-screen-recipe-website" class="form__label"
              >Website Link</label
            >
          </div>
        </div>
        <div
          id="add-recipe-screen-recipe-microes"
          class="col-12 col-lg-8 fmt-no-pad d-none mt-1"
        >
          <div class="col-12 col-lg-8 mb-1">
            <h4 class="fmt-font-1-5">Micronutrients</h4>
          </div>
          <div
            id="add-recipe-screen-recipe-additional"
            class="col-12 col-lg-8"
          />
        </div>
      </div>
      <!-- Footer -->
      <div
        id="add-recipe-screen-footer"
        class="row justify-content-center fmt-align-end fmt-flex-1 mb-1"
      >
        <div class="col-12 col-lg-8 d-flex">
          <div class="input-group fmt-flex-1">
            <button
              id="add-recipe-screen-save"
              class="btn btn-outline-primary flex-fill mr-1"
              type="button">Save Recipe</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="add-recipe-screen-more"
              class="btn btn-outline-dark flex-fill"
              type="button">Show More</button
            >
            <button
              id="add-recipe-screen-less"
              class="btn btn-outline-dark flex-fill d-none"
              type="button">Show Less</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="view-recipe-screen" class="fmt-dynamic-screen container-fluid">
    <div id="view-recipe-screen-alerts" class="row justify-content-center" />
    <div class="fmt-column full-height">
      <!-- Heading -->
      <div class="row justify-content-center mt-3 fmt-flex-1">
        <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
          <div class="fmt-flex-4 fmt-truncate">
            <span id="view-recipe-screen-heading" class="fmt-font-2"
              >View Recipe</span
            >
          </div>
          <div
            id="view-recipe-screen-cancel"
            class="fmt-flex-1 fmt-right-text"
            style="cursor: pointer;"
          >
            <button class="fal fa-times btn fmt-text-btn1" type="button" />
          </div>
        </div>
      </div>
      <!-- Content -->
      <div
        id="view-recipe-screen-content"
        class="row justify-content-center fmt-screen-content fmt-align-start fmt-flex-11"
      >
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex fmt-align-start fmt-space-between">
            <div
              class="fmt-flex-column fmt-align-center fmt-font-color-primary"
            >
              <span>Calories</span>
              <span id="view-recipe-screen-recipe-calories" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-violet">
              <span>Carbs</span>
              <span id="view-recipe-screen-recipe-carbohydrates" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-info">
              <span>Proteins</span>
              <span id="view-recipe-screen-recipe-proteins" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-orange">
              <span>Fats</span>
              <span id="view-recipe-screen-recipe-fats" />
            </div>
          </div>
        </div>
        <div
          id="view-recipe-screen-add-to-meal"
          class="row justify-content-center d-none"
        >
          <div class="col-12 col-lg-8 mb-1">
            <div class="form__group d-flex">
              <input
                type="number"
                class="form__field fmt-input-field"
                placeholder="Meal Year"
                id="view-recipe-screen-meal-year"
                required
              />
              <label for="view-recipe-screen-meal-year" class="form__label"
                >Year</label
              >
            </div>
          </div>
          <div class="col-12 col-lg-8 mb-1">
            <div class="form__group d-flex">
              <input
                type="number"
                class="form__field fmt-input-field"
                placeholder="Meal Month"
                id="view-recipe-screen-meal-month"
                required
              />
              <label for="view-recipe-screen-meal-month" class="form__label"
                >Month (1-12)</label
              >
            </div>
          </div>
          <div class="col-12 col-lg-8 mb-1">
            <div class="form__group d-flex">
              <input
                type="number"
                class="form__field fmt-input-field"
                placeholder="Meal Day"
                id="view-recipe-screen-meal-day"
                required
              />
              <label for="view-recipe-screen-meal-day" class="form__label"
                >Day (1-31)</label
              >
            </div>
          </div>
          <div class="col-12 col-lg-8 mb-1">
            <div class="form__group d-flex">
              <input
                type="text"
                class="form__field fmt-input-field"
                placeholder="Meal Name"
                id="view-recipe-screen-meal-name"
                required
              />
              <label for="view-recipe-screen-meal-name" class="form__label"
                >Meal Name</label
              >
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Recipe Name"
              id="view-recipe-screen-recipe-name"
              required
            />
            <label for="view-recipe-screen-recipe-name" class="form__label"
              >Recipe Name</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Creator"
              id="view-recipe-screen-recipe-brand"
              required
            />
            <label for="view-recipe-screen-recipe-brand" class="form__label"
              >Creator</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div
            class="form__group d-flex"
            id="view-recipe-screen-recipe-serving"
          >
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Serving Size"
              id="view-recipe-screen-recipe-serving-input"
              required
            />
            <label
              for="view-recipe-screen-recipe-serving-input"
              class="form__label">Serving Size</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <textarea
              type="text"
              class="form__field fmt-input-field"
              placeholder="Description"
              id="view-recipe-screen-recipe-description"
              required
              readonly={true}
            />
            <label
              for="view-recipe-screen-recipe-description"
              class="form__label">Description</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mt-1">
          <h4 class="fmt-font-1-5">Ingredients</h4>
        </div>
        <div
          id="view-recipe-screen-recipe-ingredients"
          class="col-12 col-lg-8 mb-1"
        >
          <button
            id="view-recipe-screen-recipe-ingredients-add"
            class="d-none"
            type="button">Add Ingredient</button
          >
        </div>
        <div class="col-12 col-lg-8 mt-1">
          <h4 class="fmt-font-1-5">Preparation Steps</h4>
        </div>
        <div
          id="view-recipe-screen-recipe-preparation-steps"
          class="col-12 col-lg-8 mb-1"
        >
          <button
            id="view-recipe-screen-recipe-preparation-steps-add"
            class="d-none"
            type="button">Add Step</button
          >
        </div>
        <div class="col-12 col-lg-8 mt-1">
          <h4 class="fmt-font-1-5">Social Media</h4>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Video URL"
              id="view-recipe-screen-recipe-video-url"
              required
              readonly={true}
            />
            <label for="view-recipe-screen-recipe-video-url" class="form__label"
              >Video Link</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Website Link"
              id="view-recipe-screen-recipe-website"
              required
              readonly={true}
            />
            <label for="view-recipe-screen-recipe-website" class="form__label"
              >Website Link</label
            >
          </div>
        </div>
        <div
          id="view-recipe-screen-recipe-microes"
          class="col-12 col-lg-8 fmt-no-pad d-none mt-1"
        >
          <div class="col-12 col-lg-8 mb-1">
            <h4 class="fmt-font-1-5">Micronutrients</h4>
          </div>
          <div
            id="view-recipe-screen-recipe-additional"
            class="col-12 col-lg-8"
          />
        </div>
      </div>
      <!-- Footer -->
      <div
        id="view-recipe-screen-footer"
        class="row justify-content-center fmt-align-end fmt-flex-1 mb-1"
      >
        <div class="col-12 col-lg-8 d-flex">
          <div class="input-group fmt-flex-1">
            <button
              id="view-recipe-screen-edit"
              class="btn btn-outline-dark flex-fill"
              type="button">Edit</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <!--Add To Meal-->
            <button
              id="view-recipe-screen-save"
              class="btn btn-outline-success flex-fill ml-1 mr-1"
              type="button">Add</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="view-recipe-screen-more"
              class="btn btn-outline-dark flex-fill"
              type="button">More</button
            >
            <button
              id="view-recipe-screen-less"
              class="btn btn-outline-dark flex-fill d-none"
              type="button">Less</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="edit-recipe-screen" class="fmt-dynamic-screen container-fluid">
    <div id="edit-recipe-screen-alerts" class="row justify-content-center" />
    <div class="fmt-column full-height">
      <!-- Heading -->
      <div class="row justify-content-center mt-3 fmt-flex-1">
        <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
          <div class="fmt-flex-4 fmt-truncate">
            <span id="edit-recipe-screen-heading" class="fmt-font-1-5"
              >Edit Recipe</span
            >
          </div>
          <div
            id="edit-recipe-screen-cancel"
            class="fmt-flex-1 fmt-right-text"
            style="cursor: pointer;"
          >
            <button class="fal fa-times btn fmt-text-btn1" type="button" />
          </div>
        </div>
      </div>
      <!-- Content -->
      <div
        id="edit-recipe-screen-content"
        class="row justify-content-center fmt-screen-content fmt-align-start fmt-flex-11"
      >
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex fmt-align-start fmt-space-between">
            <div
              class="fmt-flex-column fmt-align-center fmt-font-color-primary"
            >
              <span>Calories</span>
              <span id="edit-recipe-screen-recipe-calories" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-violet">
              <span>Carbs</span>
              <span id="edit-recipe-screen-recipe-carbohydrates" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-info">
              <span>Proteins</span>
              <span id="edit-recipe-screen-recipe-proteins" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-orange">
              <span>Fats</span>
              <span id="edit-recipe-screen-recipe-fats" />
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Recipe Name"
              id="edit-recipe-screen-recipe-name"
              required
            />
            <label for="edit-recipe-screen-recipe-name" class="form__label"
              >Recipe Name</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Creator"
              id="edit-recipe-screen-recipe-brand"
              required
            />
            <label for="edit-recipe-screen-recipe-brand" class="form__label"
              >Creator</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div
            class="form__group d-flex"
            id="edit-recipe-screen-recipe-serving"
          >
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Serving Size"
              id="edit-recipe-screen-recipe-serving-input"
              required
            />
            <label
              for="edit-recipe-screen-recipe-serving-input"
              class="form__label">Serving Size</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <textarea
              type="text"
              class="form__field fmt-input-field"
              placeholder="Description"
              id="edit-recipe-screen-recipe-description"
              required
            />
            <label
              for="edit-recipe-screen-recipe-description"
              class="form__label">Description</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mt-1">
          <h4 class="fmt-font-1-5">Ingredients</h4>
        </div>
        <div
          id="edit-recipe-screen-recipe-ingredients"
          class="col-12 col-lg-8 mb-1"
        >
          <button
            id="edit-recipe-screen-recipe-ingredients-add"
            class="btn fmt-btn-outline-gray fmt-btn-no-focus fmt-form-btn mt-2"
            type="button">Add Ingredient</button
          >
        </div>
        <div class="col-12 col-lg-8 mt-1">
          <h4 class="fmt-font-1-5">Preparation Steps</h4>
        </div>
        <div
          id="edit-recipe-screen-recipe-preparation-steps"
          class="col-12 col-lg-8 mb-1"
        >
          <button
            id="edit-recipe-screen-recipe-preparation-steps-add"
            class="btn fmt-btn-outline-gray fmt-btn-no-focus fmt-form-btn mt-2"
            type="button">Add Step</button
          >
        </div>
        <div class="col-12 col-lg-8 mt-1">
          <h4 class="fmt-font-1-5">Social Media</h4>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Video URL"
              id="edit-recipe-screen-recipe-video-url"
              required
            />
            <label for="edit-recipe-screen-recipe-video-url" class="form__label"
              >Video Link</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Website Link"
              id="edit-recipe-screen-recipe-website"
              required
            />
            <label for="edit-recipe-screen-recipe-website" class="form__label"
              >Website Link</label
            >
          </div>
        </div>
        <div
          id="edit-recipe-screen-recipe-microes"
          class="col-12 col-lg-8 fmt-no-pad d-none mt-1"
        >
          <div class="col-12 col-lg-8 mb-1">
            <h4 class="fmt-font-1-5">Micronutrients</h4>
          </div>
          <div
            id="edit-recipe-screen-recipe-additional"
            class="col-12 col-lg-8"
          />
        </div>
      </div>
      <!-- Footer -->
      <div
        id="edit-recipe-screen-footer"
        class="row justify-content-center fmt-align-end fmt-flex-1 mb-1"
      >
        <div class="col-12 col-lg-8 d-flex">
          <div class="input-group fmt-flex-1">
            <button
              id="edit-recipe-screen-delete"
              class="btn btn-danger flex-fill"
              type="button">Delete</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="edit-recipe-screen-save"
              class="btn btn-outline-primary flex-fill ml-1 mr-1"
              type="button">Update</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="edit-recipe-screen-more"
              class="btn btn-outline-dark flex-fill"
              type="button">More</button
            >
            <button
              id="edit-recipe-screen-less"
              class="btn btn-outline-dark flex-fill d-none"
              type="button">Less</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="edit-ingredient-screen" class="fmt-dynamic-screen container-fluid">
    <div
      id="edit-ingredient-screen-alerts"
      class="row justify-content-center"
    />
    <div class="fmt-column full-height">
      <!-- Heading -->
      <div class="row justify-content-center mt-3 fmt-flex-1">
        <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
          <div class="fmt-flex-4 fmt-truncate">
            <span id="edit-ingredient-screen-heading" class="fmt-font-1-5"
              >Edit Ingredient</span
            >
          </div>
          <div
            id="edit-ingredient-screen-cancel"
            class="fmt-flex-1 fmt-right-text"
            style="cursor: pointer;"
          >
            <button class="fal fa-times btn fmt-text-btn1" type="button" />
          </div>
        </div>
      </div>
      <!-- Content -->
      <div
        id="edit-ingredient-screen-content"
        class="row justify-content-center fmt-screen-content fmt-align-start fmt-flex-11"
      >
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex fmt-align-start fmt-space-between">
            <div
              class="fmt-flex-column fmt-align-center fmt-font-color-primary"
            >
              <span>Calories</span>
              <span id="edit-ingredient-screen-ingredient-calories" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-violet">
              <span>Carbs</span>
              <span id="edit-ingredient-screen-ingredient-carbohydrates" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-info">
              <span>Proteins</span>
              <span id="edit-ingredient-screen-ingredient-proteins" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-orange">
              <span>Fats</span>
              <span id="edit-ingredient-screen-ingredient-fats" />
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Item Name"
              id="edit-ingredient-screen-ingredient-name"
              required
              readonly={true}
            />
            <label
              for="edit-ingredient-screen-ingredient-name"
              class="form__label">Item Name</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Item Brand"
              id="edit-ingredient-screen-ingredient-brand"
              required
              readonly={true}
            />
            <label
              for="edit-ingredient-screen-ingredient-brand"
              class="form__label">Brand</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div
            class="form__group d-flex"
            id="edit-ingredient-screen-ingredient-serving"
          >
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Serving Size"
              id="edit-ingredient-screen-ingredient-serving-input"
              required
            />
            <label
              for="edit-ingredient-screen-ingredient-serving-input"
              class="form__label">Serving</label
            >
          </div>
        </div>
        <div
          id="edit-ingredient-screen-ingredient-microes"
          class="col-12 col-lg-8 fmt-no-pad d-none mt-1"
        >
          <div class="col-12 col-lg-8 mb-1">
            <h4 class="fmt-font-1-5">Micronutrients</h4>
          </div>
          <div
            id="edit-ingredient-screen-ingredient-additional"
            class="col-12 col-lg-8"
          />
        </div>
      </div>
      <!-- Footer -->
      <div
        id="edit-ingredient-screen-footer"
        class="row justify-content-center fmt-align-end fmt-flex-1 mb-1"
      >
        <div class="col-12 col-lg-8 d-flex">
          <div class="input-group fmt-flex-1">
            <button
              id="edit-ingredient-screen-delete"
              class="btn btn-danger flex-fill"
              type="button">Remove</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="edit-ingredient-screen-save"
              class="btn btn-outline-primary flex-fill ml-1 mr-1"
              type="button">Change</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="edit-ingredient-screen-more"
              class="btn btn-outline-dark flex-fill"
              type="button">More</button
            >
            <button
              id="edit-ingredient-screen-less"
              class="btn btn-outline-dark flex-fill d-none"
              type="button">Less</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="add-to-recipe-screen" class="fmt-dynamic-screen container-fluid">
    <div id="add-to-recipe-screen-alerts" class="row justify-content-center" />
    <div class="row justify-content-center mt-3">
      <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
        <div class="fmt-flex-8 fmt-truncate">
          <span id="add-to-recipe-screen-heading" class="fmt-font-1-5"
            >Add Ingredient</span
          >
        </div>
        <div
          id="add-to-recipe-screen-add"
          class="fmt-flex-2 fmt-right-text"
          style="cursor: pointer;"
        >
          <button
            action="food"
            class="fal fa-plus btn fmt-text-btn1 flex-fill fmt-text-color-light-green"
            type="button"
          />
        </div>
        <div
          id="add-to-recipe-screen-cancel"
          class="fmt-flex-2 fmt-right-text"
          style="cursor: pointer;"
        >
          <button class="fal fa-times btn fmt-text-btn1" type="button" />
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8 mb-1 mt-1">
        <ul id="add-to-recipe-screen-toggles" class="fmt-tab-ul">
          <li
            id="add-to-recipe-screen-my-food-btn"
            class="d-inline-block fmt-center-text fmt-tab-li-left fmt-tab-li-active"
          >
            My Foods
          </li>
        </ul>
      </div>
      <div
        id="add-to-recipe-screen-food-search-cont"
        class="input-group col-12 col-lg-8 mb-1 mt-1"
      >
        <div class="input-group-prepend fmt-w-inherit">
          <input
            id="add-to-recipe-screen-food-search"
            type="text"
            class="form-control fmt-search-bar"
            placeholder="&#xf002;"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
        </div>
      </div>
      <div
        id="add-to-recipe-screen-food-table-cont"
        class="input-group col-12 col-lg-8 mb-1"
      >
        <table
          id="add-to-recipe-screen-food-table"
          class="table table-striped table-hover"
        >
          <tbody id="add-to-recipe-screen-food-table-body" />
        </table>
      </div>
    </div>
  </div>

  <div id="add-to-meal-screen" class="fmt-dynamic-screen container-fluid">
    <div id="add-to-meal-screen-alerts" class="row justify-content-center" />
    <div class="row justify-content-center mt-3">
      <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
        <div class="fmt-flex-8 fmt-truncate">
          <span id="add-to-meal-screen-heading" class="fmt-font-1-5"
            >Add to Meal</span
          >
        </div>
        <div
          id="add-to-meal-screen-add"
          class="fmt-flex-2 fmt-right-text"
          style="cursor: pointer;"
        >
          <button
            action="food"
            class="fal fa-plus btn fmt-text-btn1 flex-fill fmt-text-color-light-green"
            type="button"
          />
        </div>
        <div
          id="add-to-meal-screen-cancel"
          class="fmt-flex-2 fmt-right-text"
          style="cursor: pointer;"
        >
          <button class="fal fa-times btn fmt-text-btn1" type="button" />
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8 mb-1 mt-1">
        <ul id="add-to-meal-screen-toggles" class="fmt-tab-ul">
          <li
            id="add-to-meal-screen-my-food-btn"
            class="d-inline-block fmt-center-text fmt-tab-li-left fmt-tab-li-active"
          >
            My Foods
          </li>
          <li
            id="add-to-meal-screen-my-recipe-btn"
            class="d-inline-block fmt-center-text fmt-tab-li-right"
          >
            My Recipes
          </li>
        </ul>
      </div>
      <div
        id="add-to-meal-screen-food-search-cont"
        class="input-group col-12 col-lg-8 mb-1 mt-1"
      >
        <div class="input-group-prepend fmt-w-inherit">
          <input
            id="add-to-meal-screen-food-search"
            type="text"
            class="form-control fmt-search-bar"
            placeholder="&#xf002;"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
        </div>
      </div>
      <div
        id="add-to-meal-screen-food-table-cont"
        class="input-group col-12 col-lg-8 mb-1"
      >
        <table
          id="add-to-meal-screen-food-table"
          class="table table-striped table-hover"
        >
          <tbody id="add-to-meal-screen-food-table-body" />
        </table>
      </div>
      <div
        id="add-to-meal-screen-recipe-search-cont"
        class="input-group col-12 col-lg-8 mb-1 mt-1 d-none"
      >
        <div class="input-group-prepend fmt-w-inherit">
          <input
            id="add-to-meal-screen-recipe-search"
            type="text"
            class="form-control fmt-search-bar"
            placeholder="&#xf002;"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
        </div>
      </div>
      <div
        id="add-to-meal-screen-recipe-table-cont"
        class="input-group col-12 col-lg-8 mb-1 d-none"
      >
        <table
          id="add-to-meal-screen-recipe-table"
          class="table table-striped table-hover"
        >
          <tbody id="add-to-meal-screen-recipe-table-body" />
        </table>
      </div>
    </div>
  </div>

  <div id="edit-meal-entry-screen" class="fmt-dynamic-screen container-fluid">
    <div
      id="edit-meal-entry-screen-alerts"
      class="row justify-content-center"
    />
    <div class="fmt-column full-height">
      <!-- Heading -->
      <div class="row justify-content-center mt-3 fmt-flex-1">
        <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
          <div class="fmt-flex-4 fmt-truncate">
            <span id="edit-meal-entry-screen-heading" class="fmt-font-1-5"
              >Edit Meal Entry</span
            >
          </div>
          <div
            id="edit-meal-entry-screen-cancel"
            class="fmt-flex-1 fmt-right-text"
            style="cursor: pointer;"
          >
            <button class="fal fa-times btn fmt-text-btn1" type="button" />
          </div>
        </div>
      </div>
      <!-- Content -->
      <div
        id="edit-meal-entry-screen-content"
        class="row justify-content-center fmt-screen-content fmt-align-start fmt-flex-11"
      >
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex fmt-align-start fmt-space-between">
            <div
              class="fmt-flex-column fmt-align-center fmt-font-color-primary"
            >
              <span>Calories</span>
              <span id="edit-meal-entry-screen-consumable-calories" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-violet">
              <span>Carbs</span>
              <span id="edit-meal-entry-screen-consumable-carbohydrates" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-info">
              <span>Proteins</span>
              <span id="edit-meal-entry-screen-consumable-proteins" />
            </div>
            <div class="fmt-flex-column fmt-align-center fmt-font-color-orange">
              <span>Fats</span>
              <span id="edit-meal-entry-screen-consumable-fats" />
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Consumable Name"
              id="edit-meal-entry-screen-consumable-name"
              required
              readonly={true}
            />
            <label
              for="edit-meal-entry-screen-consumable-name"
              class="form__label">Description</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Consumable Brand"
              id="edit-meal-entry-screen-consumable-brand"
              required
              readonly={true}
            />
            <label
              for="edit-meal-entry-screen-consumable-brand"
              class="form__label">Brand</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div class="form__group d-flex">
            <input
              type="text"
              class="form__field fmt-input-field"
              placeholder="Consumable Type"
              id="edit-meal-entry-screen-consumable-type"
              required
              readonly={true}
            />
            <label
              for="edit-meal-entry-screen-consumable-type"
              class="form__label">Type</label
            >
          </div>
        </div>
        <div class="col-12 col-lg-8 mb-1">
          <div
            class="form__group d-flex"
            id="edit-meal-entry-screen-consumable-serving"
          >
            <input
              type="number"
              class="form__field fmt-input-field"
              placeholder="Serving Size"
              id="edit-meal-entry-screen-consumable-serving-input"
              required
            />
            <label
              for="edit-meal-entry-screen-consumable-serving-input"
              class="form__label">Serving</label
            >
          </div>
        </div>
        <div
          id="edit-meal-entry-screen-consumable-microes"
          class="col-12 col-lg-8 fmt-no-pad d-none mt-1"
        >
          <div class="col-12 col-lg-8 mb-1">
            <h4 class="fmt-font-1-5">Micronutrients</h4>
          </div>
          <div
            id="edit-meal-entry-screen-consumable-additional"
            class="col-12 col-lg-8"
          />
        </div>
      </div>
      <!-- Footer -->
      <div
        id="edit-meal-entry-screen-footer"
        class="row justify-content-center fmt-align-end fmt-flex-1 mb-1"
      >
        <div class="col-12 col-lg-8 d-flex">
          <div class="input-group fmt-flex-1">
            <button
              id="edit-meal-entry-screen-delete"
              class="btn btn-danger flex-fill"
              type="button">Delete</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="edit-meal-entry-screen-save"
              class="btn btn-outline-primary flex-fill ml-1 mr-1"
              type="button">Update</button
            >
          </div>
          <div class="input-group fmt-flex-1">
            <button
              id="edit-meal-entry-screen-more"
              class="btn btn-outline-dark flex-fill"
              type="button">More</button
            >
            <button
              id="edit-meal-entry-screen-less"
              class="btn btn-outline-dark flex-fill d-none"
              type="button">Less</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <Navbar />
</main>

<style>
</style>
