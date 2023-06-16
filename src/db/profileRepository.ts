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
import type { IUserProfile } from "../models/userProfile";
import type { RecordId } from "../models/record";
import UserProfile from "../models/userProfile";

const FMT_DB_PROFILES_STORE = "fmt_profiles";

class ProfileRepository extends Repository implements IProfileRepository {
  iterateProfiles(): Promise<IDBCursorWithTypedValue<IUserProfile>> {
    return this.iterate<IUserProfile>(IDBTransactionModes.Readonly);
  }

  async getAllProfiles(): Promise<IUserProfile[]> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    return (await this.connection.getAll<IUserProfile>(this.storeName))?.map(
      (profile) => UserProfile.fromObject(profile)
    );
  }

  async getProfile(profileId: RecordId): Promise<IUserProfile | null> {
    if (!this.isReady) {
      await this.connection.wait();
    }
    const profile = await this.connection.get<IUserProfile>(
      this.storeName,
      profileId
    );
    return profile && UserProfile.fromObject(profile);
  }

  addProfile(profile: IUserProfile): Promise<void> {
    const userProfile = UserProfile.fromObject(profile, new Date());
    return this.add(userProfile);
  }

  updateProfile(profile: IUserProfile): Promise<void> {
    const userProfile = UserProfile.fromObject(profile, new Date());
    return this.update(userProfile);
  }

  deleteProfile(profileId: RecordId): Promise<void> {
    return this.delete(profileId);
  }
}

const profileRepositoryProvider = derived<
  Readable<IDBWrapper>,
  IProfileRepository
>(idbConnector, (connector, set) => {
  let isInitialized = false;
  if (idbConnector && !isInitialized) {
    isInitialized = true;
    set(new ProfileRepository(connector, FMT_DB_PROFILES_STORE));
  }
});

export interface IProfileRepository extends IRepository {
  iterateProfiles: () => Promise<IDBCursorWithTypedValue<IUserProfile>>;
  getAllProfiles: () => Promise<IUserProfile[]>;
  getProfile: (profileId: RecordId) => Promise<IUserProfile | null>;
  addProfile: (profile: IUserProfile) => Promise<void>;
  updateProfile: (profile: IUserProfile) => Promise<void>;
  deleteProfile: (profileId: RecordId) => Promise<void>;
}
export default profileRepositoryProvider;
