export abstract class ChromeStorage<
  T extends Record<string, any> = Record<string, any>
> {
  abstract areaName: chrome.storage.AreaName;
  constructor(
    protected storage:
      | chrome.storage.SyncStorageArea
      | chrome.storage.LocalStorageArea,
    protected defaultData?: T
  ) {
    this.storage = storage;
  }

  async setup() {
    if (!this.defaultData) return;
    console.info("Setting up storage...");
    const data = await this.getAll();
    // if storage is completely empty, set the default data
    if (!data || Object.keys(data).length === 0) {
      await this.storage.set(this.defaultData);
    }
    console.info("Storage setup complete");
  }

  async getAll() {
    const data = await this.storage.get(this.getKeys());
    return data as T;
  }

  getKeys() {
    if (!this.defaultData) return [];
    return Object.keys(this.defaultData) as (keyof T)[];
  }

  async getAllKeys() {
    const data = (await this.storage.get(null)) as unknown as T;
    return Object.keys(data);
  }

  async set<K extends keyof T>(key: K, value: T[K]) {
    await this.storage.set({ [key]: value });
  }

  async setMultiple(data: Partial<T>) {
    await this.storage.set(data);
  }

  async remove<K extends keyof T>(key: K) {
    await this.storage.remove(key as string);
  }

  async removeMultiple<K extends keyof T>(keys: K[]) {
    await this.storage.remove(keys as string[]);
  }

  async clear() {
    await this.storage.clear();
  }

  async get<K extends keyof T>(key: K) {
    const data = (await this.storage.get([key])) as Record<K, T[K]>;
    return data[key] as T[K];
  }

  async getMultiple<K extends keyof T>(keys: K[]) {
    return (await this.storage.get(keys)) as Extract<T, Record<K, any>>;
  }

  /**
   * gets the storage percentage used
   */
  async getStoragePercentageUsed() {
    const data = (await this.storage.getBytesInUse(null)) as unknown as number;
    return (data / this.storage.QUOTA_BYTES) * 100;
  }

  onChanged(
    callback: (change: chrome.storage.StorageChange, key: keyof T) => void
  ) {
    type StorageCallback = (
      changes: {
        [key: string]: chrome.storage.StorageChange;
      },
      areaName: chrome.storage.AreaName
    ) => void;
    const handler: StorageCallback = async (changes, namespace) => {
      let keys = this.getKeys();
      if (keys.length === 0) {
        keys = await this.getAllKeys();
      }
      if (namespace === this.areaName) {
        for (const key in changes) {
          if (keys.includes(key)) {
            const change = changes[key];
            callback(change, key as keyof T);
          }
        }
      }
    };
    chrome.storage.onChanged.addListener(handler);

    return handler;
  }
}

export class SyncStorage<
  T extends Record<string, any> = Record<string, any>
> extends ChromeStorage<T> {
  override areaName = "sync" as chrome.storage.AreaName;
  constructor(defaultData?: T) {
    super(chrome.storage.sync, defaultData);
  }
}

export class LocalStorage<
  T extends Record<string, any> = Record<string, any>
> extends ChromeStorage<T> {
  override areaName = "local" as chrome.storage.AreaName;

  constructor(defaultData?: T) {
    super(chrome.storage.local, defaultData);
  }
}
