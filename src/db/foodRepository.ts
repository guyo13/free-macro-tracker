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
import Food from "../models/food";
import type { IFood } from "../models/food";
import { updateRecordDates, type RecordId } from "../models/record";

const FMT_DB_FOODS_STORE = "fmt_foods";

class FoodRepository extends Repository implements IFoodRepository {
  async iterateFoods(): Promise<IDBCursorWithTypedValue<IFood>> {
    return this.iterate<IFood>(IDBTransactionModes.Readonly);
  }

  async getAllFoods(): Promise<IFood[]> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const foodStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const getAllRequest = foodStore.getAll();
      getAllRequest.onsuccess = (ev: Event) => {
        // @ts-ignore
        const foods: any[] | undefined = ev?.target?.result;
        resolve(foods ? foods.map(Food.fromObject) : []);
      };
      getAllRequest.onerror = (_ev: Event) => {
        reject("Failed getting all foods");
      };
    });
  }

  async getFood(id: RecordId): Promise<IFood | null> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const foodStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const getRequest = foodStore.get(id);
      getRequest.onsuccess = (ev: Event) => {
        // @ts-ignore
        const result: any | undefined = ev?.target?.result;
        try {
          const food = result ? Food.fromObject(result) : null;
          resolve(food);
        } catch (err) {
          reject(err);
        }
      };
      getRequest.onerror = (_ev: Event) => {
        reject(`Failed getting food with id ${id}`);
      };
    });
  }

  async addFood(food: IFood): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const foodStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const addRequest = foodStore.add(food);
      addRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      addRequest.onerror = (_ev: Event) => {
        reject(`Failed adding food ${JSON.stringify(food)}`);
      };
    });
  }

  async updateFood(food: IFood): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      updateRecordDates(food);
      const foodStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const putRequest = foodStore.put(food);
      putRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      putRequest.onerror = (_ev: Event) => {
        reject(`Failed updating food ${JSON.stringify(food)}`);
      };
    });
  }

  async deleteFood(id: RecordId): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const foodStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const deleteRequest = foodStore.delete(id);
      deleteRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      deleteRequest.onerror = (_ev: Event) => {
        reject(`Failed deleting food with id ${id}`);
      };
    });
  }
}

const foodRepositoryProvider = derived<Readable<IDBWrapper>, IFoodRepository>(
  idbConnector,
  (connector, set) => {
    let isInitialized = false;
    if (idbConnector && !isInitialized) {
      isInitialized = true;
      set(new FoodRepository(connector, FMT_DB_FOODS_STORE));
    }
  }
);

export interface IFoodRepository extends IRepository {
  iterateFoods: () => Promise<IDBCursorWithTypedValue<IFood>>;
  getAllFoods: () => Promise<IFood[]>;
  getFood: (id: RecordId) => Promise<IFood | null>;
  addFood: (food: IFood) => Promise<void>;
  updateFood: (food: IFood) => Promise<void>;
  deleteFood: (id: RecordId) => Promise<void>;
}
export default foodRepositoryProvider;
