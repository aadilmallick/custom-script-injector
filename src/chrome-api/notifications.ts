// requires "notifications" permission in manifest.json

export default class NotificationModel {
  static showBasicNotification({
    title,
    message,
    iconPath,
  }: {
    title: string;
    message: string;
    iconPath: string;
  }) {
    chrome.notifications.create({
      message,
      title: title,
      type: "basic",
      iconUrl: iconPath,
    });
  }

  constructor(private notificationId: string) {}

  showNotification(
    options: chrome.notifications.NotificationOptions<true>,
    cb?: (notificationId: string) => void
  ) {
    chrome.notifications.create(this.notificationId, options, cb);
  }

  clearNotification() {
    chrome.notifications.clear(this.notificationId);
  }
}

/**
 * Examples
 * 
 * 
 * NotificationModel.show({
    message: "Extension installed",
    title: "Extension installed",
    iconUrl: "icon.png",
    type: "basic",
    buttons: [
      {
        title: "View",
      },
    ],
  });
 */
