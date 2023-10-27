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
