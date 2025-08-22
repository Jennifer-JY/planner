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
        {/* Header row */}
        {days.map((d) => (
          <div
            key={d.value}
            className="border text-white font-bold flex justify-center items-center"
            style={{ backgroundColor: d.color }}
          >
            {d.value}
          </div>
        ))}

        {/* Calendar cells */}
        {data &&
          data.todos?.map((a) => {
            const key = `${a.year}-${a.month}-${a.day}`;

            if (a.day > 31) {
              // Just render an empty placeholder
              return (
                <div key={key} className="border inline-block max-w-full" />
              );
            }

            return (
              <Link
                key={key}
                href={`/calendar/${a.year}-${a.month}-${a.day}/edit`}
              >
                <div className="border inline-block max-w-full h-full w-full cursor-pointer p-1">
                  <span className="m-1 flex justify-center items-center border w-6 h-6">
                    {a.day}
                  </span>
                  <ReadOnlyEditor jsonContent={a.content as JSONContent} />
                </div>
              </Link>
            );
          })}
      </div>

      <div className="inline-block max-w-full">
        <div>{data?.error}</div>
      </div>
    </>
  );
};

export default Calendar;
