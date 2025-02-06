export const daysInMonthDisplay = (
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1
) => {
  const days: number[] = [];
  const dayOfWeek = new Date(year, month - 1, 1).getDay();
  const numOfDays = new Date(year, month, 0).getDate();
  if (isNaN(dayOfWeek) || isNaN(numOfDays))
    throw new Error("Invalid input: Invalid year-month");

  for (let i = 1; i < dayOfWeek; i++) {
    days.push(0);
  }

  for (let i = 1; i <= numOfDays; i++) {
    days.push(i);
  }

  return days;
};
