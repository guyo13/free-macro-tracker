<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
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
                <h1 id="overview-date-day-large" class="display-5 d-none d-md-block">
                    <!-- Temp workaround until refactor -->
                    <span />
                </h1>
                <h4 id="overview-date-day-small" class="display-5 d-md-none">
                    <!-- Temp workaround until refactor -->
                    <span />
                </h4>
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
            <div class="col-10 col-lg-8">
                <div class="progress fmt-prog-sm">
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
            <div class="col-4 col-lg-2">
                <div class="progress fmt-prog-sm">
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
            <div class="col-4 col-lg-2">
                <div class="progress fmt-prog-sm">
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
            <div class="col-4 col-lg-2">
                <div class="progress fmt-prog-sm">
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
                  class="fmt-font-1 fmt-font-color-violet d-none">0</span
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