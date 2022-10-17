// Copyright (c) 2020-2022, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.

import IDBWrapper from "idb_wrapper.js";
import { readable } from "svelte/store";
import { migrationHandler, FMT_DB_NAME, FMT_DB_VER } from "./migrations";

const idbConnector = readable<IDBWrapper>(
  new IDBWrapper({
    dbName: FMT_DB_NAME,
    dbVersion: FMT_DB_VER,
    upgradeHandler: migrationHandler,
    persistent: true,
  })
);

export default idbConnector;
