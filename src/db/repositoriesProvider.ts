// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import type IDBWrapper from "idb_wrapper.js";
import { derived, type Readable } from "svelte/store";
import idbConnector from "./idb";
import type { IRepository } from "./repository";

type RepositoryProviders = Readable<IRepository>[];

const repositoriesProvider: IRepositoriesProvider = {
  synced: <S extends RepositoryProviders>(
    providers: S
  ): Readable<IRepository[]> => {
    let initializedCount = 0;
    let isIntialized = false;

    return derived<
      [Readable<IDBWrapper>, ...Readable<IRepository>[]],
      IRepository[]
    >([idbConnector, ...providers], ([connector, ...repositories], set) => {
      for (const repo of repositories) {
        if (repo) {
          initializedCount++;
        }
      }

      const areReposInitialized = initializedCount === providers.length;

      if (areReposInitialized && !isIntialized) {
        isIntialized = true;
        connector
          .wait()
          .then(() => {
            set([...repositories]);
          })
          .catch((err) =>
            console.error("Error while loading repositories.", err)
          );
      }
    });
  },
};

export interface IRepositoriesProvider {
  synced: <S extends RepositoryProviders>(
    providers: S
  ) => Readable<IRepository[]>;
}
export default repositoriesProvider;
