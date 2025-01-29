import { JSONContent } from "@tiptap/react";
import ReadOnlyEditor from "../editor/readOnlyEditor";
import Link from "next/link";

const arr: number[] = [];
const days = [
  { value: "Mon", color: "#f94143" },
  { value: "Tue", color: "#f3732c" },
  { value: "Wed", color: "#f7961f" },
  { value: "Thur", color: "#f9c84f" },
  { value: "Fri", color: "#8fbe6b" },
  { value: "Sat", color: "#41aa8b" },
  { value: "Sun", color: "#53768d" },
];
for (let i = 1; i <= 28; i++) {
  arr.push(i);
}

const sampleJson: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This is ",
        },
        {
          type: "text",
          text: "bold",
          marks: [
            {
              type: "bold",
            },
          ],
        },
        {
          type: "text",
          text: " and ",
        },
        {
          type: "text",
          text: "colored text",
          marks: [
            {
              type: "textStyle",
              attrs: {
                color: "#ff5733", // Orange color in HEX format
              },
            },
          ],
        },
        {
          type: "text",
          text: ".",
        },
      ],
    },
  ],
};

export const Calendar = () => {
  return (
    <>
      <div className="w-full h-full grid grid-cols-7 grid-rows-[1fr_4fr_4fr_4fr_4fr] border-2">
        {days.map((d) => {
          return (
            <div
              className="border text-white font-bold flex justify-center items-center"
              key={d.value}
              style={{ backgroundColor: d.color }}
            >
              {d.value}
            </div>
          );
        })}
        {arr.map((a) => {
          return (
            <div key={a} className="border inline-block max-w-full">
              <Link href="/calendar/edit">
                <span className="m-1 flex justify-center items-center border w-6 h-6 ">
                  {a}
                </span>
                <ReadOnlyEditor jsonContent={sampleJson} />
              </Link>
            </div>
          );
        })}
      </div>
      <div className="inline-block max-w-full">
        <span>Lorem ipsum dolor </span>
        <div className="inline">
          <p className="inline">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            modi, placeat distinctio, qui ea commodi dicta corrupti quidem vel
            molestias magni dolorum magnam, quisquam aliquid deleniti unde
            dolore necessitatibus! Quaerat! Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Inventore modi, placeat distinctio,
            qui ea commodi dicta corrupti quidem vel molestias magni dolorum
            magnam, quisquam aliquid deleniti unde dolore necessitatibus!
            Quaerat!
          </p>
        </div>
      </div>
    </>
  );
};

export default Calendar;
