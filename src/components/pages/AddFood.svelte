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
