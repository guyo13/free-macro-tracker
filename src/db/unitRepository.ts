// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { derived, type Readable } from "svelte/store";
import type IDBWrapper from "idb_wrapper.js";
import {
  IDBTransactionModes,
  type IDBCursorWithTypedValue,
} from "idb_wrapper.js";
import idbConnector from "./idb";
import type { IRepository } from "./repository";
import Repository from "./repository";
import type { IUnit } from "../models/units";
import Unit from "../models/units";

const FMT_DB_UNITS_STORE = "fmt_units";

class UnitRepository extends Repository implements IUnitRepository {
  iterateUnits(): Promise<IDBCursorWithTypedValue<IUnit>> {
    return this.iterate<IUnit>(IDBTransactionModes.Readonly);
  }

  async getAllUnits(): Promise<IUnit[]> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return (await this.connection.getAll<IUnit>(this.storeName))?.map(
      Unit.fromObject
    );
  }

  async getUnit(unitName: string): Promise<IUnit | null> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    const unit = await this.connection.get<IUnit>(this.storeName, unitName);
    return unit && Unit.fromObject(unit);
  }

  addUnit(unit: IUnit): Promise<void> {
    return this.add(unit);
  }

  updateUnit(unit: IUnit): Promise<void> {
    return this.update(unit);
  }

  async deleteUnit(unitName: string): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const unitStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const deleteRequest = unitStore.delete(unitName);
      deleteRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      deleteRequest.onerror = (_ev: Event) => {
        reject(`Failed deleting unit with name '${unitName}`);
      };
    });
  }
}

const unitRepositoryProvider = derived<Readable<IDBWrapper>, IUnitRepository>(
  idbConnector,
  (connector, set) => {
    let isInitialized = false;
    if (idbConnector && !isInitialized) {
      isInitialized = true;
      set(new UnitRepository(connector, FMT_DB_UNITS_STORE));
    }
  }
);

export interface IUnitRepository extends IRepository {
  iterateUnits: () => Promise<IDBCursorWithTypedValue<IUnit>>;
  getAllUnits: () => Promise<IUnit[]>;
  getUnit: (unitName: string) => Promise<IUnit | null>;
  addUnit: (unit: IUnit) => Promise<void>;
  updateUnit: (unit: IUnit) => Promise<void>;
  deleteUnit: (unitName: string) => Promise<void>;
}
export default unitRepositoryProvider;
