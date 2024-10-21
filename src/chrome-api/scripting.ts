function getArray(scripts: string | string[]): string[] {
  let scriptsArray: string[] = [];
  if (typeof scripts === "string") {
    scriptsArray = [scripts];
  } else {
    scriptsArray = scripts;
  }
  return scriptsArray;
}

export default class Scripting {
  static async executeScripts(
    tabId: number,
    scripts: string | string[],
    world: "MAIN" | "ISOLATED" = "ISOLATED"
  ) {
    await chrome.scripting.executeScript({
      files: getArray(scripts),
      target: { tabId },
      world,
    });
  }

  /**
   * Executing a function in the context of the DOM of page, but comes with limitations:
   * - The function arguments must be JSON serializable. No functions or DOM elements.
   * - The function must be self-contained and not reference anything outside of it.
   * - The function cannot use any chrome APIs.
   *
   * @param tabId represents the tab to run the script in
   * @param cb A function to run in the context of the tab
   * @param args Any arguments you pass must be JSON-serializable and not reference anything outside.
   * @returns
   */
  static async executeFunction<T, V extends Record<string, any>>(
    tabId: number,
    cb: (args: V) => Promise<T>,
    args: V
  ) {
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      func: cb,
      args: [args],
    });
    return result[0].result as T;
  }

  static async insertCss(tabId: number, cssFiles: string | string[]) {
    await chrome.scripting.insertCSS({
      files: getArray(cssFiles),
      target: { tabId },
    });
  }

  static async removeCss(tabId: number, cssFiles: string | string[]) {
    await chrome.scripting.removeCSS({
      files: getArray(cssFiles),
      target: { tabId },
    });
  }
}

export class ContentScriptModel {
  constructor(
    private scriptData: {
      script: string;
      matches: string[];
      id: string;
      css?: string[];
      world?: "MAIN" | "ISOLATED";
    }
  ) {}

  async upsertScript() {
    const script = await this.getScript();
    if (script) {
      await this.unregisterScript();
    }
    await this.registerScript();
  }

  async registerScript() {
    await chrome.scripting.registerContentScripts([
      {
        id: this.scriptData.id,
        js: [this.scriptData.script],
        matches: this.scriptData.matches,
        css: this.scriptData.css,
        world: this.scriptData.world || "ISOLATED",
        persistAcrossSessions: false,
      },
    ]);
  }

  async unregisterScript() {
    await chrome.scripting.unregisterContentScripts({
      ids: [this.scriptData.id],
    });
  }

  async getScript(): Promise<
    chrome.scripting.RegisteredContentScript | undefined
  > {
    const scripts = await chrome.scripting.getRegisteredContentScripts({
      ids: [this.scriptData.id],
    });
    return scripts ? scripts[0] : undefined;
  }
}
