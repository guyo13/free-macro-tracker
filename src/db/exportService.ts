// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import type { CursorConsumer } from "idb_wrapper.js";
import type { IUnit } from "../models/units";
import type { IUnitRepository } from "./unitRepository";
import type { INutrientRepository } from "./nutrientRepository";
import type { INutrientDefinition } from "../models/nutrient";
import type { IUserProfile } from "../models/userProfile";
import type { IProfileRepository } from "./profileRepository";
import type { IFood } from "../models/food";
import type { IFoodRepository } from "./foodRepository";
import type { IUserGoals } from "../models/userGoals";
import type { IUserGoalsRepository } from "./userGoalsRepository";

class ExportService implements IExportService {
  readonly #unitRepository: IUnitRepository;
  readonly #nutrientRepository: INutrientRepository;
  readonly #profileRepository: IProfileRepository;
  readonly #foodRepository: IFoodRepository;
  readonly #userGoalsRepository: IUserGoalsRepository;

  constructor(
    unitRepository: IUnitRepository,
    nutrientRepository: INutrientRepository,
    profileRepository: IProfileRepository,
    foodRepository: IFoodRepository,
    userGoalsRepository: IUserGoalsRepository
  ) {
    this.#unitRepository = unitRepository;
    this.#nutrientRepository = nutrientRepository;
    this.#profileRepository = profileRepository;
    this.#foodRepository = foodRepository;
    this.#userGoalsRepository = userGoalsRepository;
  }

  exportUnits(writer: CursorConsumer<IUnit>): Promise<void> {
    return this.#unitRepository.iterateUnits(writer);
  }

  exportNutrients(writer: CursorConsumer<INutrientDefinition>): Promise<void> {
    return this.#nutrientRepository.iterateNutrients(writer);
  }

  exportProfiles(writer: CursorConsumer<IUserProfile>): Promise<void> {
    return this.#profileRepository.iterateProfiles(writer);
  }

  exportFoods(writer: CursorConsumer<IFood>): Promise<void> {
    return this.#foodRepository.iterateFoods(writer);
  }

  exportUserGoals(writer: CursorConsumer<IUserGoals>): Promise<void> {
    // TODO - export as a Map of {<Profile Id> : IUserGoals[]}
    return this.#userGoalsRepository.iterateUserGoals(writer);
  }
}

export interface IExportService {
  //     let records = {};
  //   records[fmtAppGlobals.FMT_DB_RECIPES_STORE] = [];
  //   records[fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE] = {};
  exportUnits: (writer: CursorConsumer<IUnit>) => Promise<void>;
  exportNutrients: (
    writer: CursorConsumer<INutrientDefinition>
  ) => Promise<void>;
  exportProfiles: (writer: CursorConsumer<IUserProfile>) => Promise<void>;
  exportFoods: (writer: CursorConsumer<IFood>) => Promise<void>;
  exportUserGoals: (writer: CursorConsumer<IUserGoals>) => Promise<void>;
}

export default ExportService;
