// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { derived, type Readable } from "svelte/store";
import type IDBWrapper from "idb_wrapper.js";
import {
  IDBTransactionModes,
  type IDBCursorWithTypedValue,
  type KeyRangeSettings,
} from "idb_wrapper.js";
import idbConnector from "./idb";
import type { IRepository } from "./repository";
import Repository from "./repository";
import { type RecordId } from "../models/record";
import type { IUserGoals } from "../models/userGoals";
import UserGoals from "../models/userGoals";

const FMT_DB_USER_GOALS_STORE = "fmt_user_goals";

class UserGoalsRepository extends Repository implements IUserGoalsRepository {
  async iterateUserGoals(): Promise<IDBCursorWithTypedValue<IUserGoals>> {
    return this.iterate<IUserGoals>(IDBTransactionModes.Readonly);
  }

  async getUserGoals(
    profileId: RecordId,
    year: number,
    month: number,
    day: number
  ): Promise<IUserGoals | null> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const store = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const key = [profileId, year, month, day];
      const getRequest = store.get(key);
      getRequest.onsuccess = (ev: Event) => {
        // @ts-ignore
        const result: any | undefined = ev?.target?.result;
        try {
          const userGoals = result ? UserGoals.fromObject(result) : null;
          resolve(userGoals);
        } catch (err) {
          reject(err);
        }
      };
      getRequest.onerror = (_ev: Event) => {
        reject(`Failed getting user goals with key ${key}`);
      };
    });
  }

  async addUserGoals(userGoals: IUserGoals): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const store = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const addRequest = store.add(userGoals);
      addRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      addRequest.onerror = (_ev: Event) => {
        reject(`Failed adding user goals ${JSON.stringify(userGoals)}`);
      };
    });
  }

  async updateUserGoals(userGoals: IUserGoals): Promise<void> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return new Promise((resolve, reject) => {
      const store = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const putRequest = store.put(userGoals);
      putRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      putRequest.onerror = (_ev: Event) => {
        reject(`Failed updating user goals ${JSON.stringify(userGoals)}`);
      };
    });
  }

  queryByProfileAndDate(
    query: KeyRangeSettings
  ): Promise<IDBCursorWithTypedValue<IUserGoals>> {
    return this.iterate<IUserGoals>(IDBTransactionModes.Readonly, query);
  }
}

const userGoalsRepositoryProvider = derived<
  Readable<IDBWrapper>,
  IUserGoalsRepository
>(idbConnector, (connector, set) => {
  let isInitialized = false;
  if (idbConnector && !isInitialized) {
    isInitialized = true;
    set(new UserGoalsRepository(connector, FMT_DB_USER_GOALS_STORE));
  }
});

export interface IUserGoalsRepository extends IRepository {
  iterateUserGoals: () => Promise<IDBCursorWithTypedValue<IUserGoals>>;
  getUserGoals: (
    profileId: RecordId,
    year: number,
    month: number,
    day: number
  ) => Promise<IUserGoals | null>;
  addUserGoals: (userGoals: IUserGoals) => Promise<void>;
  updateUserGoals: (userGoals: IUserGoals) => Promise<void>;
  queryByProfileAndDate: (
    query: KeyRangeSettings
  ) => Promise<IDBCursorWithTypedValue<IUserGoals>>;
}
export default userGoalsRepositoryProvider;
