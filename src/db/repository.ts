// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import type IDBWrapper from "idb_wrapper.js";

export interface IRepository {
  connection: IDBWrapper;
  isReady: boolean;
}

class Repository {
  #connection: IDBWrapper;
  #isReady: boolean;

  constructor(connection: IDBWrapper) {
    this.#connection = connection;
    connection
      .wait()
      .then(() => (this.#isReady = true))
      .catch((_err) => (this.#isReady = false));
  }

  get isReady(): boolean {
    return this.#isReady;
  }

  get connection(): IDBWrapper {
    return this.#connection;
  }
}

export default Repository;
