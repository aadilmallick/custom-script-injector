import React from "react";
import useScriptStorage from "./useScriptStorage";
import { Script } from "../background/controllers/storage";
import Backdrop from "@mui/material/Backdrop";

const ScriptList = () => {
  const { scripts, storageLoading } = useScriptStorage();
  if (storageLoading || !scripts) {
    return null;
  }
  return (
    <ul className="border-t-2 pb-4 h-full overflow-y-auto px-1">
      {scripts.map((script) => (
        <ScriptRow key={script.id} script={script} />
      ))}
    </ul>
  );
};

const ScriptRow = ({ script }: { script: Script }) => {
  const { removeScript, updateScript } = useScriptStorage();
  const [open, setOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const onSave = async () => {
    const code = textareaRef.current?.value;
    if (code === null || code === undefined) {
      return;
    }
    await updateScript(script.id, code);
    handleClose();
  };
  return (
    <>
      <li
        className="flex justify-between items-center hover:bg-gray-100 transition-colors p-1 cursor-pointer"
        onClick={handleOpen}
      >
        <a
          onClick={(e) => e.stopPropagation()}
          href={new URL(script.url).origin}
          className="text-blue-300 hover:underline inline-block"
        >
          {script.url}
        </a>{" "}
        <button
          className="bg-gray-200 shadow-sm h-8 w-8 rounded-full p-1 text-red-500 hover:bg-gray-400 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            removeScript(script.id);
          }}
        >
          X
        </button>
      </li>
      <Backdrop
        sx={(theme) => ({ color: "black", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <button
          className="absolute top-1 right-1 text-red-500 text-base bg-white shadow-lg h-8 w-8 p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors"
          onClick={handleClose}
        >
          X
        </button>
        <div className="w-[95%] h-4/5 mx-auto bg-white p-1">
          <textarea
            id="code"
            rows={10}
            cols={30}
            className="border-2 border-gray-300 rounded-md w-full p-1 resize-none h-96 overflow-y-auto font-mono text-black"
            minLength={1}
            maxLength={10000}
            ref={textareaRef}
            defaultValue={script.code}
          />
          <button
            className="block w-full bg-blue-600 text-white font-semibold rounded-md py-2 px-4"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </Backdrop>
    </>
  );
};

export default ScriptList;
