export class UserScripts {
  static isUserScriptsAvailable() {
    try {
      // Property access which throws if developer mode is not enabled.
      const thing = chrome.userScripts === undefined;
      if (thing) {
        return false;
      }
      return true;
    } catch {
      // Not available.
      return false;
    }
  }

  static async getAllScripts() {
    const scripts = await chrome.userScripts.getScripts();
    return scripts;
  }

  static setWorld() {
    chrome.userScripts.configureWorld({
      csp: "script-src 'self'",
    });
  }

  constructor(public readonly id: string) {}

  async registerScript(matchPatterns: string[], js: string) {
    if (await this.getScript()) {
      return;
    }
    console.log("registering script...");
    await chrome.userScripts.register([
      {
        id: this.id,
        matches: matchPatterns,
        js: [{ code: js }],
        world: "USER_SCRIPT",
      },
    ]);
  }

  async getScript() {
    const [script] = await chrome.userScripts.getScripts({
      ids: [this.id],
    });
    if (!script) {
      return null;
    }
    return script;
  }

  async unregisterScript() {
    const script = await this.getScript();
    if (!script) {
      return;
    }
    await chrome.userScripts.unregister({
      ids: [this.id],
    });
  }

  async updateScript(js: string) {
    await chrome.userScripts.update([
      {
        id: this.id,
        js: [{ code: js }],
      },
    ]);
  }
}
