<script lang="ts">
  import unitRepositoryProvider, {
    type IUnitRepository,
  } from "./db/unitRepository";
  import { onMount, tick } from "svelte";
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
  import AddFood from "./components/pages/AddFood.svelte";
  import EditFood from "./components/pages/EditFood.svelte";
  import ViewFood from "./components/pages/ViewFood.svelte";
  import AddRecipe from "./components/pages/AddRecipe.svelte";
  import ViewRecipe from "./components/pages/ViewRecipe.svelte";
  import EditRecipe from "./components/pages/EditRecipe.svelte";
  import AddIngredientToRecipe from "./components/pages/AddIngredientToRecipe.svelte";
  import AddToMeal from "./components/pages/AddToMeal.svelte";
  import EditMealEntry from "./components/pages/EditMealEntry.svelte";
  import EditRecipeIngredient from "./components/pages/EditRecipeIngredient.svelte";
  import type { IFood } from "./models/food";

  const DEFAULT_PROFILE_ID = 1;
  let isLoading = true,
    isOnboarding = false,
    // TODO - Remove after getting rid of pageController and implementing routing
    isAddFoodOpen = false;
  let units: IUnit[];
  let additionalNutrients: Map<string, INutrientDefinition[]>;

  // TODO - Remove after getting rid of pageController and implementing routing
  function closeAddFoodPage() {
    pageController.closeAddFoodDynamicScreen();
    isAddFoodOpen = false;
  }

  // TODO - Remove after getting rid of pageController and implementing routing
  async function openAddFoodPage() {
    isAddFoodOpen = true;
    await tick();
    pageController.openAddFoodDynamicScreen();
  }

  function handleAddFoodSave(food: IFood) {
    console.log(food);
  }

  function setUnitChart(_units: IUnit[]) {
    fmtAppInstance.unitsChart = createUnitChart(_units);
    units = _units;
    console.debug(
      `Units loaded into Application instance ${JSON.stringify(
        fmtAppInstance.unitsChart
      )}`
    );
  }

  function setAdditionalNutrients(nutrients: INutrientDefinition[]) {
    fmtAppInstance.additionalNutrients = {};
    const _additionalNutrients = new Map<string, INutrientDefinition[]>();
    const categories = new Set(nutrients.map((x) => x.category));
    for (const category of categories.values()) {
      fmtAppInstance.additionalNutrients[category] = [];
      _additionalNutrients.set(category, []);
    }
    for (const nutrientDefinition of nutrients) {
      const category = nutrientDefinition.category;
      fmtAppInstance.additionalNutrients[category].push(nutrientDefinition);
      _additionalNutrients.get(category).push(nutrientDefinition);
    }
    additionalNutrients = _additionalNutrients;
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
            IProfileRepository,
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
          const userProfile =
            await profileRepository.getProfile(DEFAULT_PROFILE_ID);
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

<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<svelte:head>
  <title>Free Macro Tracker</title>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <meta charset="utf-8" />
  <meta name="theme-color" content="#2a763b" />
  <meta name="msapplication-navbutton-color" content="#2a763b" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="viewport" content="width = device-width" />
  <link rel="stylesheet" href="/vendor/css/bootstrap.min.css" />
  <link rel="stylesheet" href="/vendor/css/fontawesome.min.css" />
  <link rel="stylesheet" href="/vendor/css/light.min.css" />
  <link rel="stylesheet" href="/build/app.css" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
</svelte:head>

{#if isLoading}
  <SplashScreen />
{:else if isOnboarding}
  <OnboardingScreen
    onSkipProfileClick={handleSkipProfileCreationClick}
    onCreateProfileClick={handleCreateProfileClick}
  />
{/if}
<main class={isLoading || isOnboarding ? "hidden" : ""}>
  <Dashboard />
  <FoodsAndRecipes onAddClick={openAddFoodPage} />
  <Profile />
  <Settings />
  <!--Dynamic Screens-->
  {#if isAddFoodOpen}
    <AddFood
      {units}
      {additionalNutrients}
      onClose={closeAddFoodPage}
      onSave={handleAddFoodSave}
    />
  {/if}
  <EditFood />
  <ViewFood {units} {additionalNutrients} />
  <AddRecipe />
  <EditRecipe />
  <ViewRecipe />
  <EditRecipeIngredient />
  <AddIngredientToRecipe />
  <AddToMeal />
  <EditMealEntry />
  <Navbar />
</main>

<style>
</style>
