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

const FMT_DB_UNITS_STORE = "fmt_units";

class UnitRepository extends Repository implements IUnitRepository {
  readAllUnits(): Promise<IUnit[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
      const unitStore = this.connection.getObjectStore(
        this.storeName,
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

  addUnit(unit: IUnit): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
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

  updateUnit(unit: IUnit): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
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

  getUnit(unitName: string): Promise<IUnit | null> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
      const unitStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );

      const getRequest = unitStore.get(unitName);
      getRequest.onsuccess = (_ev: Event) => {
        // @ts-ignore
        const result: any | undefined = ev?.target?.result;
        try {
          const unit = Unit.fromObject(result);
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

  deleteUnit(unitName: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
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
    let isIntialized = false;
    if (idbConnector && !isIntialized) {
      isIntialized = true;
      set(new UnitRepository(connector, FMT_DB_UNITS_STORE));
    }
  }
);

export interface IUnitRepository extends IRepository {
  readAllUnits: () => Promise<IUnit[]>;
  addUnit: (unit: IUnit) => Promise<void>;
  updateUnit: (unit: IUnit) => Promise<void>;
  getUnit: (unitName: string) => Promise<IUnit | null>;
  deleteUnit: (unitName: string) => Promise<void>;
}
export default unitRepositoryProvider;
