// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { derived, type Readable } from "svelte/store";
import type IDBWrapper from "idb_wrapper.js";
import { IDBTransactionModes } from "idb_wrapper.js";
import idbConnector from "./idb";
import type { IRepository } from "./repository";
import Repository from "./repository";
import type { IUserProfile } from "../models/userProfile";
import type { RecordId } from "../models/record";
import UserProfile from "../models/userProfile";

const FMT_DB_PROFILES_STORE = "fmt_profiles";

class ProfileRepository extends Repository implements IProfileRepository {
  getAllProfiles(): Promise<IUserProfile[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
      const profileStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const getAllRequest = profileStore.getAll();
      getAllRequest.onsuccess = (ev: Event) => {
        // @ts-ignore
        const profiles: any[] | undefined = ev?.target?.result;
        resolve(
          profiles
            ? profiles.map((profile) => UserProfile.fromObject(profile))
            : []
        );
      };
      getAllRequest.onerror = (_ev: Event) => {
        reject("Failed getting all profiles");
      };
    });
  }

  getProfile(profileId: RecordId): Promise<IUserProfile | null> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
      const profileStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readonly
      );
      const getRequest = profileStore.get(profileId);
      getRequest.onsuccess = (ev: Event) => {
        //@ts-ignore
        const result: any | undefined = ev?.target?.result;
        try {
          const profile = result ? UserProfile.fromObject(result) : null;
          resolve(profile);
        } catch (err) {
          reject(err);
        }
      };
      getRequest.onerror = (_ev: Event) => {
        reject(`Failed getting profile with id '${profileId}`);
      };
    });
  }

  addProfile(profile: IUserProfile): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
      const profileStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const dateModified = new Date();
      const userProfile = UserProfile.fromObject(profile, dateModified);
      const addRequest = profileStore.add(userProfile);
      addRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      addRequest.onerror = (_ev: Event) => {
        reject(`Failed adding profile ${JSON.stringify(userProfile)}`);
      };
    });
  }

  updateProfile(profile: IUserProfile): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
      const profileStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const dateModified = new Date();
      const userProfile = UserProfile.fromObject(profile, dateModified);
      const putRequest = profileStore.put(userProfile);
      putRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      putRequest.onerror = (_ev: Event) => {
        reject(`Failed updating profile ${JSON.stringify(userProfile)}`);
      };
    });
  }

  deleteProfile(profileId: RecordId): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.isReady) {
        await this.connection.wait();
      }
      const profileStore = this.connection.getObjectStore(
        this.storeName,
        IDBTransactionModes.Readwrite
      );
      const deleteRequest = profileStore.delete(profileId);
      deleteRequest.onsuccess = (_ev: Event) => {
        resolve();
      };
      deleteRequest.onerror = (_ev: Event) => {
        reject(`Failed deleting profile with id '${profileId}`);
      };
    });
  }
}

const profileRepositoryProvider = derived<
  Readable<IDBWrapper>,
  IProfileRepository
>(idbConnector, (connector, set) => {
  let isIntialized = false;
  if (idbConnector && !isIntialized) {
    isIntialized = true;
    set(new ProfileRepository(connector, FMT_DB_PROFILES_STORE));
  }
});

export interface IProfileRepository extends IRepository {
  getAllProfiles: () => Promise<IUserProfile[]>;
  getProfile: (profileId: RecordId) => Promise<IUserProfile | null>;
  addProfile: (profile: IUserProfile) => Promise<void>;
  updateProfile: (profile: IUserProfile) => Promise<void>;
  deleteProfile: (profileId: RecordId) => Promise<void>;
}
export default profileRepositoryProvider;