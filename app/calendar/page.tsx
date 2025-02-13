import { Suspense } from "react";
import Calendar from "../ui/components/calendar/calendar";
import SearchDate from "../ui/components/calendar/searchDate";
import { CalendarSkeleton } from "../ui/components/skeletons";

const CalendarPage = async (props: {
  searchParams: Promise<{ date: string }>;
}) => {
  const searchParams = await props.searchParams;
  const date = searchParams.date || new Date().toISOString().slice(0, 7);
  return (
    <div className="h-full">
      <SearchDate />
      <Suspense key={date} fallback={<CalendarSkeleton />}>
        <Calendar propMonthYear={date} />
      </Suspense>
    </div>
  );
};

export default CalendarPage;
