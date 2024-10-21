export default class PermissionsModel {
  constructor(public permissions: chrome.permissions.Permissions) {}

  async request() {
    return await chrome.permissions.request(this.permissions);
  }

  async requestAndExecuteCallback(cb: (granted: boolean) => void) {
    const isGranted = await chrome.permissions.request(this.permissions);
    cb(isGranted);
  }

  async permissionIsGranted() {
    return await chrome.permissions.contains(this.permissions);
  }

  async remove() {
    return await chrome.permissions.remove(this.permissions);
  }

  static async getAllOptionalPermissions() {
    const permissions = await chrome.permissions.getAll();
    return permissions.permissions;
  }

  static async getAllOptionalHostPermissions() {
    const permissions = await chrome.permissions.getAll();
    return permissions.origins;
  }

  static onPermissionsAdded = chrome.permissions.onAdded.addListener.bind(
    chrome.permissions.onAdded
  );
  static onPermissionsRemoved = chrome.permissions.onRemoved.addListener.bind(
    chrome.permissions.onRemoved
  );
}
