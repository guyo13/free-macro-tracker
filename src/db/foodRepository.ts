// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { derived, type Readable } from "svelte/store";
import type IDBWrapper from "idb_wrapper.js";
import { IDBTransactionModes, type CursorConsumer } from "idb_wrapper.js";
import idbConnector from "./idb";
import type { IRepository } from "./repository";
import Repository from "./repository";
import Food from "../models/food";
import type { IFood } from "../models/food";
import type { RecordId } from "../models/record";
import type IDBRecord from "../models/record";

const FMT_DB_FOODS_STORE = "fmt_foods";

class FoodRepository extends Repository implements IFoodRepository {
  iterateFoods(consumer: CursorConsumer<IFood>): Promise<void> {
    return this.iterate<IFood>(IDBTransactionModes.Readonly, consumer);
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
    return this.add(food);
  }

  // TODO - fix types
  async updateFood(food: IDBRecord): Promise<void> {
    return this.updateRecord(food);
  }

  deleteFood(id: RecordId): Promise<void> {
    return this.delete(id);
  }
}

const foodRepositoryProvider = derived<Readable<IDBWrapper>, IFoodRepository>(
  idbConnector,
  (connector, set) => {
    if (idbConnector) {
      set(new FoodRepository(connector, FMT_DB_FOODS_STORE));
    }
  }
);

export interface IFoodRepository extends IRepository {
  iterateFoods: (consumer: CursorConsumer<IFood>) => Promise<void>;
  getAllFoods: () => Promise<IFood[]>;
  getFood: (id: RecordId) => Promise<IFood | null>;
  addFood: (food: IFood) => Promise<void>;
  // TODO - fix types
  updateFood: (food: IDBRecord) => Promise<void>;
  deleteFood: (id: RecordId) => Promise<void>;
}
export default foodRepositoryProvider;
