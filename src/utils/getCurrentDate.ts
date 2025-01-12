export const getCurrentDate = () => {
  const today = new Date();
  const currentYear = String(today.getFullYear()).slice(2, 4);
  const currentMonth = String(today.getMonth() + 1);
  const currentDay = String(today.getDate()).padStart(2, "0");
  const currentDate = {
    currentYear: currentYear,
    currentMonth: currentMonth,
    currentDay: currentDay,
  };

  return currentDate;
};
