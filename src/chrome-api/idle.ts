type IdleStateCallback = (newState: "active" | "idle" | "locked") => void;

export default class Idle {
  /**
   * triggered when the system changes idle state
   */
  static onStateChanged(cb: IdleStateCallback) {
    chrome.idle.onStateChanged.addListener(cb);
  }

  /**
   * Returns the idle state of the system.
   * @param intervalSeconds must be greater than 15
   * @param cb
   */
  static async queryState(intervalSeconds: number) {
    await chrome.idle.queryState(Math.max(intervalSeconds, 15));
  }
}
