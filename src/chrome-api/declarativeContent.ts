// requires ["declarativeContent"] permission in manifest.json

export class DeclarativeContent {
  public readonly rules: chrome.events.Rule[] = [];

  addRule(
    pageMatchers: chrome.declarativeContent.PageStateMatcher[],
    options: {
      showAction?: boolean;
    } = {}
  ) {
    const rule: chrome.events.Rule = {
      conditions: pageMatchers,
      actions: [
        options.showAction && new chrome.declarativeContent.ShowAction(),
      ].filter((thing) => Boolean(thing)),
    };
    this.rules.push(rule);
  }

  registerRules() {
    const rules = this.rules;
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
      chrome.declarativeContent.onPageChanged.addRules(rules);
    });
  }
}
