import { isDateString } from "../utils/utils";

export type RecordId = number;

export function validateRecord(id: any, lastModified: any, tzMinutes: any) {
  if (!Number.isInteger(id)) {
    throw `ID must be a valid integer. Got '${id}'`;
  }
  if (!isDateString(lastModified)) {
    throw `Invalid last modified date. Got '${lastModified}'`;
  }
  if (!Number.isInteger(tzMinutes)) {
    throw `Invalid timezone offset value. Got '${tzMinutes}'`;
  }
}

export default interface IDBRecord {
  id: RecordId;
  lastModified: String; // UTC ISO string
  tzMinutes: number; // Timezone offset from UTC in minutes
}