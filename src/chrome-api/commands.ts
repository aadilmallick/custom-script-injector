export default class Commands {
  constructor(private commands: Record<string, () => void>) {}

  addListeners() {
    chrome.commands.onCommand.addListener((command) => {
      if (this.commands[command]) {
        this.commands[command]();
      }
    });
  }

  static onExecuteAction(cb: () => void) {
    chrome.action.onClicked.addListener(cb);
  }

  static async getAllCommands() {
    return await chrome.commands.getAll();
  }

  static async getActiveCommands() {
    const commands = await Commands.getAllCommands();
    return commands.filter((command) => command.shortcut !== "");
  }
}
