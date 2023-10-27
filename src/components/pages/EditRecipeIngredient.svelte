<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
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
