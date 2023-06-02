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
    return new Promise((resolve, reject) => {
      const nutrientStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const getAllRequest = nutrientStore.getAll();
      getAllRequest.onsuccess = (ev: Event) => {
        // @ts-ignore
        const nutrients: any[] | undefined = ev?.target?.result;
        resolve(nutrients ? nutrients.map(NutrientDefinition.fromObject) : []);
      };
      getAllRequest.onerror = (_ev: Event) => {
        reject("Failed getting all nutrients");
      };
    });
  }

  async getNutrient(
    category: string,
    name: string
  ): Promise<INutrientDefinition | null> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const nutrientStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const getRequest = nutrientStore.get([category, name]);
      getRequest.onsuccess = (ev: Event) => {
        //@ts-ignore
        const result: any | undefined = ev?.target?.result;
        try {
          const nutrientDef = result
            ? NutrientDefinition.fromObject(result)
            : null;
          resolve(nutrientDef);
        } catch (err) {
          reject(err);
        }
      };
      getRequest.onerror = (_ev: Event) => {
        reject(`Failed getting nutrient with key '${[category, name]}`);
      };
    });
  }

  async addNutrient(nutrient: INutrientDefinition): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const nutrientStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const addRequest = nutrientStore.add(nutrient);
      addRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      addRequest.onerror = (_ev: Event) => {
        reject(`Failed adding nutrient ${JSON.stringify(nutrient)}`);
      };
    });
  }

  async updateNutrient(nutrient: INutrientDefinition): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const nutrientStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const putRequest = nutrientStore.put(nutrient);
      putRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      putRequest.onerror = (_ev: Event) => {
        reject(`Failed updating nutrient ${JSON.stringify(nutrient)}`);
      };
    });
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
