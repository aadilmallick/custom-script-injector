export default class Windows {
  static async createBasicWindow(urls?: string[]) {
    return await chrome.windows.create({
      url: urls,
      focused: true,
      state: "fullscreen",
    });
  }
}
