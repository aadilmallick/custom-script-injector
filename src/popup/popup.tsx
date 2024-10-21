import React from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import "./popup.css";

const App: React.FC<{}> = () => {
  return (
    <div>
      <p className="text-white text-2xl underline font-black">Hello world</p>
      {/* this is how you refer to assets: they live in the static folder, and you refer to them
      absolutely. */}
      <img src="icon.png" />
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
