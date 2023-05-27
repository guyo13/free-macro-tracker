// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { type IDBCursorWithTypedValue } from "idb_wrapper.js";
import type { IUnit } from "../models/units";
import type { IUnitRepository } from "./unitRepository";

class ExportService implements IExportService {
  readonly #unitRepository: IUnitRepository;

  constructor(unitRepository: IUnitRepository) {
    this.#unitRepository = unitRepository;
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
}

export interface CursorConsumer<T> {
  consume: (arg: T) => void;
}

export interface IExportService {
  //     let records = {};
  //   records[fmtAppGlobals.FMT_DB_UNITS_STORE] = [];
  //   records[fmtAppGlobals.FMT_DB_NUTRIENTS_STORE] = [];
  //   records[fmtAppGlobals.FMT_DB_FOODS_STORE] = [];
  //   records[fmtAppGlobals.FMT_DB_RECIPES_STORE] = [];
  //   records[fmtAppGlobals.FMT_DB_MEAL_ENTRIES_STORE] = {};
  //   records[fmtAppGlobals.FMT_DB_USER_GOALS_STORE] = {};
  //   records[fmtAppGlobals.FMT_DB_PROFILES_STORE] = [];
  exportUnits: (writer: CursorConsumer<IUnit>) => Promise<void>;
}

export default ExportService;
