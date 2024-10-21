/**
 * requires permissions: "identity.email" in manifest.json
 */
export class IdentityEmail {
  static async getProfile() {
    return await chrome.identity.getProfileUserInfo({});
  }
}

/**
 * requires permissions: "identity" in manifest.json
 */
export class Identity {
  static async getBasicAuthToken() {
    return await chrome.identity.getAuthToken({ interactive: true });
  }
}
