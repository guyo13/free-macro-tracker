<!-- Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
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

  const DEFAULT_PROFILE_ID = 1;
  let isLoading: boolean = true;

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
    for (const nutrientDefition of nutrients) {
      const category = nutrientDefition.category;
      fmtAppInstance.additionalNutrients[category].push(nutrientDefition);
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
          if (userProfile || pageController.isProfileCreationSkippedByUser()) {
            pageController.showOverview(true);
            pageController.showNavOverlay();
            onAppFinishedLoading();
          } else {
            console.warn("No user Profile could be loaded");
            FMTToday();
            fmtAppInstance.currentDay = fmtAppInstance.today;
            pageController.showFirstTimeScreen();
            onAppFinishedLoading();
            if (fmtAppInstance.firstTimeScreenAutomatic) {
              setTimeout(() => {
                document.getElementById("fmt-app-first-time-create").click();
                pageController.showProfile();
              }, 3000);
            }
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
{/if}
<main class={isLoading ? "d-none" : ""}>
  <div id="overview" class="fmt-tab container-fluid">
    <div id="overview-alerts" class="row justify-content-center" />
    <div id="overview-container" class="">
      <div
        id="overview-date-container"
        class="mb-3 mt-3 row justify-content-center"
      >
        <div id="overview-date-prev" class="col-lg-1 col-2">
          <button
            id="overview-date-prev-day-lg"
            type="button"
            class="fal fa-chevron-left btn btn-lg fmt-btn-no-focus d-none d-md-block float-left"
          />
          <button
            id="overview-date-prev-day-sm"
            type="button"
            class="fal fa-chevron-left btn fmt-btn-no-focus d-md-none float-left"
          />
        </div>
        <div class="col-lg-6 col-8 fmt-center-text">
          <h1
            id="overview-date-day-large"
            class="display-5 d-none d-md-block"
          />
          <h4 id="overview-date-day-small" class="display-5 d-md-none" />
        </div>
        <div id="overview-date-next" class="col-lg-1 col-2">
          <button
            id="overview-date-next-day-lg"
            type="button"
            class="fal fa-chevron-right btn btn-lg fmt-btn-no-focus d-none d-md-block float-right"
          />
          <button
            id="overview-date-next-day-sm"
            type="button"
            class="fal fa-chevron-right btn fmt-btn-no-focus d-md-none float-right"
          />
        </div>
      </div>
      <div id="calories-cont" class="mb-3 mt-3 row justify-content-center">
        <div class="col-10 col-lg-8 fmt-center-text">
          <span class="fmt-font-2">Calories:</span>
        </div>
        <div class="w-100" />
        <div class="fmt-progress-bar-container col-10 col-lg-8">
          <div class="progress fmt-total-progress fmt-prog-sm">
            <div
              id="calories-progress-bar"
              class="progress-bar fmt-bg-dark-green"
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        <div class="w-100" />
        <div class="col-10 col-lg-8 fmt-center-text">
          <span
            id="overview-total-calories"
            class="fmt-font-1 fmt-font-color-primary d-none">0</span
          >
          <span
            id="overview-total-calories-verb"
            class="fmt-font-1 fmt-font-color-primary">0/0</span
          >
        </div>
      </div>
      <div id="macroes-cont" class="mb-1 row justify-content-center mr-1 ml-1">
        <div class="col-4 col-lg-2 fmt-center-text">
          <span class="fmt-font-2 d-none d-sm-block">Carbohydrates</span>
          <span class="fmt-font-2 d-sm-none">Carbs</span>
        </div>
        <div class="col-4 col-lg-2 fmt-center-text">
          <span class="fmt-font-2">Proteins</span>
        </div>
        <div class="col-4 col-lg-2 fmt-center-text">
          <span class="fmt-font-2">Fats</span>
        </div>
        <div class="w-100" />
        <div class="fmt-progress-bar-container col-4 col-lg-2">
          <div class="progress fmt-macro-progress fmt-prog-sm">
            <div
              id="carb-progress-bar"
              class="progress-bar fmt-bg-violet"
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        <div class="fmt-progress-bar-container col-4 col-lg-2">
          <div class="progress fmt-macro-progress fmt-prog-sm">
            <div
              id="protein-progress-bar"
              class="progress-bar bg-info"
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        <div class="fmt-progress-bar-container col-4 col-lg-2">
          <div class="progress fmt-macro-progress fmt-prog-sm">
            <div
              id="fat-progress-bar"
              class="progress-bar fmt-bg-orange"
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        <div class="w-100" />
        <div class="col-4 col-lg-2 fmt-center-text">
          <span
            id="overview-total-carbs"
            class="fmt-font-1  fmt-font-color-violet d-none">0</span
          >
          <span
            id="overview-total-carbs-verb"
            class="fmt-font-1 fmt-font-color-violet">0/0</span
          >
        </div>
        <div class="col-4 col-lg-2 fmt-center-text">
          <span
            id="overview-total-proteins"
            class="fmt-font-1 fmt-font-color-info d-none">0</span
          >
          <span
            id="overview-total-proteins-verb"
            class="fmt-font-1 fmt-font-color-info">0/0</span
          >
        </div>
        <div class="col-4 col-lg-2 fmt-center-text">
          <span
            id="overview-total-fats"
            class="fmt-font-1 fmt-font-color-orange d-none">0</span
          >
          <span
            id="overview-total-fats-verb"
            class="fmt-font-1 fmt-font-color-orange">0/0</span
          >
        </div>
      </div>
      <div id="overview-meals-container" class="fmt-meals-container" />
      <!--                <div id="overview-footer" class="row justify-content-center">
                    <div class="input-group col-12 col-lg-9 ">
                        <button id="overview-add-to-meal" class="btn fmt-btn-outline-success fmt-text-btn1 flex-fill" type="button">Add to Meal</button>
                    </div>
                </div>-->
    </div>
  </div>
  <div id="foods" class="fmt-tab container-fluid">
    <div id="foods-alerts" class="row justify-content-center" />
    <div class="row justify-content-center mt-3 fmt-flex-1">
      <div class="d-flex col-12 col-lg-8 mb-1 justify-content-between">
        <div class="fmt-flex-4">
          <h4 class="fmt-font-2">Foods and Recipes</h4>
        </div>
        <div class="fmt-flex-1 fmt-right-text" style="cursor: pointer;">
          <button
            id="foods-add"
            action="food"
            class="fal fa-plus btn fmt-text-btn1 flex-fill fmt-btn-no-focus fmt-text-color-light-green"
            type="button"
          />
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8 mb-1 mt-1">
        <ul id="foods-toggles" class="fmt-tab-ul">
          <li
            id="foods-my-food-btn"
            class="d-inline-block fmt-center-text fmt-tab-li-left fmt-tab-li-active"
          >
            My Foods
          </li>
          <li
            id="foods-my-recipe-btn"
            class="d-inline-block fmt-center-text fmt-tab-li-right"
          >
            My Recipes
          </li>
        </ul>
      </div>
      <div
        id="foods-food-search-cont"
        class="input-group col-12 col-lg-8 mb-1 mt-1"
      >
        <div class="input-group-prepend fmt-w-inherit">
          <input
            id="foods-food-search"
            type="text"
            class="form-control fmt-search-bar"
            placeholder="&#xf002;"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
        </div>
      </div>
      <div
        id="foods-food-table-cont"
        class="input-group col-12 col-lg-8 mb-1 fmt-table-height"
      >
        <table id="foods-food-table" class="table table-striped table-hover">
          <tbody id="foods-food-table-body" />
        </table>
      </div>
      <div
        id="foods-recipe-search-cont"
        class="input-group col-12 col-lg-8 mb-1 mt-1 d-none"
      >
        <div class="input-group-prepend fmt-w-inherit">
          <input
            id="foods-recipe-search"
            type="text"
            class="form-control fmt-search-bar"
            placeholder="&#xf002;"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
        </div>
      </div>
      <div
        id="foods-recipe-table-cont"
        class="input-group col-12 col-lg-8 mb-1 fmt-table-height d-none"
      >
        <table id="foods-recipe-table" class="table table-striped table-hover">
          <tbody id="foods-recipe-table-body" />
        </table>
      </div>
    </div>
  </div>
  <div id="profile" class="fmt-tab container-fluid">
    <div id="profile-alerts" class="row justify-content-center" />
    <div
      id="profile-carousel"
      class="carousel slide full-height"
      data-interval="false"
      data-wrap="false"
    >
      <div class="carousel-inner full-height">
        <div class="carousel-item active">
          <div id="bodily-details" class="row justify-content-center">
            <div class="row justify-content-between col-12 col-lg-8 mt-3">
              <div class="col-6 col-lg-4 pl-0">
                <h4 class="fmt-font-2">Personal Details</h4>
              </div>
              <div class="col-6 col-lg-3 pr-0">
                <button
                  id="save-profile-details"
                  class="btn btn-outline-primary float-right"
                  type="button">Save Details</button
                >
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group d-flex">
                <input
                  type="input"
                  class="form__field fmt-input-field"
                  placeholder="Name"
                  id="profile-name"
                />
                <label for="profile-name" class="form__label"
                  >Name (Optional)</label
                >
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group d-flex">
                <input
                  type="number"
                  class="form__field fmt-input-field"
                  placeholder="Body-Weight"
                  id="profile-weight"
                  required
                />
                <label for="profile-weight" class="form__label">Weight</label>
                <select
                  id="profile-weight-units"
                  name="profile-weight-units"
                  class="custom-select fmt-select  fmt-center-text"
                >
                  <option value="Kg">Kg</option>
                  <option value="Lbs">Lbs</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group d-flex">
                <input
                  type="number"
                  class="form__field fmt-input-field"
                  placeholder="Height"
                  id="profile-height"
                  required
                />
                <label for="profile-height" class="form__label">Height</label>
                <select
                  id="profile-height-units"
                  name="profile-height-units"
                  class="custom-select fmt-select fmt-center-text"
                >
                  <option value="Cm">Cm</option>
                  <option value="Inch">Inch</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group d-flex">
                <input
                  id="profile-age"
                  type="number"
                  class="form__field fmt-input-field"
                  placeholder="Age"
                  required
                />
                <label for="profile-age" class="form__label">Age</label>
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group d-flex">
                <input
                  id="profile-bodyfat"
                  type="number"
                  class="form__field fmt-input-field"
                  placeholder="(Optional)"
                />
                <label for="profile-bodyfat" class="form__label"
                  >Body Fat % (Optional)</label
                >
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group d-flex">
                <input
                  id="profile-sex"
                  type="text"
                  class="form__field fmt-input-field"
                  placeholder="Sex"
                  required
                  readonly={true}
                />
                <label for="profile-sex" class="form__label">Sex</label>
                <select
                  id="profile-sex-select"
                  name="profile-sex-select"
                  class="custom-select fmt-select fmt-center-text"
                >
                  <option value="" selected={true}>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group d-flex">
                <input
                  id="profile-active-level"
                  type="text"
                  class="form__field fmt-input-field"
                  placeholder="Activity Level"
                  required
                  readonly={true}
                />
                <label for="profile-active-level" class="form__label"
                  >Activity Level</label
                >
                <select
                  id="profile-activity-select"
                  name="profile-activity-select"
                  class="custom-select fmt-select fmt-center-text"
                >
                  <option value="" selected={true}>Select</option>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Light">1-3 days/week</option>
                  <option value="Moderate">3-5 days/week</option>
                  <option value="High">6-7 days/week</option>
                  <option value="Very High">x2/day</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group d-flex">
                <input
                  id="profile-activity-mult"
                  type="text"
                  class="form__field fmt-input-field"
                  required
                  readonly={true}
                />
                <label for="profile-activity-mult" class="form__label"
                  >Activity Level Multiplier</label
                >
              </div>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div id="energy-data" class="row justify-content-center mb-4">
            <div class="row justify-content-between col-12 col-lg-8 mt-3 mb-3">
              <div class="col-8 col-lg-6 pl-0">
                <h4 class="fmt-font-2">Energy Requirements</h4>
              </div>
              <div class="col-4 col-lg-2 pr-0">
                <button
                  id="profile-goto-macros"
                  type="button"
                  class="btn btn-outline-primary float-right">My Diet</button
                >
              </div>
            </div>
            <div class="w-100" />
            <div class="col-12 col-lg-4 mb-3">
              <div class="card">
                <div
                  class="card-header fmt-bg-dark-green d-flex fmt-center-text"
                >
                  <h2 class="fmt-font-white-bold" style="margin: 0;flex:10;">
                    Total Daily
                  </h2>
                  <i
                    id="profile-tdee-tooltip"
                    class="fal fa-info-circle fmt-font-white-bold"
                    style="flex:1;align-self: center;"
                    data-toggle="tooltip"
                    data-trigger="hover click"
                    title="Total daily calories burned including exercise."
                    data-container="body"
                  />
                </div>
                <div class="card-body fmt-center-text">
                  <h2 id="profile-tdee" style="margin: 0;" />
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-4 mb-3">
              <div class="card">
                <div
                  class="card-header fmt-bg-dark-green d-flex fmt-center-text"
                >
                  <h2 class="fmt-font-white-bold" style="margin: 0;flex:10;">
                    BMR
                  </h2>
                  <i
                    id="profile-bmr-tooltip"
                    class="fal fa-info-circle fmt-font-white-bold"
                    style="flex:1;align-self: center;"
                    data-toggle="tooltip"
                    data-trigger="hover click"
                    title="Basal Metabloic Rate. Daily calories burned without any activity."
                    data-container="body"
                  />
                </div>
                <div class="card-body fmt-center-text">
                  <h2 id="profile-bmr" style="margin: 0;" />
                </div>
              </div>
            </div>
            <div class="w-100" />
            <div class="col-12 col-lg-8 mb-1">
              <span id="profile-formula" class="fmt-font-1" />
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div id="macro-split" class="row justify-content-center">
            <div class="row justify-content-between col-12 col-lg-8 mt-3">
              <div class="col-6 col-lg-4 pl-0">
                <h4 class="fmt-font-2">Macro Split</h4>
              </div>
              <div class="col-6 col-lg-3 pr-0">
                <button
                  id="save-profile-macro"
                  class="btn btn-outline-primary flex-fill float-right"
                  type="button">Save Macros</button
                >
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group d-flex">
                <input
                  id="profile-daily-calories"
                  type="number"
                  class="form__field"
                  style="flex:1"
                  placeholder="Calories"
                  required
                />
                <label for="profile-daily-calories" class="form__label"
                  >Calories</label
                >
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group fmt-macro-form-container">
                <input
                  id="profile-macro-protein"
                  type="number"
                  class="form__field fmt-macro-form-input"
                  placeholder="Protein"
                  required
                />
                <label for="profile-macro-protein" class="form__label"
                  >Protein</label
                >
                <!-- FIXME: Don't use aria-roledescription to store the previous selection -->
                <select
                  id="profile-macro-protein-units-select"
                  aria-roledescription="%"
                  name="profile-macro-protein-units-select"
                  class="custom-select fmt-center-text fmt-macro-form-select"
                  aria-label="Protein Units"
                >
                  <option value="%" selected={true} aria-label="Percents"
                    >%</option
                  >
                  <option value="g" aria-label="Grams">g</option>
                  <option value="kCal" aria-label="Kilo Calories">kCal</option>
                </select>
                <span
                  id="profile-macro-protein-result"
                  class="form__field fmt-label-sm fmt-macro-form-extra"
                />
                <button
                  id="profile-macro-protein-fill"
                  class="btn btn-outline-primary fmt-macro-form-btn"
                  >Fill</button
                >
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group fmt-macro-form-container">
                <input
                  id="profile-macro-carb"
                  type="number"
                  class="form__field fmt-macro-form-input"
                  placeholder="Carbs"
                  required
                />
                <label for="profile-macro-carb" class="form__label">Carbs</label
                >
                <!-- FIXME: Don't use aria-roledescription to store the previous selection -->
                <select
                  id="profile-macro-carb-units-select"
                  aria-roledescription="%"
                  name="profile-macro-carb-units-select"
                  class="custom-select fmt-macro-form-select fmt-center-text"
                  aria-label="Carb Units"
                >
                  <option value="%" selected={true} aria-label="Percents"
                    >%</option
                  >
                  <option value="g" aria-label="Grams">g</option>
                  <option value="kCal" aria-label="Kilo Calories">kCal</option>
                </select>
                <span
                  id="profile-macro-carb-result"
                  class="form__field fmt-macro-form-extra fmt-label-sm"
                />
                <button
                  id="profile-macro-carb-fill"
                  class="btn btn-outline-primary fmt-macro-form-btn"
                  >Fill</button
                >
              </div>
            </div>
            <div class="col-12 col-lg-8 mb-1">
              <div class="form__group fmt-macro-form-container">
                <input
                  id="profile-macro-fat"
                  type="number"
                  class="form__field fmt-macro-form-input"
                  placeholder="Fat"
                  required
                />
                <label for="profile-macro-fat" class="form__label">Fat</label>
                <!-- FIXME: Don't use aria-roledescription to store the previous selection -->
                <select
                  id="profile-macro-fat-units-select"
                  aria-roledescription="%"
                  name="profile-macro-fat-units-select"
                  class="custom-select fmt-macro-form-select fmt-center-text"
                  aria-label="Fat Units"
                >
                  <option value="%" selected={true} aria-label="Percents"
                    >%</option
                  >
                  <option value="g" aria-label="Grams">g</option>
                  <option value="kCal" aria-label="Kilo Calories">kCal</option>
                </select>
                <span
                  id="profile-macro-fat-result"
                  class="form__field fmt-macro-form-extra fmt-label-sm"
                />
                <button
                  id="profile-macro-fat-fill"
                  class="btn btn-outline-primary fmt-macro-form-btn"
                  >Fill</button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <ol class="carousel-indicators fmt-carousel-indicators">
        <li
          id="profile-first-indicator"
          data-target="#profile-carousel"
          data-slide-to="0"
          class="active"
        />
        <li
          id="profile-mid-indicator"
          data-target="#profile-carousel"
          data-slide-to="1"
          class="mr-3 ml-3"
        />
        <li
          id="profile-last-indicator"
          data-target="#profile-carousel"
          data-slide-to="2"
        />
      </ol>
      <a
        id="profile-carousel-previous-chevron"
        class="d-none d-lg-flex carousel-control-prev fmt-pointer"
        role="button"
        data-slide="prev"
      >
        <span
          class="carousel-control-prev-icon fal fa-chevron-left fmt-carousel-control"
          aria-hidden="true"
        />
        <span class="sr-only">Previous</span>
      </a>
      <a
        id="profile-carousel-next-chevron"
        class="d-none d-lg-flex carousel-control-next fmt-pointer"
        role="button"
        data-slide="next"
      >
        <span
          class="carousel-control-next-icon fal fa-chevron-right fmt-carousel-control"
          aria-hidden="true"
        />
        <span class="sr-only">Next</span>
      </a>
    </div>
  </div>
  <div id="settings" class="fmt-tab container-fluid">
    <div id="settings-alerts" class="row justify-content-center" />
    <div
      class="row pt-1 pb-1 justify-content-center align-items-center fmt-bg-gainsboro"
    >
      <div class="col-12 col-lg-8 ml-1">
        <h4 class="fmt-font-2 mb-0">Settings</h4>
      </div>
    </div>
    <div id="settings-data-control" class="row justify-content-center mt-4">
      <div class="col-12 col-lg-8 mb-4">
        <h4 class="fmt-font-1-5 mb-0">Import and Export</h4>
      </div>
      <div class="col-12 col-lg-8 mb-1">
        <div
          id="settings-data-control-export"
          class="fmt-list-tile fmt-bg-cultured"
        >
          <span
            class="fmt-list-tile-body btn fmt-btn-outline-dark-green d-inline-block"
            >Export Your Data
          </span>
          <span class="fal fa-download btn fmt-list-tile-trailing" />
        </div>
      </div>
      <div class="col-12 col-lg-8 mb-1">
        <div
          id="settings-data-control-import"
          class="fmt-list-tile fmt-bg-cultured"
        >
          <span
            class="fmt-list-tile-body btn fmt-btn-outline-dark-green d-inline-block"
            >Import JSON File
          </span>
          <span class="fal fa-file-upload btn fmt-list-tile-trailing" />
        </div>
      </div>
      <div
        id="settings-data-control-import-indiv"
        class="input-group col-12 col-lg-8 mb-1 d-none"
      >
        <div class="input-group mb-3 mt-3">
          <div class="custom-file">
            <input
              id="settings-data-control-import-file"
              class="custom-file-input"
              type="file"
              accept="application/json"
            />
            <label
              id="settings-data-control-import-file-label"
              class="custom-file-label"
              for="settings-data-control-import-file"
              >Choose file to Import</label
            >
          </div>
        </div>
      </div>
    </div>
  </div>
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
        class="input-group col-12 col-lg-8 mb-1 fmt-table-height"
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
        class="input-group col-12 col-lg-8 mb-1 fmt-table-height"
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
        class="input-group col-12 col-lg-8 mb-1 fmt-table-height d-none"
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
  <!--Overlays-->
  <div
    id="fmt-app-first-time-overlay"
    class="d-none fmt-overlay container-fluid bg-white"
  >
    <div
      id="fmt-app-first-time-overlay-msg"
      class="row justify-content-center fmt-center-text"
    >
      <div class="fmt-column fmt-page-height fmt-content-center">
        <div class="mb-2">
          <span id="fmt-app-first-time-overlay-text-1" class="" />
        </div>
        <div class="mb-2">
          <span class="">To get started, let's create your profile.</span>
        </div>
        <div class="mt-2">
          <button
            id="fmt-app-first-time-create"
            class="btn btn-outline-primary"
            type="button">Create My Profile</button
          >
        </div>
        <div class="mt-2">
          <span class="">Or</span>
        </div>
        <div class="mt-2">
          <button
            id="fmt-app-first-time-skip"
            class="btn btn-outline-primary"
            type="button">Start Without a Profile</button
          >
        </div>
      </div>
    </div>
  </div>
  <div id="fmt-app-nav-overlay" class=" container-fluid">
    <div
      id="fmt-app-nav-overlay-alerts"
      class="row justify-content-center d-none"
    />
    <div
      id="fmt-app-nav-overlay-content"
      class="row justify-content-between fmt-center-text fmt-bg-dark-green fmt-navbar-position"
    >
      <div
        id="goto-overview"
        class="col-3 align-self-center fmt-menu-font fmt-nav-item-container"
        title="Meals"
      >
        <i class="fal fa-tasks-alt fmt-nav-icon" />
      </div>
      <div
        id="goto-profile"
        class="col-3 align-self-center fmt-menu-font fmt-nav-item-container"
        title="Profile"
      >
        <i class="fal fa-user fmt-nav-icon" />
      </div>
      <div
        id="goto-foods"
        class="col-3 align-self-center fmt-menu-font fmt-nav-item-container"
        title="Foods"
      >
        <i class="fal fa-utensils fmt-nav-icon" />
      </div>
      <div
        id="goto-settings"
        class="col-3 align-self-center fmt-menu-font fmt-nav-item-container"
        title="Settings"
      >
        <i class="fal fa-cog fmt-nav-icon" />
      </div>
    </div>
  </div>
</main>

<style>
</style>
