"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchDate = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleDateChange = (date: string) => {
    const params = new URLSearchParams(searchParams);
    if (date) {
      params.set("date", date);
    } else {
      params.set("date", new Date().toISOString().slice(0, 7));
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <form className="absolute top-2 left-1/2 transform -translate-x-1/2">
        <label htmlFor="display-month"></label>
        <input
          id="display-month"
          type="month"
          name="yearMonth"
          defaultValue={
            searchParams.get("date")?.toString() ||
            new Date().toISOString().slice(0, 7)
          }
          onChange={(e) => handleDateChange(e.target.value)}
        />
      </form>
    </>
  );
};

export default SearchDate;
