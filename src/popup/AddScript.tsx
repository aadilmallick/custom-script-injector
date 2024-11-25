import React, { FormEvent } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useObjectState } from "../utils/ReactUtils";
import useScriptStorage from "./useScriptStorage";
import PrismCodeEditor, { usePrismEditorRef } from "./PrismCodeEditor";
import { toaster } from "./Toaster";
import { URLMatcherModel } from "./URLMatcherModel";

const AddScript = () => {
  const { state, setPartialState } = useObjectState({
    url: "",
    matchType: "match-domain" as "match-domain" | "match-path" | "match-exact",
  });
  const { addScript } = useScriptStorage();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const editorRef = usePrismEditorRef();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleClose();

    const code = editorRef.current?.value;
    console.log("code", code);

    if (!state.url || !code || !state.matchType) {
      toaster.danger("URL and code are required");
      return;
    }

    const matchPatternUrl = URLMatcherModel.generateUrlPattern(state.url, {
      matchDomain: state.matchType === "match-domain",
      matchPath: state.matchType === "match-path",
      matchExact: state.matchType === "match-exact",
    });

    await addScript(matchPatternUrl, code, state.url);
  };

  return (
    <>
      <button
        className="bg-blue-400 text-white font-semibold text-sm px-3 py-1 rounded-full block mx-auto"
        onClick={handleOpen}
      >
        Add Script
      </button>
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
        <form
          className="w-[90%] mx-auto p-4 bg-white/95 rounded-md space-y-2"
          onSubmit={onSubmit}
        >
          <label htmlFor="url" className="">
            Enter url
          </label>
          <div>
            <input
              type="url"
              id="url"
              className="border border-gray-300 rounded-md w-full p-1"
              required
              maxLength={256}
              minLength={10}
              value={state.url}
              onChange={(e) => setPartialState({ url: e.target.value })}
            />
          </div>
          <div>
            <select
              name="matchoptions"
              id="matchoptions"
              className="border border-gray-300 rounded-md w-full p-1"
              value={state.matchType}
              onChange={(e) =>
                setPartialState({
                  matchType: e.target.value as
                    | "match-domain"
                    | "match-path"
                    | "match-exact",
                })
              }
            >
              <option value="match-domain">Match Domain</option>
              <option value="match-path">Match Path</option>
              <option value="match-exact">Match Exact</option>
            </select>
          </div>
          <label htmlFor="code" className="text-for block">
            Type Code here
          </label>
          <div className="overflow-y-auto max-h-72">
            {/* <textarea
              id="code"
              rows={10}
              cols={30}
              className="border border-gray-300 rounded-md w-full p-1 resize-none h-56 overflow-y-auto"
              required
              minLength={1}
              maxLength={10000}
              ref={textareaRef}
            /> */}
            <PrismCodeEditor ref={editorRef} language="jsx" />
          </div>
          <button
            className="block w-full bg-blue-600 text-white font-semibold rounded-md py-2 px-4"
            type="submit"
          >
            Add
          </button>
        </form>
      </Backdrop>
    </>
  );
};

export default AddScript;
