import React, { forwardRef, useEffect, useRef } from "react";
import { Editor, PrismEditor } from "prism-react-editor";
import { BasicSetup } from "prism-react-editor/setups";

// Adding the JSX grammar
// Adds comment toggling and auto-indenting for JSX
import "prism-react-editor/prism/languages/jsx";
import "prism-react-editor/languages/jsx";

// Adding the CSS grammar
// Adds comment toggling and auto-indenting for CSS
import "prism-react-editor/prism/languages/css";
import "prism-react-editor/languages/css";

import "prism-react-editor/layout.css";
import "prism-react-editor/themes/github-dark.css";

// Required by the basic setup
import "prism-react-editor/search.css";

interface Props {
  language: "jsx" | "css" | "html";
  defaultCode?: string;
  onCodeChange?: (code: string) => void;
  styles?: React.CSSProperties;
}

export const usePrismEditorRef = () => {
  const editorRef = useRef<PrismEditor>(null);

  return editorRef;
};

const PrismCodeEditor = forwardRef(
  (props: Props, ref: React.ForwardedRef<PrismEditor>) => {
    const { language, defaultCode, onCodeChange, styles } = props;

    return (
      <Editor
        language={language}
        value={defaultCode ?? ""}
        wordWrap
        style={{
          width: "100%",
          ...styles,
        }}
        onUpdate={(value, editor) => {
          onCodeChange?.(value);
        }}
        ref={ref}
      >
        {(editor) => <BasicSetup editor={editor} />}
      </Editor>
    );
  }
);

export default PrismCodeEditor;
