import React from "react";
import { caveateBrush, merriweather, roboto } from "../../../fonts";
import { EditorProp } from "./type";

export const SelectFont = ({ editor }: EditorProp) => {
  const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editor?.chain().focus().setFontFamily(event.target.value).run();
  };
  return (
    <>
      <select
        onChange={handleSelection}
        className="bg-[#7EBDC2] text-[#C2837E] font-bold"
      >
        <option value="">Select Font Family</option>
        <option value={roboto.style.fontFamily} data-test-id="roboto">
          Roboto
        </option>
        <option
          value={caveateBrush.style.fontFamily}
          data-test-id="caveat-brush"
        >
          Caveate Brush
        </option>
        <option
          value={merriweather.style.fontFamily}
          data-test-id="merriweather"
        >
          Merriweather
        </option>
      </select>
    </>
  );
};

export default SelectFont;
