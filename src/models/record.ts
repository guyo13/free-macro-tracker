// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import { isDateString } from "../utils/utils";

export type RecordId = number;

export function validateRecord(id, lastModified, tzMinutes) {
  validateRecordId(id);
  validateDateString(lastModified);
  validateTzMinutes(tzMinutes);
}

export function validateRecordId(id) {
  if (!Number.isInteger(id)) {
    throw `ID must be a valid integer. Got '${id}'`;
  }
}

export function validateDateString(ds) {
  if (!isDateString(ds)) {
    throw `Invalid date. Got '${ds}'`;
  }
}

export function validateTzMinutes(tzMinutes) {
  if (!Number.isInteger(tzMinutes)) {
    throw `Invalid timezone offset value. Got '${tzMinutes}'`;
  }
}

export function updateRecordDates(record: IDBRecord) {
  const date = new Date();
  record.lastModified = date.toISOString();
  record.tzMinutes = date.getTimezoneOffset();
}

export default interface IDBRecord {
  id: RecordId;
  lastModified: string; // UTC ISO string
  tzMinutes: number; // Timezone offset from UTC in minutes
}
