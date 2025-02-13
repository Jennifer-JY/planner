"use server";
import ReadOnlyEditor from "../editor/readOnlyEditor";
import Link from "next/link";
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

const Calendar = async ({ propMonthYear }: { propMonthYear: string }) => {
  const data = await displayMonth(propMonthYear);

  return (
    <>
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
        {data &&
          data.todos?.map((a) => {
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
        <div>{data?.error}</div>
        <span>Lorem ipsum dolor </span>
      </div>
    </>
  );
};

export default Calendar;
