<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
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
