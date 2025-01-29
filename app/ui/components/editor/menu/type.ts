import { Editor } from "@tiptap/react";

export type EditorProp = {
  editor: Editor | null;
  currentEditorState?: {
    isBold: boolean | undefined;
    isItalic: boolean | undefined;
  } | null;
};
