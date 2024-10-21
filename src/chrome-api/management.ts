interface ExtensionListeners {
  enabledCb: (info: chrome.management.ExtensionInfo) => void;
  disabledCb: (info: chrome.management.ExtensionInfo) => void;
  installedCb: (info: chrome.management.ExtensionInfo) => void;
  uninstalledCb: (extensionId: string) => void;
}

export default class Management {
  /**
   * Returns information about the extension. Does not need any permissions.
   */
  static async getExtensionInfo() {
    return await chrome.management.getSelf();
  }

  listenForExtensionUpdates(cbs: Partial<ExtensionListeners>) {
    cbs.enabledCb && chrome.management.onEnabled.addListener(cbs.enabledCb);
    cbs.disabledCb && chrome.management.onDisabled.addListener(cbs.disabledCb);
    cbs.installedCb &&
      chrome.management.onInstalled.addListener(cbs.installedCb);
    cbs.uninstalledCb &&
      chrome.management.onUninstalled.addListener(cbs.uninstalledCb);
  }
}
