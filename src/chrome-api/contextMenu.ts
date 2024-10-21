// requires the contextMenus API permission

export default class ContextMenu {
  static LIMIT = chrome.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT;
  static menuCount = 0;
  private cb?: (info: chrome.contextMenus.OnClickData) => void;
  constructor(public menuId: string) {}

  create(args: chrome.contextMenus.CreateProperties) {
    if (ContextMenu.menuCount >= ContextMenu.LIMIT) {
      throw new Error(
        `Exceeds the maximum number of top level menu items, which is ${ContextMenu.LIMIT}`
      );
    }
    chrome.contextMenus.create({
      ...args,
      id: this.menuId,
    });
    ContextMenu.menuCount++;
  }

  onClicked(callback: (info: chrome.contextMenus.OnClickData) => void) {
    const cb = (info: chrome.contextMenus.OnClickData) => {
      if (info.menuItemId === this.menuId) {
        callback(info);
      }
    };
    this.cb = cb;
    chrome.contextMenus.onClicked.addListener(this.cb);
  }

  update(args: chrome.contextMenus.UpdateProperties) {
    chrome.contextMenus.update(this.menuId, args);
  }

  remove() {
    chrome.contextMenus.remove(this.menuId);
    if (this.cb) {
      chrome.contextMenus.onClicked.removeListener(this.cb);
    }
    ContextMenu.menuCount--;
  }

  static removeAll() {
    chrome.contextMenus.removeAll();
    ContextMenu.menuCount = 0;
  }
}
