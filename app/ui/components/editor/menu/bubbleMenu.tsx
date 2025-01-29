import { BubbleMenu } from "@tiptap/react";
import React from "react";
import { EditorProp } from "./type";
import BoldNitalic from "./boldNitalic";
import SelectColor from "./color";
import SelectFont from "./font";
import { Highlighter } from "./highlight";

export const EditorBubbleMenu = ({
  editor,
  currentEditorState,
}: EditorProp) => {
  return (
    <>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 1000 }}>
          {currentEditorState && (
            <div className="flex flex-row gap-2 bubble-menu">
              <BoldNitalic
                editor={editor}
                currentEditorState={currentEditorState}
              />
              <SelectColor editor={editor} />
              <SelectFont editor={editor} />
              <Highlighter editor={editor} />
            </div>
          )}
        </BubbleMenu>
      )}
    </>
  );
};

export default EditorBubbleMenu;
