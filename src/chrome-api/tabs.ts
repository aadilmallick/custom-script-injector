// requires tabs permission for accessing sensitive properties like url, title, etc

interface TabAudioModel {
  toggleMuted(): Promise<void>;
  getMuted(): Promise<boolean>;
}

interface TabZoomModel {
  setZoom(zoomFactor: number): Promise<void>;
  getZoom(): Promise<number>;
  resetZoom(): Promise<void>;
  onZoomChanged: (
    callback: (ZoomChangeInfo: chrome.tabs.ZoomChangeInfo) => void
  ) => void;
  listener?: (ZoomChangeInfo: chrome.tabs.ZoomChangeInfo) => void;

  removeListener: () => void;
}

export default class Tabs {
  static async getCurrentTab() {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    return tab;
  }

  static async createTab(options: chrome.tabs.CreateProperties) {
    return await chrome.tabs.create(options);
  }

  static async getTabById(tabId: number) {
    return await chrome.tabs.get(tabId);
  }

  static async moveTab(tabId: number, index: number) {
    return await chrome.tabs.move(tabId, { index });
  }

  static async reloadTab(tabId: number) {
    await chrome.tabs.reload(tabId);
  }

  static async deleteTabs(tabIds: number[]) {
    await chrome.tabs.remove(tabIds);
  }

  /**
   * Gets all tabs from the current window, or a different window if you specify the windowId
   */
  static async getAllTabs(windowId?: number) {
    return await chrome.tabs.query({ windowId });
  }

  static Audio = {
    async toggleMuted(tab: chrome.tabs.Tab) {
      if (!tab.id) throw new Error("Tab id not found");
      await chrome.tabs.update(tab.id, {
        muted: tab.mutedInfo?.muted ? false : true,
      });
    },

    async getMuted(tab: chrome.tabs.Tab) {
      if (!tab.id) throw new Error("Tab id not found");
      return tab.mutedInfo?.muted ?? false;
    },
  };

  static Zoom = {
    async setZoom(tabId: number, zoomFactor: number) {
      await chrome.tabs.setZoom(tabId, zoomFactor);
    },
    async getZoom(tabId: number) {
      const zoomFactor = await chrome.tabs.getZoom(tabId);
      return zoomFactor;
    },
    async resetZoom(tabId: number) {
      await chrome.tabs.setZoom(tabId, 0);
    },
  };

  static Events = {
    onTabNavigateComplete(cb: (tabId: number, tab: chrome.tabs.Tab) => void) {
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === "complete") {
          cb(tabId, tab);
        }
      });
    },
    onTabHighlighted(
      cb: (highlightInfo: chrome.tabs.TabHighlightInfo) => void
    ) {
      chrome.tabs.onHighlighted.addListener(cb);
    },
  };
}

export class TabModel {
  public tab?: chrome.tabs.Tab;
  public audio!: TabAudioModel;
  public zoom!: TabZoomModel;
  constructor(tab?: chrome.tabs.Tab) {
    if (tab) {
      this.init(tab);
    }
  }

  init(tab: chrome.tabs.Tab) {
    this.tab = tab;
    this.audio = {
      getMuted: Tabs.Audio.getMuted.bind(null, this.tab),
      toggleMuted: Tabs.Audio.toggleMuted.bind(null, this.tab),
    };
    this.zoom = {
      getZoom: Tabs.Zoom.getZoom.bind(null, this.tab.id!),
      setZoom: Tabs.Zoom.setZoom.bind(null, this.tab.id!),
      resetZoom: Tabs.Zoom.resetZoom.bind(null, this.tab.id!),
      onZoomChanged: (
        callback: (ZoomChangeInfo: chrome.tabs.ZoomChangeInfo) => void
      ) => {
        this.zoom.listener = callback;
        chrome.tabs.onZoomChange.addListener(this.zoom.listener);
      },
      removeListener: () => {
        if (this.zoom.listener) {
          chrome.tabs.onZoomChange.removeListener(this.zoom.listener);
        }
      },
    };
  }

  async moveToIndex(index: number) {
    if (!this.tab?.id) throw new Error("Tab id not found");
    await chrome.tabs.move(this.tab.id, { index });
  }

  async remove() {
    if (!this.tab?.id) throw new Error("Tab id not found");
    await chrome.tabs.remove(this.tab.id);
  }
}
