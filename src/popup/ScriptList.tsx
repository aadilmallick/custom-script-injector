import React from "react";
import useScriptStorage from "./useScriptStorage";
import { Script } from "../background/controllers/storage";
import Backdrop from "@mui/material/Backdrop";
import PrismCodeEditor, { usePrismEditorRef } from "./PrismCodeEditor";

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
  const editorRef = usePrismEditorRef();

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const onSave = async () => {
    const code = editorRef.current?.value;
    console.log("saving code...", code);
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
        sx={(theme) => ({
          color: "black",
          zIndex: theme.zIndex.drawer + 1,
          flexDirection: "column",
        })}
        open={open}
      >
        <button
          className="absolute top-1 right-1 text-red-500 text-base bg-white shadow-lg h-8 w-8 p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors"
          onClick={handleClose}
        >
          X
        </button>
        <div className="w-[95%] mx-auto bg-white p-1 overflow-y-auto max-h-96">
          <PrismCodeEditor
            ref={editorRef}
            language="jsx"
            defaultCode={script.code}
          />
        </div>
        <button
          className="block w-[95%] mx-auto bg-blue-600 text-white font-semibold rounded-md py-2 px-4 mt-2"
          onClick={onSave}
        >
          Save
        </button>
      </Backdrop>
    </>
  );
};

export default ScriptList;
