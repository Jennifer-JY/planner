"use client";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import editorConfig from "./editor.config";

export const ReadOnlyEditor = ({
  jsonContent,
}: {
  jsonContent: JSONContent;
}) => {
  console.log("ReadOnlyEditor Content:", jsonContent);
  const editor = useEditor({
    ...editorConfig,
    content: jsonContent,
    editable: false,
  });

  if (!editor) {
    return <div>Loading...</div>;
  }

  return <EditorContent editor={editor} />;
};

export default ReadOnlyEditor;
