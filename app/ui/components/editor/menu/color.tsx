import { EditorProp } from "./type";

export const SelectColor = ({ editor }: EditorProp) => {
  return (
    <>
      <div className="mt-1">
        <input
          type="color"
          onInput={(event) =>
            editor
              ?.chain()
              .focus()
              .setColor((event.target as HTMLInputElement).value)
              .run()
          }
          value={editor?.getAttributes("textStyle").color}
          data-testid="setColor"
        />
      </div>
    </>
  );
};

export default SelectColor;
