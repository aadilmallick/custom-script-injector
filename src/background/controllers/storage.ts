import { LocalStorage, SyncStorage } from "../../chrome-api/storage";

export interface Script {
  id: string;
  url: string;
  code: string;
}

export const scriptsStorage = new LocalStorage({
  scripts: [] as Script[],
});
export const appSettingsStorage = new SyncStorage({});

// define static methods here
export class StorageHandler {}
