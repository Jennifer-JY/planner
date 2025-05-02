"use client";

import {
  useEditor,
  EditorContent,
  useEditorState,
  Editor,
  JSONContent,
} from "@tiptap/react";
import React, { useState } from "react";
import Menu from "./menu/menu";
import editorConfig from "./editor.config";
import { useParams, useRouter } from "next/navigation";
import { saveTodo } from "@/lib/actions";

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
  const params = useParams(); // returns an object of dynamic route segments
  const date: string = params.date as string; // will be "2025-1-9" as a string

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const editorContent = useEditor({
    ...editorConfig,
    content: content,
    editable: true,
  });

  const currentEditorStateContent = useMyeditorState(editorContent);

  if (!editorContent) return null;

  /**
   * When using app/actions.ts in the App Router with Server Actions,
   * and you pass editorContent.getJSON() directly into your saveTodo() function,
   * Next.js strips non-serializable properties silently, especially nested objects
   * like attrs.This is a known limitation with Server Actions + use server, which
   * expects the input to be plain serializable JSON.
   */
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    const oriPayload = editorContent.getJSON();
    const payload = JSON.parse(JSON.stringify(oriPayload));

    try {
      await saveTodo(payload, date);
      console.log("not saved to the dataset");
      router.push("/calendar");
    } catch (error) {
      console.error("Failed to save todo:", error);
      setErrorMessage("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // const giveMeJSON = () => {
  //   console.log(editorContent.getJSON());
  // };

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
            onClick={handleSave}
            disabled={isSaving}
            className={`w-24 h-10 rounded-md font-bold ${
              isSaving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#e98a15] text-[#F3DFA2] hover:bg-[#C2837E]"
            }`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          {errorMessage && (
            <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Tiptap;
