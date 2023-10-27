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
                                    class="custom-select fmt-select fmt-center-text"
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
                                <h2 id="profile-tdee" style="margin: 0;">
                                    <!-- Temp workaround until refactor -->
                                    <span />
                                </h2>
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
                                <h2 id="profile-bmr" style="margin: 0;">
                                    <!-- Temp workaround until refactor -->
                                    <span />
                                </h2>
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
                                    class="btn btn-outline-primary">Fill</button
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
                                    class="btn btn-outline-primary">Fill</button
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
                                    class="btn btn-outline-primary">Fill</button
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