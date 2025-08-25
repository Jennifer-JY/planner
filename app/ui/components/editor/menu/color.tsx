import { useState, useEffect } from "react";
import { EditorProp } from "./type";

const DEFAULT_COLOR = "#000000";

export const SelectColor = ({ editor }: EditorProp) => {
  const [color, setColor] = useState(DEFAULT_COLOR);

  // Sync color from editor state
  useEffect(() => {
    if (!editor) return;

    const currentColor = editor.getAttributes("textStyle").color;
    if (currentColor && currentColor !== color) {
      setColor(currentColor);
    }
  }, [color, editor, editor?.state.selection]); // this hook will re-run when selection changes

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    editor?.chain().focus().setColor(newColor).run();
  };

  return (
    <div className="mt-1">
      <input
        type="color"
        value={color}
        onChange={handleInput}
        data-testid="setColor"
        aria-label="text color"
        title="text color"
      />
    </div>
  );
};

export default SelectColor;
