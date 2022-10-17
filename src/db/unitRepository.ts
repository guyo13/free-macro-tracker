// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { derived, type Readable } from "svelte/store";
import type IDBWrapper from "idb_wrapper.js";
import { IDBTransactionModes } from "idb_wrapper.js";
import idbConnector from "./idb";
import type { IUnit } from "../models/units";
import type { IRepository } from "./repository";
import Repository from "./repository";
import Unit from "../models/units";

class UnitRepository extends Repository implements IUnitRepository {
  readAllUnits(): Promise<IUnit[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
      const unitStore = this.connection.getObjectStore(
        FMT_DB_UNITS_STORE,
        IDBTransactionModes.Readonly
      );
      const readRequest = unitStore.getAll();
      readRequest.onsuccess = (ev: Event) => {
        // @ts-ignore
        const units: any[] | undefined = ev?.target?.result;
        resolve(units ? units.map(Unit.fromObject) : []);
      };
      readRequest.onerror = (_ev: Event) => {
        reject("Failed reading units");
      };
    });
  }
}

const unitRepositoryProvider = derived<Readable<IDBWrapper>, IUnitRepository>(
  idbConnector,
  (connector, set) => {
    let isIntialized = false;
    if (idbConnector && !isIntialized) {
      isIntialized = true;
      set(new UnitRepository(connector));
    }
  }
);

export const FMT_DB_UNITS_STORE = "fmt_units";
export interface IUnitRepository extends IRepository {
  readAllUnits: () => Promise<IUnit[]>;
}
export default unitRepositoryProvider;
