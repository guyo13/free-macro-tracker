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
  async iterateUnits(): Promise<IDBCursorWithTypedValue<IUnit>> {
    return this.iterate<IUnit>(IDBTransactionModes.Readonly);
  }

  async getAllUnits(): Promise<IUnit[]> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const unitStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const getAllRequest = unitStore.getAll();
      getAllRequest.onsuccess = (ev: Event) => {
        // @ts-ignore
        const units: any[] | undefined = ev?.target?.result;
        resolve(units ? units.map(Unit.fromObject) : []);
      };
      getAllRequest.onerror = (_ev: Event) => {
        reject("Failed getting all units");
      };
    });
  }

  async getUnit(unitName: string): Promise<IUnit | null> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const unitStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const getRequest = unitStore.get(unitName);
      getRequest.onsuccess = (ev: Event) => {
        // @ts-ignore
        const result: any | undefined = ev?.target?.result;
        try {
          const unit = result ? Unit.fromObject(result) : null;
          resolve(unit);
        } catch (err) {
          reject(err);
        }
      };
      getRequest.onerror = (_ev: Event) => {
        reject(`Failed getting unit with name '${unitName}`);
      };
    });
  }

  async addUnit(unit: IUnit): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const unitStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const addRequest = unitStore.add(unit);
      addRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      addRequest.onerror = (_ev: Event) => {
        reject(`Failed adding unit ${JSON.stringify(unit)}`);
      };
    });
  }

  async updateUnit(unit: IUnit): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const unitStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const putRequest = unitStore.put(unit);
      putRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      putRequest.onerror = (_ev: Event) => {
        reject(`Failed updating unit ${JSON.stringify(unit)}`);
      };
    });
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
