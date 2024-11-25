import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import "./popup.css";
import AddScript from "./AddScript";
import ScriptList from "./ScriptList";
import { UserScripts } from "../chrome-api/userScripts";

import("./Toaster").then((module) => {
  module.toaster.setup();
});

const App: React.FC<{}> = () => {
  const [userScriptsAvailable, setUserScriptsAvailable] = React.useState(false);

  useEffect(() => {
    const userScriptsAvailable = UserScripts.isUserScriptsAvailable();
    setUserScriptsAvailable(userScriptsAvailable);
  }, []);

  if (!userScriptsAvailable) {
    return (
      <section>
        <h1 className="text-black text-lg text-center">User Scripts</h1>
        <p className="text-black text-center">
          User scripts are not available in this browser
        </p>
        <p className="text-black text-center">
          You must enable developer mode first
          <a
            href="chrome://extensions/"
            target="_blank"
            className="text-blue-500 cursor-pointer"
          >
            Enable Developer Mode
          </a>
        </p>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-black text-lg text-center">User Scripts</h1>
      <AddScript />
      <ScriptList />
    </section>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
