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
    return (await this.connection.getAll<IFood>(this.storeName))?.map(
      Food.fromObject
    );
  }

  async getFood(id: RecordId): Promise<IFood | null> {
    if (!this.isReady) {
      await this.connection.wait();
    }

    const food = await this.connection.get<IFood>(this.storeName, id);
    return food && Food.fromObject(food);
  }

  async addFood(food: IFood): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return this.connection.add(this.storeName, food);
  }

  async updateFood(food: IFood): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    updateRecordDates(food);
    return this.connection.put(this.storeName, food);
  }

  async deleteFood(id: RecordId): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return this.connection.delete(this.storeName, id);
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
