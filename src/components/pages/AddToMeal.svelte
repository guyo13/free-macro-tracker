<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
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
