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
import type { INutrientDefinition } from "../models/nutrient";
import NutrientDefinition from "../models/nutrientDefinition";

const FMT_DB_NUTRIENTS_STORE = "fmt_nutrients";

class NutrientRepository extends Repository implements INutrientRepository {
  async iterateNutrients(): Promise<
    IDBCursorWithTypedValue<INutrientDefinition>
  > {
    return this.iterate<INutrientDefinition>(IDBTransactionModes.Readonly);
  }

  async getAllNutrients(): Promise<INutrientDefinition[]> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return (
      await this.connection.getAll<INutrientDefinition>(this.storeName)
    )?.map(NutrientDefinition.fromObject);
  }

  async getNutrient(
    category: string,
    name: string
  ): Promise<INutrientDefinition | null> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    const nutrient = await this.connection.get<INutrientDefinition>(
      this.storeName,
      [category, name]
    );
    return nutrient && NutrientDefinition.fromObject(nutrient);
  }

  addNutrient(nutrient: INutrientDefinition): Promise<void> {
    return this.add(nutrient);
  }

  updateNutrient(nutrient: INutrientDefinition): Promise<void> {
    return this.update(nutrient);
  }

  async deleteNutrient(category: string, name: string): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const nutrientStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const deleteRequest = nutrientStore.delete([category, name]);
      deleteRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      deleteRequest.onerror = (_ev: Event) => {
        reject(`Failed deleting nutrient with key '${[category, name]}`);
      };
    });
  }
}

const nutrientRepositoryProvider = derived<
  Readable<IDBWrapper>,
  INutrientRepository
>(idbConnector, (connector, set) => {
  let isInitialized = false;
  if (idbConnector && !isInitialized) {
    isInitialized = true;
    set(new NutrientRepository(connector, FMT_DB_NUTRIENTS_STORE));
  }
});

export interface INutrientRepository extends IRepository {
  iterateNutrients: () => Promise<IDBCursorWithTypedValue<INutrientDefinition>>;
  getAllNutrients: () => Promise<INutrientDefinition[]>;
  getNutrient: (
    category: string,
    name: string
  ) => Promise<INutrientDefinition | null>;
  addNutrient: (nutrient: INutrientDefinition) => Promise<void>;
  updateNutrient: (nutrient: INutrientDefinition) => Promise<void>;
  deleteNutrient: (category: string, name: string) => Promise<void>;
}
export default nutrientRepositoryProvider;
