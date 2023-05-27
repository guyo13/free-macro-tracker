// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { type IDBCursorWithTypedValue } from "idb_wrapper.js";
import type { IUnit } from "../models/units";
import type { IUnitRepository } from "./unitRepository";
import type { INutrientRepository } from "./nutrientRepository";
import type { INutrientDefinition } from "../models/nutrient";

class ExportService implements IExportService {
  readonly #unitRepository: IUnitRepository;
  readonly #nutrientRepository: INutrientRepository;

  constructor(
    unitRepository: IUnitRepository,
    nutrientRepository: INutrientRepository
  ) {
    this.#unitRepository = unitRepository;
    this.#nutrientRepository = nutrientRepository;
  }

  #export<T>(
    getCursor: () => Promise<IDBCursorWithTypedValue<T>>,
    writer: CursorConsumer<T>
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const cursor = await getCursor();
        if (cursor) {
          const document = cursor.value;
          writer.consume(document);
          cursor.continue();
        } else {
          resolve();
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  exportUnits(writer: CursorConsumer<IUnit>): Promise<void> {
    return this.#export(this.#unitRepository.interateUnits, writer);
  }

  exportNutrients(writer: CursorConsumer<INutrientDefinition>): Promise<void> {
    return this.#export(this.#nutrientRepository.interateNutrients, writer);
  }
}

export interface CursorConsumer<T> {
  consume: (arg: T) => void;
}

export interface IExportService {
  //     let records = {};
  //   records[fmtAppGlobals.FMT_DB_FOODS_STORE] = [];
  //   records[fmtAppGlobals.FMT_DB_RECIPES_STORE] = [];
  //   records[fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE] = {};
  //   records[fmtAppGlobals.FMT_DB_USER_GOALS_STORE] = {};
  //   records[fmtAppGlobals.FMT_DB_PROFILES_STORE] = [];
  exportUnits: (writer: CursorConsumer<IUnit>) => Promise<void>;
  exportNutrients: (
    writer: CursorConsumer<INutrientDefinition>
  ) => Promise<void>;
}

export default ExportService;
