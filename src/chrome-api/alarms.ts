// requires alarms permission

export class ChromeAlarm {
  private alarmCB?: (alarm: chrome.alarms.Alarm) => void;
  constructor(private alarmName: string) {}

  async createAlarm(alarmInfo: chrome.alarms.AlarmCreateInfo) {
    await chrome.alarms.create(this.alarmName, alarmInfo);
  }

  async upsertAlarm(alarmInfo: chrome.alarms.AlarmCreateInfo) {
    const alarm = await this.getAlarm();
    if (!alarm) {
      await this.createAlarm(alarmInfo);
      return null;
    }
    return alarm;
  }

  async getAlarm() {
    const alarm = await chrome.alarms.get(this.alarmName);
    if (!alarm) {
      return null;
    }
    return alarm;
  }

  onTriggered(callback: () => void) {
    const alarmCB = (alarm: chrome.alarms.Alarm) => {
      if (alarm.name === this.alarmName) {
        callback();
      }
    };
    this.alarmCB = alarmCB;
    chrome.alarms.onAlarm.addListener(alarmCB);
    return alarmCB;
  }

  /**
   *
   * @returns wasCleared: True if the alarm was successfully cleared, false otherwise.
   */
  async clearAlarm() {
    this.alarmCB && chrome.alarms.onAlarm.removeListener(this.alarmCB);
    return await chrome.alarms.clear(this.alarmName);
  }
}
