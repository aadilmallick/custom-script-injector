import React from "react";
import { useChromeStorage } from "../utils/ReactUtils";
import { Script, scriptsStorage } from "../background/controllers/storage";
import { UserScripts } from "../chrome-api/userScripts";
import PermissionsModel from "../chrome-api/permissions";

const useScriptStorage = () => {
  const { data, loading, setValueAndStore } = useChromeStorage(
    scriptsStorage,
    "scripts"
  );

  const addScript = React.useCallback(
    async (url: string, code: string) => {
      const currentScript = new UserScripts(crypto.randomUUID());
      const domainUrl = new URL(url).origin;
      const urlMatch = `${domainUrl}/*`;

      const permissions = new PermissionsModel({
        origins: [urlMatch],
      });
      const isGranted = await permissions.request();
      if (!isGranted) {
        return;
      }

      await currentScript.registerScript([urlMatch], code);
      const script: Script = {
        code,
        id: currentScript.id,
        url: urlMatch,
      };
      setValueAndStore([...data, script]);
    },
    [data]
  );

  const removeScript = React.useCallback(
    async (id: string) => {
      const currentScript = new UserScripts(id);
      await currentScript.unregisterScript();
      setValueAndStore(data.filter((script) => script.id !== id));
    },
    [data]
  );

  const updateScript = React.useCallback(
    async (id: string, code: string) => {
      const currentScript = new UserScripts(id);
      await currentScript.updateScript(code);
      setValueAndStore(
        data.map((script) => {
          if (script.id === id) {
            return { ...script, code };
          }
          return script;
        })
      );
    },
    [data]
  );

  return {
    scripts: data,
    storageLoading: loading,
    addScript,
    removeScript,
    updateScript,
  };
};

export default useScriptStorage;
