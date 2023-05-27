// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import type { IUnit } from "../models/units";
import type { IUnitRepository } from "./unitRepository";

const exportService: IExportService = {
  exportUnits: (
    unitRepository: IUnitRepository,
    writer: CursorConsumer<IUnit>
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const unitCursor = await unitRepository.interateUnits();
        if (unitCursor) {
          const unit = unitCursor.value;
          writer.consume(unit);
          unitCursor.continue();
        } else {
          resolve();
        }
      } catch (err) {
        reject(err);
      }
    });
  },
};

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
  exportUnits: (
    unitRepository: IUnitRepository,
    writer: CursorConsumer<IUnit>
  ) => Promise<void>;
}

export default exportService;
