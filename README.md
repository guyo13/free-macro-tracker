# free-macro-tracker

Free and web-based App for tracking your meals
This is intended to be the free and open source version of apps like MyFitnessPal,Cronometer,etc...

## Current state

I originally started developing FMT as a vanilla JS SPA with some jQuery used for convenience.
The code quickly grew in size and complexity which makes development harder to continue down this route.

As of 2022 I plan on refactoring the entire app to Svelte and release it in version 2.0.0. This change will take time as FMT is currently not my top priority.

The app is still fully useable and version 2.0.0 is designed to be compatible with the current IndexedDB schema, new features and UI improvements are going to be delayed until we're fully migrated to Svelte.

Development is happening on the [v2.0.0-dev branch](https://github.com/guyo13/free-macro-tracker/tree/v2.0.0-dev).

## Features

- Runs in any modern browser
- Tracks and displays Calories and Macro-nutrients progress
- Calculate BMR, TDEE and goal Calories based on personal profile
- Saves your data on Browser
- No internet connection required
- User defined meals, foods and nutrients
- User defined Macro-Split
- User defined Recipes
- User defined measurement units
- Generate Reports
- Own your data - Export and Import
- Lightweight and built on JQuery and Bootstrap CSS

You are welcome to use the GitHub issues page for discussions and suggestions.
In the unlikely event you find a security issue with the app, please contact me by email.
