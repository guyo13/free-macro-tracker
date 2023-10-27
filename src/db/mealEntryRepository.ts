import { derived, type Readable } from "svelte/store";
import IDBWrapper from "idb_wrapper.js";
import type { CursorConsumer } from "idb_wrapper.js";
import idbConnector from "./idb";
import type { IRepository } from "./repository";
import Repository from "./repository";
import type { IMealEntry } from "../models/mealEntry";

const FMT_DB_MEAL_ENTRY_STORE = "fmt_meal_entries";

class MealEntryRepository extends Repository implements IMealEntryRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryByProfileAndDate(_consumer: CursorConsumer<IMealEntry>): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export interface IMealEntryRepository extends IRepository {
  queryByProfileAndDate: (
    consumer: CursorConsumer<IMealEntry>
  ) => Promise<void>;
}

const mealEntryRepositoryProvider = derived<
  Readable<IDBWrapper>,
  IMealEntryRepository
>(idbConnector, (connector, set) => {
  if (idbConnector) {
    set(new MealEntryRepository(connector, FMT_DB_MEAL_ENTRY_STORE));
  }
});

export default mealEntryRepositoryProvider;
