"use client";
import { JSONContent } from "@tiptap/react";
import ReadOnlyEditor from "../editor/readOnlyEditor";
import Link from "next/link";
import { useActionState, useState } from "react";
import { displayMonth } from "@/lib/actions";
import { daysInMonthDisplay } from "@/lib/helpersClient";

const days = [
  { value: "Mon", color: "#f94143" },
  { value: "Tue", color: "#f3732c" },
  { value: "Wed", color: "#f7961f" },
  { value: "Thur", color: "#f9c84f" },
  { value: "Fri", color: "#8fbe6b" },
  { value: "Sat", color: "#41aa8b" },
  { value: "Sun", color: "#53768d" },
];

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
  /**
   * Initial values for states
   */
  const initialMonthState = {
    todos: [],
    error: "",
  };

  const [displayDays, setDisplayDays] = useState(() => daysInMonthDisplay());
  const [state, formAction] = useActionState(displayMonth, initialMonthState);
  const [monthValue, setMonthValue] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleDisplay = () => {
    const [selectYear, selectMonth] = monthValue.split("-");
    const newDays = daysInMonthDisplay(Number(selectYear), Number(selectMonth));

    // only re-render when there's change
    if (JSON.stringify(newDays) !== JSON.stringify(displayDays)) {
      setDisplayDays(newDays);
    }
  };

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
        <button type="submit" onClick={handleDisplay}>
          Go
        </button>
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
        {displayDays.map((a) => {
          return (
            <div key={a} className="border inline-block max-w-full">
              <Link href="/calendar/edit">
                <span className="m-1 flex justify-center items-center border w-6 h-6 ">
                  {a <= 31 ? a : null}
                </span>
                <ReadOnlyEditor jsonContent={sampleJson} />
              </Link>
            </div>
          );
        })}
      </div>
      <div className="inline-block max-w-full">
        <div>{state?.error}</div>
        <span>Lorem ipsum dolor </span>
      </div>
    </>
  );
};

export default Calendar;
