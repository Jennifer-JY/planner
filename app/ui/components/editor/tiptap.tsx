"use client";

import {
  useEditor,
  EditorContent,
  useEditorState,
  Editor,
  JSONContent,
} from "@tiptap/react";
import React from "react";
import Menu from "./menu/menu";
import editorConfig from "./editor.config";

const useMyeditorState = (editor: Editor | null) => {
  return useEditorState({
    /**
     * The editor instance we want to use.
     */
    editor,
    /**
     * This selector allows us to select the data we want to use in our component.
     * It is evaluated on every editor transaction and compared to it's previously returned value.
     */
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold"),
      isItalic: ctx.editor?.isActive("italic"),
    }),
    /**
     * This function allows us to customize the equality check for the selector.
     * By default it is a `===` check.
     */
    equalityFn: (prev, next) => {
      // A deep-equal function would probably be more maintainable here, but, we use a shallow one to show that it can be customized.
      if (!next) {
        return false;
      }
      return prev.isBold === next.isBold && prev.isItalic === next.isItalic;
    },
  });
};

const Tiptap = ({ content }: { content: JSONContent }) => {
  const editorContent = useEditor({
    ...editorConfig,
    content: content,
    editable: true,
  });

  const currentEditorStateContent = useMyeditorState(editorContent);

  if (!editorContent) return null;

  const giveMeJSON = () => {
    console.log(editorContent.getJSON());
  };

  return (
    <>
      <div className="flex gap-3 flex-col">
        <h2 className="font-bold">Content</h2>
        <div className="border-2 border-solid">
          <div className="border-b-2 border-b-solid">
            <Menu
              editor={editorContent}
              currentEditorState={currentEditorStateContent}
            />
          </div>
          <EditorContent
            className="editor-content-input"
            editor={editorContent}
          />
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={giveMeJSON}
            className="bg-[#e98a15] text-[#F3DFA2] rounded-md w-24 h-10 hover:bg-[#C2837E] font-bold"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default Tiptap;
