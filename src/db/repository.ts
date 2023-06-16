// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import type {
  IDBCursorWithTypedValue,
  IDBTransactionModes,
  KeyRangeSettings,
} from "idb_wrapper.js";
import type IDBWrapper from "idb_wrapper.js";

export interface IRepository {
  connection: IDBWrapper;
  isReady: boolean;
}

class Repository {
  #connection: IDBWrapper;
  #isReady: boolean;
  readonly storeName: string;

  constructor(connection: IDBWrapper, storeName: string) {
    this.storeName = storeName;
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

  protected async iterate<T>(
    mode: IDBTransactionModes,
    query?: KeyRangeSettings
  ): Promise<IDBCursorWithTypedValue<T>> {
    if (!this.isReady) {
      await this.connection.wait();
    }

    return this.connection.openCursor(this.storeName, mode, query);
  }
}

export default Repository;
