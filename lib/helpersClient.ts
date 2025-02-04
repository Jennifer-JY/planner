export const daysInMonthDisplay = (
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1
) => {
  const days: number[] = [];
  const dayOfWeek = new Date(year, month - 1, 1).getDay();

  for (let i = 1; i < dayOfWeek; i++) {
    days.push(100 + i);
  }

  const numOfDays = new Date(year, month, 0).getDate();
  console.log(numOfDays);
  for (let i = 1; i <= numOfDays; i++) {
    days.push(i);
  }

  return days;
};
