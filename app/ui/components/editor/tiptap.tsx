"use client";

import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import {
  useEditor,
  EditorContent,
  useEditorState,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import Menu from "./menu/menu";
import EditorBubbleMenu from "./menu/bubbleMenu";

export const editorConfig = {
  immediatelyRender: false,
  shouldRerenderOnTransaction: false,
  extensions: [
    StarterKit,
    TextStyle,
    Typography,
    FontFamily.configure({
      types: ["textStyle"],
    }),
    Color.configure({
      types: ["textStyle"],
    }),
    Highlight.configure({
      HTMLAttributes: {
        class: "my-custom-class",
      },
      multicolor: true,
    }),
  ],
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
};

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

const Tiptap = () => {
  const countRenderRef = React.useRef(0);

  countRenderRef.current += 1;

  const editorContent = useEditor(editorConfig);
  const currentEditorStateContent = useMyeditorState(editorContent);

  const editorTitle = useEditor(editorConfig);
  const currentEditorStateTitle = useMyeditorState(editorTitle);

  if (!editorContent) return null;

  const giveMeJSON = () => {
    console.log(editorContent.getJSON());
    console.log(editorTitle?.getJSON());
  };
  console.log("Render");

  console.log(countRenderRef.current);

  return (
    <>
      <div className="flex gap-3 flex-col">
        <h2 className="font-bold">Title</h2>
        <div className="border-2 border-solid">
          <div className="border-b-2 border-b-solid">
            <EditorBubbleMenu
              editor={editorTitle}
              currentEditorState={currentEditorStateTitle}
            />
          </div>
          <EditorContent className="editor-title-input" editor={editorTitle} />
        </div>
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
