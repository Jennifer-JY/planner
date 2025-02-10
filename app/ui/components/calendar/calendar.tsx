"use client";
import ReadOnlyEditor from "../editor/readOnlyEditor";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { displayMonth } from "@/lib/actions";
import { JSONContent } from "@tiptap/react";

const days = [
  { value: "Mon", color: "#f94143" },
  { value: "Tue", color: "#f3732c" },
  { value: "Wed", color: "#f7961f" },
  { value: "Thur", color: "#f9c84f" },
  { value: "Fri", color: "#8fbe6b" },
  { value: "Sat", color: "#41aa8b" },
  { value: "Sun", color: "#53768d" },
];

const Calendar = () => {
  /**
   * Initial values for states
   */
  const initialMonthState = {
    todos: [],
    error: "",
  };
  const [state, formAction] = useActionState(displayMonth, initialMonthState);
  const [monthValue, setMonthValue] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("yearMonth", new Date().toISOString().slice(0, 7));
      formAction(formData);
    });
  }, []);

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
          name="yearMonth"
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
        {state &&
          state.todos?.map((a) => {
            if (a.day !== 0 && a.todoId !== "") {
              console.log("Rendering Todo:", a.day);
            }
            return (
              <div
                key={`${a.year}-${a.month}-${a.day}`}
                className="border inline-block max-w-full"
              >
                {a.day <= 31 && (
                  <Link href="/calendar/edit">
                    <span className="m-1 flex justify-center items-center border w-6 h-6 ">
                      {a.day}
                    </span>
                    <ReadOnlyEditor jsonContent={a.content as JSONContent} />
                  </Link>
                )}
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
