// requires "offscreen" permission in manifest.json

export default class Offscreen {
  private static creating: Promise<null | undefined | void> | null; // A global promise to avoid concurrency issues
  static reasons = {
    DOM_PARSER: chrome.offscreen.Reason.DOM_PARSER, // access to the DOMParser API
    CLIPBOARD: chrome.offscreen.Reason.CLIPBOARD, // access to the clipboard API
    TESTING: chrome.offscreen.Reason.TESTING, // used for testing purposes
    BLOBS: chrome.offscreen.Reason.BLOBS, // access to the Blob API and creating blobs
    LOCAL_STORAGE: chrome.offscreen.Reason.LOCAL_STORAGE, // access to the localStorage API
    GEOLOCATION: chrome.offscreen.Reason.GEOLOCATION, // access to the geolocation API
    USER_MEDIA: chrome.offscreen.Reason.USER_MEDIA, // access to the getUserMedia API
    DISPLAY_MEDIA:
      chrome.offscreen.Reason
        .DISPLAY_MEDIA /** The offscreen document needs to interact with 
        media streams from display media (e.g. getDisplayMedia()). */,
  };
  static getReasons(reasons: (keyof (typeof Offscreen)["reasons"])[]) {
    return reasons as chrome.offscreen.Reason[];
  }

  static async getOffscreenDocument() {
    const existingContexts = await chrome.runtime.getContexts({});

    const offscreenDocument = existingContexts.find(
      (c) => c.contextType === "OFFSCREEN_DOCUMENT"
    );
    return offscreenDocument;
  }

  static async setupOffscreenDocument({
    url,
    justification,
    reasons,
  }: chrome.offscreen.CreateParameters) {
    // Check all windows controlled by the service worker to see if one
    // of them is the offscreen document with the given path

    if (await Offscreen.hasDocument(url)) return;

    // create offscreen document
    if (Offscreen.creating) {
      await Offscreen.creating;
    } else {
      Offscreen.creating = chrome.offscreen.createDocument({
        url,
        justification,
        reasons,
      });
      await Offscreen.creating;
      Offscreen.creating = null;
    }
  }

  static async closeDocument() {
    await chrome.offscreen.closeDocument();
  }

  private static async hasDocument(path: string) {
    const offscreenUrl = chrome.runtime.getURL(path);
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
      documentUrls: [offscreenUrl],
    });
    return existingContexts.length > 0;
  }
}
