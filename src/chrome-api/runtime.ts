export const Runtime = {
  /**
   * This method runs whenever the extension is installed, updated, or chrome is updated
   * - onAll() : runs first and on every reason for installation.
   * - installCb() : runs first time you download the extension
   * - updateCb() : runs every time you update the extension or refresh it
   * - chromeUpdateCb() : runs every time chrome is updated
   */
  onInstall({
    installCb,
    updateCb,
    chromeUpdateCb,
    onExtensionUninstalledUrl,
    onAll,
  }: {
    installCb?: () => void;
    updateCb?: () => void;
    chromeUpdateCb?: () => void;
    onAll?: () => void;
    onExtensionUninstalledUrl?: string;
  }) {
    chrome.runtime.onInstalled.addListener(({ reason }) => {
      onAll?.();
      switch (reason) {
        case chrome.runtime.OnInstalledReason.INSTALL:
          onExtensionUninstalledUrl &&
            chrome.runtime.setUninstallURL(onExtensionUninstalledUrl);
          installCb?.();
          break;
        case chrome.runtime.OnInstalledReason.UPDATE:
          updateCb?.();
          break;
        case chrome.runtime.OnInstalledReason.CHROME_UPDATE:
          chromeUpdateCb?.();
          break;
      }
    });
  },
  openOptionsPage: chrome.runtime.openOptionsPage.bind(chrome.runtime),
  getUrl: chrome.runtime.getURL.bind(chrome.runtime),
};
