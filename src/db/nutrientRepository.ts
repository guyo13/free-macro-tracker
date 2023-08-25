// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { derived, type Readable } from "svelte/store";
import type IDBWrapper from "idb_wrapper.js";
import { IDBTransactionModes, type CursorConsumer } from "idb_wrapper.js";
import idbConnector from "./idb";
import type { IRepository } from "./repository";
import Repository from "./repository";
import type { INutrientDefinition } from "../models/nutrient";
import NutrientDefinition from "../models/nutrientDefinition";

const FMT_DB_NUTRIENTS_STORE = "fmt_nutrients";

class NutrientRepository extends Repository implements INutrientRepository {
  iterateNutrients(
    consumer: CursorConsumer<INutrientDefinition>
  ): Promise<void> {
    return this.iterate<INutrientDefinition>(
      IDBTransactionModes.Readonly,
      consumer
    );
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

  deleteNutrient(category: string, name: string): Promise<void> {
    return this.delete([category, name]);
  }
}

const nutrientRepositoryProvider = derived<
  Readable<IDBWrapper>,
  INutrientRepository
>(idbConnector, (connector, set) => {
  if (idbConnector) {
    set(new NutrientRepository(connector, FMT_DB_NUTRIENTS_STORE));
  }
});

export interface INutrientRepository extends IRepository {
  iterateNutrients: (
    consumer: CursorConsumer<INutrientDefinition>
  ) => Promise<void>;
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
