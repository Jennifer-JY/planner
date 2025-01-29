import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";

import StarterKit from "@tiptap/starter-kit";

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

export default editorConfig;
