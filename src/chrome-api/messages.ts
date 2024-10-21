type Listener = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;
export class MessagesOneWay<PayloadType = undefined, ResponseType = undefined> {
  private listener: Listener | null = null;
  static channels: string[] = [];
  constructor(private channel: string) {
    if (MessagesOneWay.channels.includes(channel)) {
      throw new Error(`Channel ${channel} already exists`);
    }
    MessagesOneWay.channels.push(channel);
  }

  /**
   * for sending message from process to another process
   *
   */
  sendP2P(payload: PayloadType) {
    chrome.runtime.sendMessage({ type: this.channel, ...payload });
  }

  /**
   * for sending message from a content script to another process
   *
   */
  sendC2P(payload: PayloadType) {
    chrome.runtime.sendMessage({ type: this.channel, ...payload });
  }

  /**
   * for sending message from a process to a content script
   */
  sendP2C(tabId: number, payload: PayloadType) {
    chrome.tabs.sendMessage(tabId, { type: this.channel, ...payload });
  }

  /**
   * for sending message from a process to a content script, waiting for content script to load
   */
  sendP2CWithPing(tabId: number, payload: PayloadType) {
    MessagesModel.waitForContentScript(tabId, () => {
      chrome.tabs.sendMessage(tabId, { type: this.channel, ...payload });
    });
  }

  /**
   * for sending message from process to another process
   *
   */
  async sendP2PAsync(payload: PayloadType) {
    return (await chrome.runtime.sendMessage({
      type: this.channel,
      ...payload,
    })) as ResponseType;
  }

  /**
   * for sending message from a content script to another process
   *
   */
  async sendC2PAsync(payload: PayloadType) {
    return (await chrome.runtime.sendMessage({
      type: this.channel,
      ...payload,
    })) as ResponseType;
  }

  /**
   * for sending message from a process to a content script async
   */
  async sendP2CAsync(tabId: number, payload: PayloadType) {
    return (await chrome.tabs.sendMessage(tabId, {
      type: this.channel,
      ...payload,
    })) as ResponseType;
  }

  async sendP2CAsyncWithPing(tabId: number, payload: PayloadType) {
    const response = await MessagesModel.waitForContentScript(
      tabId,
      async () => {
        return (await chrome.tabs.sendMessage(tabId, {
          type: this.channel,
          ...payload,
        })) as ResponseType;
      }
    );
    return response;
  }

  listen(callback: (payload: PayloadType) => void) {
    const listener: Listener = (
      message: PayloadType & { type: string },
      sender: any,
      sendResponse: any
    ) => {
      if (message.type === this.channel) {
        callback(message);
      }
    };
    this.listener = listener;
    chrome.runtime.onMessage.addListener(this.listener);
  }

  static listenToMessages(
    callback: (
      message: any,
      sender?: any,
      sendResponse?: (t: any) => void
    ) => void
  ) {
    chrome.runtime.onMessage.addListener(callback);
    return callback;
  }

  listenAsync(callback: (payload: PayloadType) => Promise<ResponseType>) {
    const listener: Listener = async (
      message: PayloadType & { type: string },
      sender: any,
      sendResponse: any
    ) => {
      if (message.type === this.channel) {
        const response = await callback(message);
        sendResponse(response);
        return true;
      }
      return true;
    };
    this.listener = listener;
    chrome.runtime.onMessage.addListener(this.listener);
  }

  removeListener() {
    if (this.listener) {
      chrome.runtime.onMessage.removeListener(this.listener);
    }
  }

  parseMessage(message: any) {
    if (!message.type) {
      return { messageBelongsToChannel: false, payload: undefined };
    }
    if (message.type === this.channel) {
      return {
        messageBelongsToChannel: true,
        payload: message as PayloadType & { type: string },
      };
    } else {
      return { messageBelongsToChannel: false, payload: undefined };
    }
  }
}

export class MessagesModel {
  private static pingContentScript(
    tabId: number,
    maxRetries = 10,
    interval = 500
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      function sendPing() {
        attempts++;
        chrome.tabs.sendMessage(tabId, { type: "PING" }, (response) => {
          if (chrome.runtime.lastError) {
            if (attempts < maxRetries) {
              setTimeout(sendPing, interval); // Retry after a delay
            } else {
              reject("Content script not responding.");
            }
          } else if (response && response.status === "PONG") {
            resolve("Content script is ready.");
          } else {
            reject("Unexpected response from content script.");
          }
        });
      }

      sendPing();
    });
  }

  static receivePingFromBackground() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "PING") {
        sendResponse({ status: "PONG" });
      }
    });
  }

  static async waitForContentScript<T = void>(
    tabId: number,
    cb: () => T | Promise<T>
  ): Promise<T>;
  static async waitForContentScript<T = void>(
    tabId: number,
    {
      successCb,
      errorCb,
    }: {
      successCb: (message?: string) => void;
      errorCb?: () => void;
    }
  ): Promise<T>;

  static async waitForContentScript<T = void>(
    tabId: number,
    optionsOrCb:
      | {
          successCb: (message?: string) => T | Promise<T>;
          errorCb?: () => void;
        }
      | (() => void | Promise<void>)
  ) {
    try {
      const message = await this.pingContentScript(tabId);
      if (typeof optionsOrCb === "function") {
        return await optionsOrCb();
      }
      return await optionsOrCb.successCb(message);
    } catch (error) {
      console.error("Error pinging content script", error);
      if (typeof optionsOrCb === "function") {
        return;
      }
      optionsOrCb.errorCb?.();
    }
  }
}
