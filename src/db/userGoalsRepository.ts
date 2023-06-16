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
  iterateUserGoals(): Promise<IDBCursorWithTypedValue<IUserGoals>> {
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
    const key = [profileId, year, month, day];
    const userGoals = await this.connection.get<IUserGoals>(
      this.storeName,
      key
    );
    return userGoals && UserGoals.fromObject(userGoals);
  }

  addUserGoals(userGoals: IUserGoals): Promise<void> {
    return this.add(userGoals);
  }

  updateUserGoals(userGoals: IUserGoals): Promise<void> {
    return this.update(userGoals);
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
