"use client";
import { JSONContent } from "@tiptap/react";
import ReadOnlyEditor from "../editor/readOnlyEditor";
import Link from "next/link";
import { useActionState, useState } from "react";
import { displayMonth } from "@/lib/actions";

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

const Calendar = () => {
  const [state, formAction] = useActionState(displayMonth, undefined);
  const [monthValue, setMonthValue] = useState(
    new Date().toISOString().slice(0, 7)
  );
  return (
    <>
      <form
        action={formAction}
        className="absolute top-2 left-1/2 transform -translate-x-1/2"
      >
        <label htmlFor="display-month"></label>
        <input
          id="display-month"
          type="month"
          name="month"
          value={monthValue}
          onChange={(e) => setMonthValue(e.target.value)}
        />
        <button type="submit">Go</button>
      </form>
      <div className="w-full h-full grid grid-cols-7 grid-rows-[1fr_4fr_4fr_4fr_4fr_4fr] border-2">
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
        <div>{state}</div>
        <span>Lorem ipsum dolor </span>
      </div>
    </>
  );
};

export default Calendar;
