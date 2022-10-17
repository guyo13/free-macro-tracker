// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { derived, type Readable } from "svelte/store";
import type IDBWrapper from "idb_wrapper.js";
import { IDBTransactionModes } from "idb_wrapper.js";
import idbConnector from "./idb";
import type { IRepository } from "./repository";
import Repository from "./repository";
import type { INutrientDefinition } from "../models/nutrient";
import NutrientDefinition from "../models/nutrientDefinition";

const FMT_DB_NUTRIENTS_STORE = "fmt_nutrients";

class NutrientRepository extends Repository implements INutrientRepository {
  getAllNutrients(): Promise<INutrientDefinition[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
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

  addNutrient(nutrient: INutrientDefinition): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
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

  updateNutrient(nutrient: INutrientDefinition): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
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

  getNutrient(category: string, name: string): Promise<INutrientDefinition> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
      const nutrientStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const getRequest = nutrientStore.get([category, name]);
      getRequest.onsuccess = (ev: Event) => {
        //@ts-ignore
        const result: any | undefined = ev?.target?.result;
        try {
          const nutrientDef = NutrientDefinition.fromObject(result);
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

  deleteNutrient(category: string, name: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
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
  let isIntialized = false;
  if (idbConnector && !isIntialized) {
    isIntialized = true;
    set(new NutrientRepository(connector, FMT_DB_NUTRIENTS_STORE));
  }
});

export interface INutrientRepository extends IRepository {
  getAllNutrients: () => Promise<INutrientDefinition[]>;
  addNutrient: (nutrient: INutrientDefinition) => Promise<void>;
  updateNutrient: (nutrient: INutrientDefinition) => Promise<void>;
  getNutrient: (
    category: string,
    name: string
  ) => Promise<INutrientDefinition | null>;
  deleteNutrient: (category: string, name: string) => Promise<void>;
}
export default nutrientRepositoryProvider;