export default class Action {
  static setExtensionIcon(iconData: string | ImageData): void;
  static setExtensionIcon(iconData: string | ImageData) {
    if (typeof iconData === "string") {
      chrome.action.setIcon({ path: iconData });
    } else {
      chrome.action.setIcon({ imageData: iconData });
    }
  }

  static openPopup() {
    chrome.action.openPopup();
  }

  static async setActionTitle(title: string, tabId?: number) {
    await chrome.action.setTitle({ title, tabId });
  }

  static async setActionBadge(
    {
      bgcolor,
      text,
      textcolor,
    }: { text?: string; bgcolor?: string; textcolor?: string },
    tabId?: number
  ) {
    if (text) {
      await chrome.action.setBadgeText({ text, tabId });
    }
    if (bgcolor) {
      await chrome.action.setBadgeBackgroundColor({ color: bgcolor, tabId });
    }
    if (textcolor) {
      await chrome.action.setBadgeTextColor({ color: textcolor, tabId });
    }
  }

  static setActionEnabled(enabled: boolean) {
    if (enabled) {
      chrome.action.enable();
    } else {
      chrome.action.disable();
    }
  }

  static onActionClicked = chrome.action.onClicked.addListener.bind(
    chrome.action.onClicked
  );
}
