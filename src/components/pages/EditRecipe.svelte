<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<div id="edit-recipe-screen" class="fmt-dynamic-screen container-fluid">
  <div id="edit-recipe-screen-alerts" class="row justify-content-center" />
  <div class="fmt-column full-height">
    <!-- Heading -->
    <div class="row justify-content-center fmt-flex-1 mt-3">
      <div class="d-flex col-12 col-lg-8 justify-content-between mb-1">
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
          <button
            class="fa fa-light fa-times btn fmt-text-btn1"
            type="button"
          />
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
          <div class="fmt-flex-column fmt-align-center fmt-font-color-primary">
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
        <div class="form__group d-flex" id="edit-recipe-screen-recipe-serving">
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
          <label for="edit-recipe-screen-recipe-description" class="form__label"
            >Description</label
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
