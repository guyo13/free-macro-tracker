// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import type {
  CursorConsumer,
  IDBTransactionModes,
  KeyRangeSettings,
} from "idb_wrapper.js";
import type IDBWrapper from "idb_wrapper.js";
import type IDBRecord from "../models/record";
import { updateRecordDates } from "../models/record";

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
      .catch(() => (this.#isReady = false));
  }

  get isReady(): boolean {
    return this.#isReady;
  }

  get connection(): IDBWrapper {
    return this.#connection;
  }

  protected async iterate<T>(
    mode: IDBTransactionModes,
    consumer: CursorConsumer<T>,
    query?: KeyRangeSettings
  ): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }

    return this.connection.openCursor(this.storeName, mode, consumer, query);
  }

  protected async add<T>(object: T) {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return this.connection.add(this.storeName, object);
  }

  protected async updateRecord<T extends IDBRecord>(record: T) {
    if (!this.isReady) {
      await this.connection.wait();
    }
    updateRecordDates(record);
    return this.connection.put(this.storeName, record);
  }

  protected async update<T>(object: T) {
    if (!this.isReady) {
      await this.connection.wait();
    }

    return this.connection.put(this.storeName, object);
  }

  protected async delete(query: IDBValidKey | IDBKeyRange) {
    if (!this.isReady) {
      await this.connection.wait();
    }

    return this.connection.delete(this.storeName, query);
  }
}

export default Repository;
