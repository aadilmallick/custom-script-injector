import { Runtime } from "../chrome-api/runtime";
import { UserScripts } from "../chrome-api/userScripts";
import { scriptsStorage } from "./controllers/storage";

Runtime.onInstall({
  onAll: async () => {
    await scriptsStorage.setup();
    console.log(await scriptsStorage.getAll());
  },
  updateCb: async () => {
    const scripts = await scriptsStorage.get("scripts");
    console.log("scripts", scripts);

    // user scripts are cleared on update of service worker,
    // so we need to re-register them each time.
    scripts.forEach(async (script) => {
      const userScript = new UserScripts(script.id);
      await userScript.registerScript([script.url], script.code);
      console.log("registered script", script.id);
    });
  },
});
