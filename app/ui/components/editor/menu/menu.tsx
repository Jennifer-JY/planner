import BoldNitalic from "./boldNitalic";
import SelectColor from "./color";
import SelectFont from "./font";
import { Highlighter } from "./highlight";
import { EditorProp } from "./type";

export const Menu = ({ editor, currentEditorState }: EditorProp) => {
  return (
    <div>
      {currentEditorState && (
        <div className="flex flex-row gap-2 bg-[#7EBDC2]">
          <BoldNitalic
            editor={editor}
            currentEditorState={currentEditorState}
          />
          <SelectColor editor={editor} />
          <SelectFont editor={editor} />
          <Highlighter editor={editor} />
        </div>
      )}
    </div>
  );
};

export default Menu;
