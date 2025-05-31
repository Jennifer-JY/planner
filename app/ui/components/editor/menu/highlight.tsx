import { EditorProp } from "./type";

const colors = [
  {
    name: "Green",
    value: "#98FF98",
  },
  {
    name: "Yellow",
    value: "#FFFF98",
  },
  {
    name: "purple",
    value: "#FF98FF",
  },
];

export const Highlighter = ({ editor }: EditorProp) => {
  const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    editor
      ?.chain()
      .focus()
      .toggleHighlight({ color: event.target.value })
      .run();
  };
  return (
    <>
      <select
        onChange={handleSelection}
        className="bg-[#7EBDC2] text-white font-bold"
      >
        <option value="">Select Highlighter</option>
        {colors.map((c) => {
          return (
            <option key={c.name} value={c.value} data-test-id={c.name}>
              {c.name}
            </option>
          );
        })}
      </select>
    </>
  );
};
