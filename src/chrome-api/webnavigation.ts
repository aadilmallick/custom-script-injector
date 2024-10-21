export default class WebNavigation {
  static onNavigationCompleted() {
    return (cb: (url: string, tabId: number) => void) => {
      chrome.webNavigation.onCompleted.addListener(({ url, tabId }) => {
        cb(url, tabId);
      });
    };
  }

  static onBeforeNavigate() {
    return (cb: (url: string, tabId: number) => void) => {
      chrome.webNavigation.onBeforeNavigate.addListener(({ url, tabId }) => {
        cb(url, tabId);
      });
    };
  }
}
